﻿CD.AccidentForm = {
    selectedFilePath: null,
    selecedFile: null,
    selectedId: null,
    selectedCaseId: null,
    oVehicleTable: null,
    oWitnessTable: null,
    oChargeTable: null,
    oOccupantTable: null,
    selectedItem: null,
    selectedReport: null,
    addUpdateStatus: 1,
    signedRole: null,
    init: function() {
        $('#selectedcdformfile').change(function(e) {
            // assign selected file path to selectedFilePath variable 
            CD.AccidentForm.selectedFilePath = this.value;
            CD.AccidentForm.selectedFile = $("#selectedcdformfile")[0].files[0];
            $("#SelectedFormpath").html(this.value);
        });

        //$("#btn_OpenSyncDlg").click(function() {
        //    //Helpers.showNotificationModal("Login Error", "Your login has expired. Please log in again to continue.");
        //    Helpers.showSyncFormDataModal();
        //});

        //$("#btn_OpenSyncDlg_Edit").click(function() {
        //    //Helpers.showNotificationModal("Login Error", "Your login has expired. Please log in again to continue.");
        //    Helpers.showSyncFormDataModal();
        //});

        // https://stackoverflow.com/questions/20052839/cant-bind-events-to-inputs-within-jquery-steps-wizard 
        $("#reloadFormBtn").click(function() {
                Helpers.handleFileSelect(CD.AccidentForm.selectedFile);
            }),

        $('#btn_submitAccdForm').click(function() {

            if (Offline.state === 'down') {
                //Offline.check();
                Helpers.showNotificationModal("Create Error", "There is no internet connection. Please try again!");
                return false;
            } else {
                var validation = CD.AccidentForm.fnCreateValidationMsg();
                if (validation) {
                    //Do ajax call for token
                    Helpers.showSaveStatusModal("Sync Investigation Report",
                        "A new report will be created.",
                        function () {
                            Promise.all([
                                CD.services.createInvestigation("accidentForm")
                            ]).then(function success(values) {

                                var reportId = values[0];
                                window.open(siteBaseUrl + "Home/Index", "_self");
                            });
                            return true;
                        },
                                function () {
                                    //Do nothing
                                }
                    );
                }
                else {
                    Helpers.showNotificationModal("Create Error", "There are some required fields not filled yet, please check!");
                }
                return false;
            }
        });

        $('#btn_submitAccdForm_Edit').click(function() {

            if (Offline.state === 'down') {
                //Offline.check();
                //var formData = $('form#accidentForm_Edit').serializeArray();
                //var formJSON = Helpers.serializeObject(formData);
                ///*Helpers.saveJSON2Txt("C:/testbaltimoreCity.txt", formJSON);
                //download(formJSON, "BaltimoreCity.txt", "text/plain");*/

                //var reportId = formData[0].value;
                //var localforageId = 0;
                //if (reportId > 0) {
                //    localforageId = Helpers.getlocalforageReportKey(reportId);
                //    var formData = $('form#accidentForm_Edit').serializeArray();
                //    //Save report info back to localforage
                //    localforage.setItem(localforageId, {
                //        form: formData,
                //        reportID: reportId
                //    }).then(
                //        function success() {},
                //        function failure(err) {}
                //    );
                //}
                Helpers.showNotificationModal("Internet Offline", "There is no internet connection, the report fails to be saved. Please try again when there is internet connection.");

            } else {

                var validation = CD.AccidentForm.fnCreateValidationMsg();
                if (validation) {
                    var currStep = CD.AccidentForm.fnGetCurrentStep();
                    // if current section is on the report basic info page, we need to save the changes to the local first before committing to the global
                    if (currStep == 1) {
                        CD.AccidentForm.fnUpdateReportInfo_Step1();
                    }
                    var reportObj = CD.AccidentForm.selectedReport;
                    if (typeof reportObj != "undefined" && reportObj != null) {
                        Promise.all([
                       CD.services.editInvestigation(reportObj)
                        ]).then(function success(values) {
                            var reportId = values[0];
                            Helpers.showNotificationModal("Sync Investigation Report",
                                "The Investigation report has been synced successfully.");

                            if (!$("#btn_submitAccdForm_Edit").hasClass('btn-success')) {
                                $("#btn_submitAccdForm_Edit").removeClass('btn-danger');
                                $("#btn_submitAccdForm_Edit").addClass('btn-success');
                                $("#CommitStatus").html("");
                            }

                        }, function failure(err) {
                            Helpers.showNotificationModal("Report Save failed", "An error occurred when saving data to the server. Please check your internet connection. " + err);

                        });
                        return true;
                    }
                }
                else {
                    Helpers.showNotificationModal("Create Error", "There are some required fields not filled yet, please check!");
                }
               
            }
        });

        $("#btn_inkSignOfficer_Edit").click(function (event) {
           
            CD.AccidentForm.fnClearCanvas();
            $("#inkSignModal").modal({ backdrop: 'static', keyboard: false });
            CD.AccidentForm.signedRole = 1;
        });

        $("#btn_inkSignSupervisor_Edit").click(function (event) {
            CD.AccidentForm.fnClearCanvas();
            $("#inkSignModal").modal({ backdrop: 'static', keyboard: false });
            CD.AccidentForm.signedRole = 2;
        });
        $("#btn_inkSignDriver_Edit").click(function (event) {
            CD.AccidentForm.fnClearCanvas();
            $("#inkSignModal").modal({ backdrop: 'static', keyboard: false });
            CD.AccidentForm.signedRole = 3;
        });

        var form = $("#accidentForm").show();
        CD.AccidentForm.InitReportCaseObj();
        //CD.AccidentForm.fnInitMultiStepForm();

        window.onbeforeunload = function (e) {
            var curentURL = window.location.href;
            sessionStorage.setItem('HideLoginModal', true);

            if (curentURL.includes("EditAccidentReport")) {
                return true;
            }
            else if (curentURL.includes("CreateAccidentReport")) {
                return true;
            }
        };
    },

    fnClearCanvas: function(){
        var canvas = $('#signature-pad')[0]; // or document.getElementById('canvas');
        canvas.width = canvas.width;
    },
    fnInitReportInfo: function() {
        // checkbox change event bind 
        $('input[type="checkbox"]').change(function() {
            this.value = (Number(this.checked));
        });
    },

    fnGetCurrentStep: function(){
        var navListItems = $('div.setup-panel div a');
        for (var nav in navListItems) {        
            if ($(navListItems[nav]).hasClass("btn-success")) {
                var step = $(navListItems[nav]).html();
                return step;
            }
        }
        return -1;
    },

    fnInitMultiStepForm: function() {
        var navListItems = $('div.setup-panel div a'),
            allWells = $('.setup-content'),
            allNextBtn = $('.nextBtn');

        allWells.hide();

        navListItems.click(function(e) {
            e.preventDefault();
            var $target = $($(this).attr('href')),
                $item = $(this);

            //if (!$item.hasClass('disabled')) {
            navListItems.removeClass('btn-success').addClass('btn-default');
            $item.addClass('btn-success');
            allWells.hide();
            $target.show();
            $target.find('input:eq(0)').focus();
            var step = $target[0].id.split("-")[1];
            // if it's at report edit page, when users click the next button, the  local changes will be saved automatically
            if (step == 2) {
                CD.AccidentForm.fnUpdateReportInfo_Step1();
            };
            CD.AccidentForm.fnUpdateProgress(step);
            //}
        });


        allNextBtn.click(function() {
            var curStep = $(this).closest(".setup-content"),
                curStepBtn = curStep.attr("id"),
                nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
                curInputs = curStep.find("input[type='text'],input[type='url']"),
                isValid = true;

            $(".form-group").removeClass("has-error");
            for (var i = 0; i < curInputs.length; i++) {
                if (!curInputs[i].validity.valid) {
                    isValid = false;
                    $(curInputs[i]).closest(".form-group").addClass("has-error");
                }
            }

            if (isValid) nextStepWizard.removeAttr('disabled').trigger('click');
        });

        $('div.setup-panel div a.btn-success').trigger('click');

    },

    fnUpdateProgress: function(step) {
        var $percent = (step / 6) * 100;
        $('.progress-bar').css({
            width: $percent + '%'
        });
    },

    // To do - Field Validation for Accident Report Update and Create 
    fnCreateValidationMsg: function(step) {
        var Error = "The Field is required!"
        var Warn = "Maximum of 50 characters allowed!"
        var Name = $("#keyword").val();

        if (Name == '') {
            $("#accidentForm_validation").html(Error);
        } else if (Name.length > 50) {
            $("#accidentForm_validation").html(Warn);
        } else {
            $("#accidentForm_validation").html("");
        }

        if (Name != '' && Name.length < 50) {
            return true;
        } else {
            return false;
        }
    },

    fnUpdateReportInfo_Step2: function(){

    }, 

    fnUpdateReportInfo_Step1: function () {
        CD.AccidentForm.InitReportInfoEvents();
        CD.AccidentForm.selectedItem.CaseNumber = $("#report_CaseNumber_Edit").val();
        CD.AccidentForm.selectedItem.CSR_Number = $("#report_CSRNumber_Edit").val();
        var res_SupervisorScene_Response = 0;
        if ($("#chk_sup_response_edit").is(":checked") == true) {
            res_SupervisorScene_Response = 1;
        }
        CD.AccidentForm.selectedItem.SupervisorScene_Response = res_SupervisorScene_Response;

        var res_SafetyOfficerScene_Reponse = 0;
        if ($("#chk_safetyOfficer_response_edit").is(":checked") == true) {
            res_SafetyOfficerScene_Reponse = 1;
        }
        CD.AccidentForm.selectedItem.SafetyOfficerScene_Reponse = res_SafetyOfficerScene_Reponse;

        var res_PhotoTaken = 0;
        if ($("#chk_photoTaken_edit").is(":checked") == true) {
            res_PhotoTaken = 1;
        }
        CD.AccidentForm.selectedItem.PhotoTaken = res_PhotoTaken;

        var res_SeatBelt = 0;
        if ($("#chk_seatBelt_edit").is(":checked") == true) {
            res_SeatBelt = 1;
        }
        CD.AccidentForm.selectedItem.Seatbelt_InUse = res_SeatBelt;
        

        var res_PCD_Driver_Perm = 0;
        if ($("#chk_PCDPossession_edit").is(":checked") == true) {
            res_PCD_Driver_Perm = 1;
        }
        CD.AccidentForm.selectedItem.PCD_Driver_Perm = res_PCD_Driver_Perm;

        var res_PCD_InUse = 0;
        if ($("#chk_PCDInUse_edit").is(":checked") == true) {
            res_PCD_InUse = 1;
        }
        CD.AccidentForm.selectedItem.PCD_InUse = res_PCD_InUse;
      
        CD.AccidentForm.selectedItem.Control1Call_Time = $("#Control1Call_Time").val();
        CD.AccidentForm.selectedItem.PoliceReport_Number = $("#report_PoliNumber_Edit").val();
        CD.AccidentForm.selectedItem.AccidentLocation = $("#report_AccidentLoc_Edit").val();
        CD.AccidentForm.selectedItem.WeatherCondition = $("#report_WeatherCondt_Edit").val();
        CD.AccidentForm.selectedItem.VehiclesInvolved_Number = $("#report_VesInvolved_Edit").val();

        var res_Police_Investigation = 0;
        if ($("#chk_InvestPol_edit").is(":checked") == true) {
            res_Police_Investigation = 1;
        }
        CD.AccidentForm.selectedItem.Police_Investigation = res_Police_Investigation;

        var res_Pedestrian_Involved = 0;
        if ($("#chk_PedInvolved_edit").is(":checked") == true) {
            res_Pedestrian_Involved = 1;
        }
        CD.AccidentForm.selectedItem.Pedestrian_Involved = res_Pedestrian_Involved;
        CD.AccidentForm.selectedItem.AccidentDesc = $("#Textarea_AccidentDes_edit").val();
     
        Helpers.updateReportChildByType(5, CD.AccidentForm.selectedItem);
    },

    fnInsertSignDrawImages: function () {
        //Get CD.AccidentForm.selectedItem
        //Helpers.getReportChildByType(5, null);
        var dataUrl_SafetyOfficerSign, dataUrl_SupervisorSign,
              dataUrl_DriverSig, dataUrl_IntsSketch;
        if (CD.AccidentForm.selectedReport != null) {
            dataUrl_SafetyOfficerSign = CD.AccidentForm.selectedReport.accidentReport.SafetyOfficerSig;
            dataUrl_SupervisorSign = CD.AccidentForm.selectedReport.accidentReport.SupervisorSig;
            dataUrl_DriverSig = CD.AccidentForm.selectedReport.accidentReport.DriverSig;
            dataUrl_IntsSketch = CD.AccidentForm.selectedReport.accidentReport.IntsSketch;
            if (document.getElementById("SafetyOfficerSign_edit") != null) {
                CD.AccidentForm.fnCreateImagesFromBlob("SafetyOfficerSign_edit", dataUrl_SafetyOfficerSign);
                CD.AccidentForm.fnCreateImagesFromBlob("SupervisorSign_edit", dataUrl_SupervisorSign);
                CD.AccidentForm.fnCreateImagesFromBlob("DriverSign_edit", dataUrl_DriverSig);
                CD.AccidentForm.fnCreateImagesFromBlob("SafetyOfficerSketch_Edit", dataUrl_IntsSketch);
            }
        }
    },
  
    fnCreateImagesFromBlob: function (div, blob) {
        if (typeof blob != 'undefined' && blob != null && blob != "") {
            var image = new Image();
            image.src = "data:image/png;base64," + blob;
            document.getElementById(div).appendChild(image);
            if (div == "SafetyOfficerSign_edit") {
                Helpers.updateReportChildByType(8, image.src);
            }
            else if (div == "SupervisorSign_edit") {
                Helpers.updateReportChildByType(7, image.src);
            }
            else if (div == "DriverSign_edit") {
                Helpers.updateReportChildByType(6, image.src);
            }
            else if (div == "SafetyOfficerSketch_Edit") {
                Helpers.updateReportChildByType(9, image.src);
            }
        }
    },

    fnPopulateVehicleForm: function(Id) {
        if (Id == null) {
            Helpers.showNotificationModal("Error", "Please make sure that a specific row has been selected.");
        } else {
            $("#mdl_vehicleEdit").modal();
            $("#mdl_vehicleLabel").html("Edit Vehicle");
            Helpers.getReportChildByType(1, Id);
            CD.AccidentForm.fnPopulateVehicleFields(CD.AccidentForm.selectedItem);
        }
    },

    fnPopulateVehicleFields: function(selectedItem) {
        if (selectedItem != null) {
            if (selectedItem.CityDriver == 1) {
                $("#chk_cityDriver_edit").prop("checked", true);
            }
            else {
                $("#chk_cityDriver_edit").prop("checked", false);
            }

            if (selectedItem.Driver_CDL == 1) {
                $("#DriverCDL_edit").prop("checked", true);
            }
            else {
                $("#DriverCDL_edit").prop("checked", false);
            }

            if (selectedItem.Driver_POST == 1) {
                $("#DriverPOST_edit").prop("checked", true);
            }
            else {
                $("#DriverPOST_edit").prop("checked", false);
            }

            $("#veh_licenseNo_edit").val(selectedItem.DriverLicense_Number);
            $("#city_permit_edit").val(selectedItem.CityPermitNo);
            $("#Driver_Sex").val(selectedItem.Driver_Sex);
            $("#Driver_DOB").val(selectedItem.Driver_DOB);
            $("#Driver_homePhone").val(selectedItem.Driver_Homephone);
            $("#Driver_FirstName_edit").val(selectedItem.Driver_FirstName);
            $("#Driver_MiddleName_edit").val(selectedItem.Driver_MiddleName);
            $("#Driver_LastName_edit").val(selectedItem.Driver_lastName);

            //$("#DriverPOST_edit").val(selectedItem.Driver_POST);
            $("#Driver_City_edit").val(selectedItem.Driver_City);
            $("#Driver_State_edit").val(selectedItem.Driver_State);
            $("#Driver_County_edit").val(selectedItem.Driver_County);
            $("#Driver_Zipcode_edit").val(selectedItem.Driver_Zipcode);
            $("#Driver_Agency_edit").val(selectedItem.Driver_Agency);
            $("#Driver_Bureau_edit").val(selectedItem.Driver_Bureau);
            $("#Driver_BusinessPhone_edit").val(selectedItem.Driver_BusinessPhone);
            $("#Driver_ImpactVehicle_edit").val(selectedItem.Vehicle_pointImpact);
            $("#Driver_ExtDamage").val(selectedItem.Vehicle_ExtDamage);
            $("#Driver_TagNo_edit").val(selectedItem.VehicleTag);
            $("#Driver_TagYear_edit").val(selectedItem.VehicleYear);
            $("#Driver_TagState_edit").val(selectedItem.VehicleState);
            $("#Driver_Fleet_edit").val(selectedItem.Fleet_ShopNumber);
            $("#Driver_yearmake_edit").val(selectedItem.Vehicle_Yearmake);
            $("#Driver_SerialNo_edit").val(selectedItem.Vehicle_SerialNumber);
            $("#Driver_Address_edit").val(selectedItem.Driver_Address);
            $("#Driver_OtherSpecify_edit").val(selectedItem.OtherSpecify);

            $("#Owner_Name_edit").val(selectedItem.Owner_Name);
            $("#Owner_Address_edit").val(selectedItem.Owner_Address);
            $("#Owner_Phone_edit").val(selectedItem.Owner_Phone);
            $("#Owner_InsuranceCom_edit").val(selectedItem.Owner_InsuranceCom);
            $("#Owner_PolicyNo_edit").val(selectedItem.Owner_PolicyNo);

            $("#Driver_ExpDate").val(selectedItem.Driver_ExpDate);
            $("#Driver_VehicleState").val(selectedItem.Driver_VehicleState);

        }
    },

    fnAddVehicleItem: function() {
        var id = Helpers.findMaxChildrenID(1) + 1;
        var CaseId = CD.AccidentForm.selectedReport.accidentReport.CaseId;
        var cityDriverRes = 0;
        var cityCDLRes = 0;
        var cityPOSTRes = 0;
        if ($("#chk_cityDriver_edit").is(":checked") == true) {
            cityDriverRes = 1;
        }

        if ($("#DriverCDL_edit").is(":checked") == true) {
            cityCDLRes = 1;
        }

        if ($("#DriverPOST_edit").is(":checked") == true) {
            cityPOSTRes = 1;
        }

        var vehicle = null;
        if (id >= 0 && CaseId >= 0) {
            vehicle = {
                VehicleId: id,
                CaseId: CaseId,
                CityDriver: cityDriverRes,
                DriverLicense_Number: $("#veh_licenseNo_edit").val(),
                CityPermitNo: $("#veh_licenseNo_edit").val(),
                Driver_FirstName: $("#Driver_FirstName_edit").val(),
                Driver_MiddleName: $("#Driver_MiddleName_edit").val(),
                Driver_lastName: $("#Driver_LastName_edit").val(),
                Driver_Sex: $("#Driver_Sex").val(),
                Driver_DOB: $("#Driver_DOB").val(),
                Driver_Homephone: $("#Driver_Homephone").val(),
                Driver_CDL: cityCDLRes,
                Driver_POST: cityPOSTRes,
                Driver_Address: $("#Driver_Address_edit").val(),
                Driver_City: $("#Driver_City_edit").val(),
                Driver_State: $("#Driver_State_edit").val(),
                Driver_County: $("#Driver_County_edit").val(),
                Driver_Zipcode: $("#Driver_Zipcode_edit").val(),
                Driver_Agency: $("#Driver_Agency_edit").val(),
                Driver_Bureau: $("#Driver_Bureau_edit").val(),
                Driver_BusinessPhone: $("#Driver_BusinessPhone_edit").val(),
                Vehicle_pointImpact: $("#Driver_ImpactVehicle_edit").val(),
                Vehicle_ExtDamage: $("#Driver_ExtDamage").val(),
                Fleet_ShopNumber: $("#Driver_Fleet_edit").val(),
                Vehicle_Yearmake: $("#Driver_yearmake_edit").val(),
                Vehicle_SerialNumber: $("#Driver_SerialNo_edit").val(),
                VehicleTag: $("#Driver_TagNo_edit").val(),
                VehicleYear:  $("#Driver_TagYear_edit").val(),
                VehicleState: $("#Driver_TagState_edit").val(),
                OtherSpecify: $("#Driver_OtherSpecify_edit").val(),

                Owner_Name: $("#Owner_Name_edit").val(),
                Owner_Address: $("#Owner_Address_edit").val(),
                Owner_Phone: $("#Owner_Phone_edit").val(),
                Owner_InsuranceCom: $("#Owner_InsuranceCom_edit").val(),
                Owner_PolicyNo: $("#Owner_PolicyNo_edit").val(),
                Driver_ExpDate: $("#Driver_ExpDate").val(),
                Driver_VehicleState: $("#Driver_VehicleState").val()


                
            };
            Helpers.addReportChildByType(1, vehicle);
            $("#mdl_vehicleEdit").modal("hide");
        }

    },

    fnUpdateVehicleItem: function() {
        var cityDriverRes = 0;
        if($("#chk_cityDriver_edit").is(":checked") == true){
            cityDriverRes = 1;
        }

        var cityCDLRes = 0;
        if ($("#DriverCDL_edit").is(":checked") == true) {
            cityCDLRes = 1;
        }

        var cityPOSTRes = 0;
        if ($("#DriverPOST_edit").is(":checked") == true) {
            cityPOSTRes = 1;
        }

        CD.AccidentForm.selectedItem.CityDriver = cityDriverRes;
        CD.AccidentForm.selectedItem.DriverLicense_Number = $("#veh_licenseNo_edit").val();
        CD.AccidentForm.selectedItem.CityPermitNo = $("#veh_licenseNo_edit").val();
        CD.AccidentForm.selectedItem.Driver_FirstName = $("#Driver_FirstName_edit").val();
        CD.AccidentForm.selectedItem.Driver_MiddleName = $("#Driver_MiddleName_edit").val();
        CD.AccidentForm.selectedItem.Driver_lastName = $("#Driver_LastName_edit").val();
        CD.AccidentForm.selectedItem.Driver_Sex = $("#Driver_Sex").val();
        CD.AccidentForm.selectedItem.Driver_DOB = $("#Driver_DOB").val();
        CD.AccidentForm.selectedItem.Driver_Homephone = $("#Driver_homePhone").val();
        CD.AccidentForm.selectedItem.Driver_CDL = cityCDLRes;
        CD.AccidentForm.selectedItem.Driver_POST = cityPOSTRes;
        CD.AccidentForm.selectedItem.Driver_Address = $("#Driver_Address_edit").val();
        CD.AccidentForm.selectedItem.Driver_City = $("#Driver_City_edit").val();
        CD.AccidentForm.selectedItem.Driver_State = $("#Driver_State_edit").val();
        CD.AccidentForm.selectedItem.Driver_County = $("#Driver_County_edit").val();
        CD.AccidentForm.selectedItem.Driver_Zipcode = $("#Driver_Zipcode_edit").val();
        CD.AccidentForm.selectedItem.Driver_Agency = $("#Driver_Agency_edit").val();
        CD.AccidentForm.selectedItem.Driver_Bureau = $("#Driver_Bureau_edit").val();
        CD.AccidentForm.selectedItem.Driver_BusinessPhone = $("#Driver_BusinessPhone_edit").val();
        CD.AccidentForm.selectedItem.Vehicle_pointImpact = $("#Driver_ImpactVehicle_edit").val();
        CD.AccidentForm.selectedItem.Vehicle_ExtDamage = $("#Driver_ExtDamage").val();
        CD.AccidentForm.selectedItem.Fleet_ShopNumber = $("#Driver_Fleet_edit").val();
        CD.AccidentForm.selectedItem.Vehicle_Yearmake = $("#Driver_yearmake_edit").val();
        CD.AccidentForm.selectedItem.Vehicle_SerialNumber = $("#Driver_SerialNo_edit").val();
        CD.AccidentForm.selectedItem.VehicleTag = $("#Driver_TagNo_edit").val();
        CD.AccidentForm.selectedItem.VehicleYear = $("#Driver_TagYear_edit").val();
        CD.AccidentForm.selectedItem.VehicleState = $("#Driver_TagState_edit").val();
        CD.AccidentForm.selectedItem.OtherSpecify = $("#Driver_OtherSpecify_edit").val();

        CD.AccidentForm.selectedItem.Owner_Name = $("#Owner_Name_edit").val();
        CD.AccidentForm.selectedItem.Owner_Address = $("#Owner_Address_edit").val();
        CD.AccidentForm.selectedItem.Owner_Phone = $("#Owner_Phone_edit").val();
        CD.AccidentForm.selectedItem.Owner_InsuranceCom = $("#Owner_InsuranceCom_edit").val();
        CD.AccidentForm.selectedItem.Owner_PolicyNo = $("#Owner_PolicyNo_edit").val();

        CD.AccidentForm.selectedItem.Driver_ExpDate = $("#Driver_ExpDate").val();
        CD.AccidentForm.selectedItem.Driver_VehicleState = $("#Driver_VehicleState").val();

        Helpers.updateReportChildByType(1, CD.AccidentForm.selectedItem);
        $("#mdl_vehicleEdit").modal("hide");
    },


    fnPopulateChargeForm: function(Id) {
        if (Id == null) {
            Helpers.showNotificationModal("Error", "Please make sure that a specific row has been selected.");
        } else {
            $("#mdl_chargeEdit").modal();
            $("#mdl_chargeLabel").html("Edit Charge");
            Helpers.getReportChildByType(2, Id);
            CD.AccidentForm.fnPopulateChargeFields(CD.AccidentForm.selectedItem);
        }
    },

    fnPopulateChargeFields: function(selectedItem) {
        if (selectedItem != null) {
            $("#chargeEdit_SummonNo").val(selectedItem.Summons_No);
            $("#chargeEdit_ChargeAmount").val(selectedItem.ChargeAmount);
            $("#chargeEdit_CityEmplCharge").val(selectedItem.CityEmpl_Charge);
            $("#chargeEdit_TrialTime").val(selectedItem.Trial_Time);
        }
    },

    fnAddChargeItem: function() {
        var id = Helpers.findMaxChildrenID(2) + 1;
        var CaseId = CD.AccidentForm.selectedReport.accidentReport.CaseId;
        var charge = null;
        if (id >= 0 && CaseId >= 0) {
            charge = {
                CHARGEId: id,
                CaseId: CaseId,
                CityEmpl_Charge: $("#chargeEdit_CityEmplCharge").val(),
                ChargeAmount: $("#chargeEdit_ChargeAmount").val(),
                Summons_No: $("#chargeEdit_SummonNo").val(),
                Trial_Time: $("#chargeEdit_TrialTime").val()
            };
            Helpers.addReportChildByType(2, charge);
            $("#mdl_chargeEdit").modal("hide");
        }

    },
    fnUpdateChargeItem: function() {
        CD.AccidentForm.selectedItem.Summons_No = $("#chargeEdit_SummonNo").val();
        CD.AccidentForm.selectedItem.ChargeAmount = $("#chargeEdit_ChargeAmount").val();
        CD.AccidentForm.selectedItem.CityEmpl_Charge = $("#chargeEdit_CityEmplCharge").val();
        CD.AccidentForm.selectedItem.Trial_Time = $("#chargeEdit_TrialTime").val();
        Helpers.updateReportChildByType(2, CD.AccidentForm.selectedItem);
        $("#mdl_chargeEdit").modal("hide");
    },

    fnPopulateWitnessForm: function(Id) {
        if (Id == null) {
            Helpers.showNotificationModal("Error", "Please make sure that a specific row has been selected.");
        } else {
            $("#mdl_witnessEdit").modal();
            $("#mdl_witnessLabel").html("Edit Witness");        
            Helpers.getReportChildByType(3, Id);
            CD.AccidentForm.fnPopulateWitnessFields(CD.AccidentForm.selectedItem);
        }
    },
    
    fnPopulateWitnessFields: function (selectedItem) {
        if (selectedItem != null) {
            $("#Witness_Name_edit").val(selectedItem.WitnessName);
            $("#Witness_Address_edit").val(selectedItem.WitnessAddress);
            $("#Witness_phone_edit").val(selectedItem.WitnessPhone);
        }
    },

    fnAddWitnessItem: function () {
        var id = Helpers.findMaxChildrenID(3) + 1;
        var CaseId = CD.AccidentForm.selectedReport.accidentReport.CaseId;
        var witness = null;
        if (id >= 0 && CaseId >= 0) {
            witness = {
                WitnessId: id,
                CaseId: CaseId,
                WitnessName: $("#Witness_Name_edit").val(),
                WitnessPhone: $("#Witness_phone_edit").val(),
                WitnessAddress: $("#Witness_Address_edit").val(),
            };
            Helpers.addReportChildByType(3, witness);
            $("#mdl_witnessEdit").modal("hide");
        }

    },

    fnUpdateWitnessItem: function () {
        CD.AccidentForm.selectedItem.WitnessName = $("#Witness_Name_edit").val();
        CD.AccidentForm.selectedItem.WitnessPhone = $("#Witness_phone_edit").val();
        CD.AccidentForm.selectedItem.WitnessAddress = $("#Witness_Address_edit").val();  
        Helpers.updateReportChildByType(3, CD.AccidentForm.selectedItem);
        $("#mdl_witnessEdit").modal("hide");
    },

    fnPopulateOccupantForm: function(Id) {
        if (Id == null) {
            Helpers.showNotificationModal("Error", "Please make sure that a specific row has been selected.");
        } else {
            $("#mdl_occupantEdit").modal();
            $("#mdl_occupantLabel").html("Edit Occupant");
            Helpers.getReportChildByType(4, Id);
            CD.AccidentForm.fnPopulateOccupantFields(CD.AccidentForm.selectedItem);
        }
    },

    fnPopulateOccupantFields: function (selectedItem) {
        if (selectedItem != null) {
            $("#Ocp_FirstName_edit").val(selectedItem.Occupant_FirstName);
            $("#Ocp_MiddleName_edit").val(selectedItem.Occupant_MiddleName);
            $("#Ocp_LastName_edit").val(selectedItem.Occupant_LastName);
            $("#Ocp_Address_edit").val(selectedItem.OccupantAddress);
            $("#Ocp_Injury").val(selectedItem.Occupant_ExtentInjury);
            $("#Ocp_DriverPassenger").val(selectedItem.Occupant_DriverPassenger);
            $("#Ocp_NoVehicle_edit").val(selectedItem.Vehicle_Number);
            $("#Ocp_Pedestrian").val(selectedItem.Occupant_PedestrianVehicle);
            $("#Ocp_Age_edit").val(selectedItem.Age);
            $("#Ocp_Removedby").val(selectedItem.Occupant_RemovedBy);
            $("#Ocp_natureInjury_edit").val(selectedItem.Occupant_Injuerynature);
            if (selectedItem.Sex == 1) {
                $("#chk_OcpSex_edit_M").prop("checked", true);
            }
            else {
                $("#chk_OcpSex_edit_F").prop("checked", true);
            }          
        }
    },

    fnAddOccupantItem: function () {
        var id = Helpers.findMaxChildrenID(4) + 1;
        var CaseId = CD.AccidentForm.selectedReport.accidentReport.CaseId;
        var Occupant = null;
        var SexRes = 0;
        if ($("#chk_OcpSex_edit_M").is(":checked") == true) {
            SexRes = 1;
        }

        if ($("#chk_OcpSex_edit_F").is(":checked") == true) {
            SexRes = 0;
        }

        if (id >= 0 && CaseId >= 0) {
            Occupant = {
                OccupantId: id,
                CaseId: CaseId,
                Occupant_FirstName: $("#Ocp_FirstName_edit").val(),
                Occupant_MiddleName: $("#Ocp_MiddleName_edit").val(),
                Occupant_LastName: $("#Ocp_LastName_edit").val(),
                OccupantAddress: $("#Ocp_Address_edit").val(),
                Occupant_ExtentInjury: $("#Ocp_Injury").val(),
                Occupant_DriverPassenger: $("#Ocp_DriverPassenger").val(),
                Vehicle_Number: $("#Ocp_NoVehicle_edit").val(),
                Occupant_PedestrianVehicle: $("#Ocp_Pedestrian").val(),
                Occupant_Injuerynature: $("#Ocp_natureInjury_edit").val(),
                Occupant_RemovedBy: $("#Ocp_Removedby").val(),
                Age: $("#Ocp_Age_edit").val(),
                Sex: SexRes
            };
            Helpers.addReportChildByType(4, Occupant);
            $("#mdl_occupantEdit").modal("hide");
        }

    },

    fnUpdateOccupantItem: function () {
        CD.AccidentForm.selectedItem.Occupant_FirstName = $("#Ocp_FirstName_edit").val();
        CD.AccidentForm.selectedItem.Occupant_MiddleName = $("#Ocp_MiddleName_edit").val();
        CD.AccidentForm.selectedItem.Occupant_LastName = $("#Ocp_LastName_edit").val();
        CD.AccidentForm.selectedItem.OccupantAddress = $("#Ocp_Address_edit").val();
        CD.AccidentForm.selectedItem.Occupant_ExtentInjury = $("#Ocp_Injury").val();
        CD.AccidentForm.selectedItem.Occupant_DriverPassenger = $("#Ocp_DriverPassenger").val();
        CD.AccidentForm.selectedItem.Vehicle_Number = $("#Ocp_NoVehicle_edit").val();
        CD.AccidentForm.selectedItem.Occupant_PedestrianVehicle = $("#Ocp_Pedestrian").val();
        CD.AccidentForm.selectedItem.Occupant_Injuerynature = $("#Ocp_natureInjury_edit").val();
        CD.AccidentForm.selectedItem.Occupant_RemovedBy = $("#Ocp_Removedby").val();
        CD.AccidentForm.selectedItem.Age = $("#Ocp_Age_edit").val();
        if ($("#chk_OcpSex_edit_M").is(":checked") == true) {
            CD.AccidentForm.selectedItem.Sex = 1;
        }
        else {
            CD.AccidentForm.selectedItem.Sex = 0;
        }
        Helpers.updateReportChildByType(4, CD.AccidentForm.selectedItem);
        $("#mdl_occupantEdit").modal("hide");
    },

    InitVehicleSectionEvents: function () {

        $('#Driver_DOB').flatpickr({
            dateFormat: "Y-m-d",
            static: true,
            time_24hr: false,
        });

        $('#Driver_ExpDate').flatpickr({
            dateFormat: "Y-m-d",
            static: true,
            time_24hr: false,
        });

        CD.AccidentForm.oVehicleTable = $('#VehiclesTable').dataTable({
            "aaSorting": [
                [1, "asc"]
            ],
            "bFilter": false,
            "pagingType": "simple",
            "bPaginate": true,
            "info": false,
            "columnDefs": [{
                "targets": [0],
                "visible": false
            },
            {
                "targets": [2],
                className: "dt[-head|-body]-center"
            },
            {
                "render": function (data, type, row) {
                    if (data == 1) {
                        return '<span>Yes</span>';
                    }
                    else {
                        return '<span>N/A</span>';
                    }
                },
                "targets": 2
            }
            ]
            //,
            //"createdRow": function (row, data, index) {
            //    if (data[2] == 1) {
            //        $('td', row).eq(2).addClass('fa fa-star checked');
            //    }
            //}
        });

        $('#VehiclesTable tbody').on('click', 'tr', function() {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            } else {
                CD.AccidentForm.oVehicleTable.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        // vehicle events
        $("#btn_saveVehicle_Edit").click(function () {
            //Helpers.showSaveStatusModal("Save Changes", "Do you want to save the changes to the local work data?",
            //    function() {
            //        if (CD.AccidentForm.addUpdateStatus == 1) {
            //            CD.AccidentForm.fnAddVehicleItem();
            //        } else if (CD.AccidentForm.addUpdateStatus == 2) {
            //            CD.AccidentForm.fnUpdateVehicleItem();
            //        }
            //        CD.AccidentForm.reDrawDatatable(1);
            //    },
            //    function() {
            //        //Do nothing
            //    });

            if (CD.AccidentForm.addUpdateStatus == 1) {
                CD.AccidentForm.fnAddVehicleItem();
            } else if (CD.AccidentForm.addUpdateStatus == 2) {
                CD.AccidentForm.fnUpdateVehicleItem();
            }
            CD.AccidentForm.reDrawDatatable(1);
            if ($("#btn_submitAccdForm_Edit").hasClass('btn-success')) {
                $("#btn_submitAccdForm_Edit").removeClass('btn-success');
                $("#btn_submitAccdForm_Edit").addClass('btn-danger');
                $("#CommitStatus").html("There are changes not committed yet.");
            }
        });

        // vehicle events
        $("#btn_Editvehicle_Add").click(function() {
            Helpers.fnClearFormFields("#vehicleEditSection");
            $("#mdl_vehicleEdit").modal();
            $("#mdl_vehicleLabel").html("Create Vehicle");

            if ($("#chk_cityDriver_edit").is(":checked") == true) {
                $("#label_Driver_Agency_edit").html("Agency Name");
                $("#Driver_TagYear_edit").val("Perm");
                $("#Driver_TagState_edit").val("MD");
                $("#CitizenVehicleLicence").hide();
                $("#CitizenDriverInfo").hide();
                $("#CityDriverInfo").show();
                $("#CityVehiclePermit").show();
                
            }
            else {
                $("#label_Driver_Agency_edit").html("Employer Name");
                $("#Driver_TagYear_edit").val("");
                $("#Driver_TagState_edit").val("");
                $("#CitizenVehicleLicence").show();
                $("#CitizenDriverInfo").show();
                $("#CityDriverInfo").hide();
                $("#CityVehiclePermit").hide();

            }

            CD.AccidentForm.addUpdateStatus = 1;
        });

        //
        $("#chk_cityDriver_edit").click(function () {
            if ($("#chk_cityDriver_edit").is(":checked") == true) {
                $("#Owner_Name_edit").val("MAYOR & CITY COUNCIL CITY OF BALTIMORE");
                $("#label_Driver_Agency_edit").html("Agency Name");
                if ($("#mdl_vehicleLabel").html() == "Create Vehicle") {
                    $("#Driver_TagYear_edit").val("Perm");
                    $("#Driver_TagState_edit").val("MD");
                }             
                $("#CitizenVehicleLicence").hide();
                $("#CitizenDriverInfo").hide();
                $("#CityDriverInfo").show();
                $("#CityVehiclePermit").show();
            }
            else {
                $("#label_Driver_Agency_edit").html("Employer Name");
                if ($("#mdl_vehicleLabel").html() == "Create Vehicle") {
                    $("#Driver_TagYear_edit").val("");
                    $("#Driver_TagState_edit").val("");
                } 
                $("#Owner_Name_edit").val("");
                $("#CitizenVehicleLicence").show();
                $("#CitizenDriverInfo").show();
                $("#CityDriverInfo").hide();
                $("#CityVehiclePermit").hide();
            }
           
        });

        $("#btn_Editvehicle_Edit").click(function() {
            Helpers.fnClearFormFields("#vehicleEditSection");
            var Id = Helpers.getSelectedRowId("#VehiclesTable");
            CD.AccidentForm.fnPopulateVehicleForm(Id);
            CD.AccidentForm.addUpdateStatus = 2;
            if ($("#chk_cityDriver_edit").is(":checked") == true) {
                $("#Owner_Name_edit").val("MAYOR & CITY COUNCIL CITY OF BALTIMORE");
                $("#label_Driver_Agency_edit").html("Agency Name");
                $("#CitizenVehicleLicence").hide();
                $("#CitizenDriverInfo").hide();
                $("#CityDriverInfo").show();
                $("#CityVehiclePermit").show();
                
            }
            else {
                $("#label_Driver_Agency_edit").html("Employer Name");
                $("#CitizenVehicleLicence").show();
                $("#CitizenDriverInfo").show();
                $("#CityDriverInfo").hide();
                $("#CityVehiclePermit").hide();
            }
        });

        $("#btn_Editvehicle_Del").click(function() {
            var tbl = $('#VehiclesTable').DataTable();
            var $row = Helpers.findSelectedRow(tbl);
            if ($row == null) {
                return;
            }

            Helpers.showSaveStatusModal("Delete Vehicle", "You will delete the Vehicle from the local work data.",
                function() {
                    // delete selected vehicle
                    var selectedId = Helpers.getSelectedRowId('#VehiclesTable');
                    Helpers.delReportChildByType(1, selectedId);
                    CD.AccidentForm.reDrawDatatable(1);
                },
                function() {
                    //Do nothing
                });
        });
    },

    InitChargeSectionEvents: function() {
        CD.AccidentForm.oChargeTable = $('#ChargesTable').dataTable({
            "aaSorting": [
                [1, "asc"]
            ],
            "bFilter": false,
            "pagingType": "simple",
            "bPaginate": true,
            "info": false,
            "columnDefs": [{
                "targets": [0],
                "visible": false
            }]
        });

        $('#chargeEdit_TrialTime').flatpickr({
            enableTime: true,
            dateFormat: "Y-m-d h:i K",
            time_24hr: false,
            static: true
        });

        $('#ChargesTable tbody').on('click', 'tr', function() {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            } else {
                CD.AccidentForm.oChargeTable.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        // charge events
        $("#btn_saveCharge_Edit").click(function() {
            //Helpers.showSaveStatusModal("Save Changes", "Do you want to save the changes to the local work data?",
            //    function() {
            //        if (CD.AccidentForm.addUpdateStatus == 1) {
            //            CD.AccidentForm.fnAddChargeItem();
            //        } else if (CD.AccidentForm.addUpdateStatus == 2) {
            //            CD.AccidentForm.fnUpdateChargeItem();
            //        }
            //        CD.AccidentForm.reDrawDatatable(2);

            //    },
            //    function() {
            //        //Do nothing
            //    });
            if (CD.AccidentForm.addUpdateStatus == 1) {
                CD.AccidentForm.fnAddChargeItem();
            } else if (CD.AccidentForm.addUpdateStatus == 2) {
                CD.AccidentForm.fnUpdateChargeItem();
            }
            CD.AccidentForm.reDrawDatatable(2);
            if ($("#btn_submitAccdForm_Edit").hasClass('btn-success')) {
                $("#btn_submitAccdForm_Edit").removeClass('btn-success');
                $("#btn_submitAccdForm_Edit").addClass('btn-danger');
                $("#CommitStatus").html("There are changes not committed yet.");
            }
        });

        $("#btn_Editcharge_Add").click(function() {
            Helpers.fnClearFormFields("#chargeEditSection");
            $("#mdl_chargeEdit").modal();
            $("#mdl_chargeLabel").html("Create Charge");
            CD.AccidentForm.addUpdateStatus = 1;
        });

        $("#btn_Editcharge_Edit").click(function() {
            Helpers.fnClearFormFields("#chargeEditSection");
            var Id = Helpers.getSelectedRowId("#ChargesTable");
            CD.AccidentForm.fnPopulateChargeForm(Id);
            CD.AccidentForm.addUpdateStatus = 2;
        });

        $("#btn_EditCharge_Delete").click(function() {
            var tbl = $('#ChargesTable').DataTable();
            var $row = Helpers.findSelectedRow(tbl);
            if ($row == null) {
                return;
            }

            Helpers.showSaveStatusModal("Delete Charge", "You will delete the charge from the local work data.",
                function() {
                    var selectedId = Helpers.getSelectedRowId('#ChargesTable');
                    Helpers.delReportChildByType(2, selectedId);
                    CD.AccidentForm.reDrawDatatable(2);
                },
                function() {
                    //Do nothing
                });
        });
    },

    InitWitnessSectionEvents: function() {
        CD.AccidentForm.oWitnessTable = $('#WitnessesTable').dataTable({
            "aaSorting": [
                [1, "asc"]
            ],
            "bFilter": false,
            "pagingType": "simple",
            "bPaginate": true,
            "info": false,
            "columnDefs": [{
                "targets": [0],
                "visible": false
            }]
        });

        $('#WitnessesTable tbody').on('click', 'tr', function() {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            } else {
                CD.AccidentForm.oWitnessTable.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        // witness events
        $("#btn_saveWitness_Edit").click(function () {
            //Helpers.showSaveStatusModal("Save Changes", "Do you want to save the changes to the local work data?",
            //    function() {
            //        if (CD.AccidentForm.addUpdateStatus == 1) {
            //            CD.AccidentForm.fnAddWitnessItem();
            //        } else if (CD.AccidentForm.addUpdateStatus == 2) {
            //            CD.AccidentForm.fnUpdateWitnessItem();
            //        }
            //        CD.AccidentForm.reDrawDatatable(3);
            //    },
            //    function() {
            //        //Do nothing
            //    });
            if (CD.AccidentForm.addUpdateStatus == 1) {
                CD.AccidentForm.fnAddWitnessItem();
            } else if (CD.AccidentForm.addUpdateStatus == 2) {
                CD.AccidentForm.fnUpdateWitnessItem();
            }
            CD.AccidentForm.reDrawDatatable(3);
            if ($("#btn_submitAccdForm_Edit").hasClass('btn-success')) {
                $("#btn_submitAccdForm_Edit").removeClass('btn-success');
                $("#btn_submitAccdForm_Edit").addClass('btn-danger');
                $("#CommitStatus").html("There are changes not committed yet.");
            }
        });

        // witness events
        $("#btn_Editwitness_Add").click(function() {
            Helpers.fnClearFormFields("#witnessEditSection");
            $("#mdl_witnessEdit").modal();
            $("#mdl_witnessLabel").html("Create Witness");
            CD.AccidentForm.addUpdateStatus = 1;
        });

        $("#btn_Editwitness_Edit").click(function() {
            Helpers.fnClearFormFields("#witnessEditSection");
            var Id = Helpers.getSelectedRowId("#WitnessesTable");
            CD.AccidentForm.fnPopulateWitnessForm(Id);
            CD.AccidentForm.addUpdateStatus = 2;
        });

        $("#btn_Editwitness_Del").click(function() {
            var tbl = $('#WitnessesTable').DataTable();
            var $row = Helpers.findSelectedRow(tbl);
            if ($row == null) {
                return;
            }
            Helpers.showSaveStatusModal("Delete Witness", "You will delete the Witness from the local work data.",
                function() {              
                    // delete selected witness
                    var selectedId = Helpers.getSelectedRowId('#WitnessesTable');
                    Helpers.delReportChildByType(3, selectedId);
                    CD.AccidentForm.reDrawDatatable(3);
                },
                function() {
                    //Do nothing
                });
        });
    },

    InitReportInfoEvents: function () {
        Helpers.getReportChildByType(5, null);
    },

    InitOccupantSectionEvents: function() {
        CD.AccidentForm.oOccupantTable = $('#OccupantsTable').dataTable({
            "aaSorting": [
                [1, "asc"]
            ],
            "bFilter": false,
            "pagingType": "simple",
            "bPaginate": true,
            "info": false,
            "columnDefs": [{
                "targets": [0],
                "visible": false
            }]
        });

        $('#OccupantsTable tbody').on('click', 'tr', function() {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            } else {
                CD.AccidentForm.oOccupantTable.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        // Occupant events
        $("#btn_saveOccupant_Edit").click(function () {
            //Helpers.showSaveStatusModal("Save Changes", "Do you want to save the changes to the local work data?",
            //    function() {
            //        if (CD.AccidentForm.addUpdateStatus == 1) {
            //            CD.AccidentForm.fnAddOccupantItem();
            //        } else if (CD.AccidentForm.addUpdateStatus == 2) {
            //            CD.AccidentForm.fnUpdateOccupantItem();
            //        }
            //        CD.AccidentForm.reDrawDatatable(4);
            //    },
            //    function() {
            //        //Do nothing
            //    });
            if (CD.AccidentForm.addUpdateStatus == 1) {
                CD.AccidentForm.fnAddOccupantItem();
            } else if (CD.AccidentForm.addUpdateStatus == 2) {
                CD.AccidentForm.fnUpdateOccupantItem();
            }
            CD.AccidentForm.reDrawDatatable(4);
            if ($("#btn_submitAccdForm_Edit").hasClass('btn-success')) {
                $("#btn_submitAccdForm_Edit").removeClass('btn-success');
                $("#btn_submitAccdForm_Edit").addClass('btn-danger');
                $("#CommitStatus").html("There are changes not committed yet.");
            }
        });

        // occupant events
        $("#btn_Editoccupant_Add").click(function() {
            Helpers.fnClearFormFields("#occupantEditSection");
            $("#mdl_occupantEdit").modal();
            $("#mdl_occupantLabel").html("Create Occupant");
            CD.AccidentForm.addUpdateStatus = 1;
        });

        $("#btn_Editoccupant_Edit").click(function() {
            Helpers.fnClearFormFields("#occupantEditSection");
            var Id = Helpers.getSelectedRowId("#OccupantsTable");
            CD.AccidentForm.fnPopulateOccupantForm(Id);
            CD.AccidentForm.addUpdateStatus = 2;
        });

        $("#btn_Editoccupant_Del").click(function() {
            var tbl = $('#OccupantsTable').DataTable();
            var $row = Helpers.findSelectedRow(tbl);
            if ($row == null) {
                return;
            }
            Helpers.showSaveStatusModal("Delete Occupant", "You will delete the Occupant from the local work data.",
                function() {
                    // delete selected occupant
                    var selectedId = Helpers.getSelectedRowId('#OccupantsTable');
                    Helpers.delReportChildByType(4, selectedId);
                    CD.AccidentForm.reDrawDatatable(4);
                },
                function() {
                    //Do nothing
                });
        });
    },

    InitReportCaseObj: function() {
        var temp = localforage.getItem('selectedReport', function(err, value) {
            if (value == null) {
                var url = window.location.href;
                var parameterStr = url.substring(url.indexOf('?') + 1);
                var ReportCaseID = parameterStr.split("=")[1];
                if (ReportCaseID > 0) {
                    Promise.all([
                    CD.services.getReportById(ReportCaseID)
                    ]).then(function success(values) {
                        localforage.setItem("selectedReport", values[0]).then(
                            function success() {
                                CD.AccidentForm.selectedReport = values[0];
                                CD.AccidentForm.InitVehicleSectionEvents();
                                CD.AccidentForm.InitChargeSectionEvents();
                                CD.AccidentForm.InitWitnessSectionEvents();
                                CD.AccidentForm.InitOccupantSectionEvents();
                                CD.AccidentForm.fnInsertSignDrawImages();
                            },
                            function failure(err) { }
                        )
                    });
                }           
            }
            CD.AccidentForm.selectedReport = value;
            CD.AccidentForm.InitReportInfoSectionEvents();
            CD.AccidentForm.InitVehicleSectionEvents();
            CD.AccidentForm.InitChargeSectionEvents();
            CD.AccidentForm.InitWitnessSectionEvents();
            CD.AccidentForm.InitOccupantSectionEvents();
            CD.AccidentForm.fnInsertSignDrawImages();
            CD.AccidentForm.fnInitMultiStepForm();
            Helpers.fnListenFormFields("#accidentFormContainer_Edit");
        });
    },
    InitReportInfoSectionEvents: function(){
        $('#Control1Call_Time').flatpickr({
            enableTime: true,
            dateFormat: "Y-m-d h:i K",
            time_24hr: false,
        });

        $('#report_accidentTime_Edit').flatpickr({
            enableTime: true,
            dateFormat: "Y-m-d h:i K",
            time_24hr: false,
        });
        CD.AccidentForm.InitReportInfoInputValidation();
    },

    InitReportInfoInputValidation: function(){
        $('#report_VesInvolved_Edit').on('keydown keyup', function (e) {
            if ($(this).val() < 0
                && e.keyCode !== 46 // keycode for delete
                && e.keyCode !== 8 // keycode for backspace
               ) {
                e.preventDefault();
                $(this).val(0);
            }
        });
      
        $('#Ocp_Age_edit').on('keydown keyup', function (e) {
            if ($(this).val() < 0
                && e.keyCode !== 46 // keycode for delete
                && e.keyCode !== 8 // keycode for backspace
               ) {
                e.preventDefault();
                $(this).val(0);
            }
        });
    },
    
    reDrawDatatable: function(Type) {
        var ind, len;
        var reportJSON = CD.AccidentForm.selectedReport;
        switch (Type) {
            //get vehicles              
            case 1:
                var t = $("#VehiclesTable").DataTable();
                // clear the table first
                t.clear().draw();
                var res = [];
                for (ind = 0, len = reportJSON.vehicles.length; ind < len; ind++) {
                    var a = reportJSON.vehicles[ind];
                    res.push([a.VehicleId, reportJSON.accidentReport.CaseNumber, a.CityDriver, a.Driver_FirstName, a.Driver_lastName, a.Driver_Sex, a.DriverLicense_Number, a.Driver_County]);
                }

                if (res.length > 0) {
                    t.rows.add(res).draw();
                }
                break;
                //get charges
            case 2:
                var t = $("#ChargesTable").DataTable();
                // clear the table first
                t.clear().draw();
                var res = [];
                for (ind = 0, len = reportJSON.charges.length; ind < len; ind++) {
                    var a = reportJSON.charges[ind];
                    res.push([a.CHARGEId, reportJSON.accidentReport.CaseNumber, a.CityEmpl_Charge, a.Summons_No, a.Trial_Time]);
                }

                if (res.length > 0) {
                    t.rows.add(res).draw();
                }
                break;
                //get witnesses
            case 3:
                var t = $("#WitnessesTable").DataTable();
                // clear the table first
                t.clear().draw();
                var res = [];
                for (ind = 0, len = reportJSON.witnesses.length; ind < len; ind++) {
                    var a = reportJSON.witnesses[ind];
                    res.push([a.WitnessId, reportJSON.accidentReport.CaseNumber, a.WitnessName, a.WitnessPhone, a.WitnessAddress]);
                }

                if (res.length > 0) {
                    t.rows.add(res).draw();
                }
                break;
                //get occupants
            case 4:
                var t = $("#OccupantsTable").DataTable();
                // clear the table first
                t.clear().draw();
                var res = [];
                for (ind = 0, len = reportJSON.occupants.length; ind < len; ind++) {
                    var a = reportJSON.occupants[ind];
                    res.push([a.OccupantId, reportJSON.accidentReport.CaseNumber, a.Occupant_FirstName, a.Occupant_LastName, a.OccupantAddress]);
                }
                if (res.length > 0) {
                    t.rows.add(res).draw();
                }

        }
    },

    removeWarning: function () {
    },

    fnCreateValidationMsg: function () {
        //var TitelError = "Maximum of 500 characters allowed!"
        var AccidentLoc = $("#report_AccidentLoc_Edit").val();
        var accidentTime = $("#report_accidentTime_Edit").val();

        if (AccidentLoc != '') {
            $("#report_AccidentLoc_validation").html("");
        } else {
            $("#report_AccidentLoc_validation").html("Please Fill Accident Location!");
        }

        if (accidentTime != '') {
            $("#report_accidentTime_validation").html("");
        } else {
            $("#report_accidentTime_validation").html("Please Fill Accident Date and Time!");
        }

        if (AccidentLoc != '' && accidentTime != '') {
            return true;
        } else {
            return false;
        }
    },


}