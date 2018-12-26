﻿CD.ViewAccidentForm = {
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
	init: function () {
		CD.ViewAccidentForm.InitReportCaseObj();
		Helpers.fnDisableFormFields("#ViewOnlyReport");
	},

	fnInitMultiStepForm: function () {
		var navListItems = $('div.setup-panel div a'),
            allWells = $('.setup-content'),
            allNextBtn = $('.nextBtn');

		allWells.hide();

		navListItems.click(function (e) {
			e.preventDefault();
			var $target = $($(this).attr('href')),
                $item = $(this);

			navListItems.removeClass('btn-success').addClass('btn-default');
			$item.addClass('btn-success');
			allWells.hide();
			$target.show();
			$target.find('input:eq(0)').focus();
		});

		allNextBtn.click(function () {
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


	fnPopulateVehicleForm: function (Id) {
		if (Id == null) {
			Helpers.showNotificationModal("Error", "Please make sure that a specific row has been selected.");
		} else {
			$("#mdl_vehicleView").modal();
			$("#mdl_vehicleLabelView").html("View Vehicle");
			Helpers.getViewReportChildByType(1, Id);
			CD.ViewAccidentForm.fnPopulateVehicleFields(CD.ViewAccidentForm.selectedItem);
		}
	},

	fnPopulateVehicleFields: function (selectedItem) {
		if (selectedItem != null) {
			if (selectedItem.CityDriver == 1) {
				$("#chk_cityDriver_View").prop("checked", true);
			}
			else {
				$("#chk_cityDriver_View").prop("checked", false);
			}

			if (selectedItem.Driver_CDL == 1) {
			    $("#DriverCDL_View").prop("checked", true);
			}
			else {
			    $("#DriverCDL_View").prop("checked", false);
			}


			if (selectedItem.Driver_POST == 1) {
			    $("#DriverPOST_View").prop("checked", true);
			}
			else {
			    $("#DriverPOST_View").prop("checked", false);
			}

			$("#veh_licenseNo_View").val(selectedItem.DriverLicense_Number);
			$("#city_permit_View").val(selectedItem.CityPermitNo);
			$("#Driver_SexView").val(selectedItem.Driver_Sex);
			$("#Driver_DOBView").val(selectedItem.Driver_DOB);
			$("#Driver_homePhoneView").val(selectedItem.Driver_Homephone);
			$("#Driver_FirstName_View").val(selectedItem.Driver_FirstName);
			$("#Driver_MiddleName_View").val(selectedItem.Driver_MiddleName);
			$("#Driver_LastName_View").val(selectedItem.Driver_lastName);
			//$("#DriverCDL_View").val(selectedItem.Driver_CDL);
			//$("#DriverPOST_View").val(selectedItem.Driver_POST);
			$("#Driver_City_View").val(selectedItem.Driver_City);
			$("#Driver_State_View").val(selectedItem.Driver_State);
			$("#Driver_County_View").val(selectedItem.Driver_County);
			$("#Driver_Zipcode_View").val(selectedItem.Driver_Zipcode);
			$("#Driver_Agency_View").val(selectedItem.Driver_Agency);
			$("#Driver_Bureau_View").val(selectedItem.Driver_Bureau);
			$("#Driver_BusinessPhone_View").val(selectedItem.Driver_BusinessPhone);
			$("#Driver_ImpactVehicle_View").val(selectedItem.Vehicle_pointImpact);
			$("#Driver_ExtDamageView").val(selectedItem.Vehicle_ExtDamage);
			$("#Driver_TagNo_View").val(selectedItem.VehicleTag);
			$("#Driver_TagYear_View").val(selectedItem.VehicleYear);
			$("#Driver_TagState_View").val(selectedItem.VehicleState);
			$("#Driver_Fleet_View").val(selectedItem.Fleet_ShopNumber);
			$("#Driver_yearmake_View").val(selectedItem.Vehicle_Yearmake);
			$("#Driver_SerialNo_View").val(selectedItem.Vehicle_SerialNumber);
			$("#Driver_Address_View").val(selectedItem.Driver_Address);
			$("#Driver_OtherSpecify_View").val(selectedItem.OtherSpecify);

			$("#Owner_Name_View").val(selectedItem.Owner_Name);
			$("#Owner_Address_View").val(selectedItem.Owner_Address);
			$("#Owner_Phone_View").val(selectedItem.Owner_Phone);
			$("#Owner_InsuranceCom_View").val(selectedItem.Owner_InsuranceCom);
			$("#Owner_PolicyNo_View").val(selectedItem.Owner_PolicyNo);

			$("#Driver_ExpDate_View").val(selectedItem.Driver_ExpDate);
			$("#Driver_VehicleState_View").val(selectedItem.Driver_VehicleState);

			if (selectedItem.CityDriver == 1) {			   
			    $(".CitizenVehicleLicence_View").hide();
			    $(".CitizenDriverInfo_view").hide();
			    $(".CityDriverInfo_view").show();		  
			}
			else {
			    $(".CitizenVehicleLicence_View").show();
			    $(".CitizenDriverInfo_view").show();
			    $(".CityDriverInfo_view").hide();
			}

		}
	},

	fnPopulateChargeForm: function (Id) {
		if (Id == null) {
			Helpers.showNotificationModal("Error", "Please make sure that a specific row has been selected.");
		} else {
			$("#mdl_chargeView").modal();
			$("#mdl_chargeLabelView").html("View Charge");
			Helpers.getViewReportChildByType(2, Id);
			CD.ViewAccidentForm.fnPopulateChargeFields(CD.ViewAccidentForm.selectedItem);
		}
	},

	fnPopulateChargeFields: function (selectedItem) {
		if (selectedItem != null) {
			$("#chargeView_SummonNo").val(selectedItem.Summons_No);
			$("#chargeView_ChargeAmount").val(selectedItem.ChargeAmount);
			$("#chargeView_CityEmplCharge").val(selectedItem.CityEmpl_Charge);
			$("#chargeView_TrialTime").val(selectedItem.Trial_Time);
		}
	},

	fnPopulateWitnessForm: function (Id) {
	    if (Id == null) {
	        Helpers.showNotificationModal("Error", "Please make sure that a specific row has been selected.");
	    } else {
	        $("#mdl_witnessView").modal();
	        $("#mdl_witnessLabelView").html("View Witness");
	        Helpers.getViewReportChildByType(3, Id);
	        CD.ViewAccidentForm.fnPopulateWitnessFields(CD.ViewAccidentForm.selectedItem);
	    }
	},

	fnPopulateWitnessFields: function (selectedItem) {
		if (selectedItem != null) {
			$("#Witness_Name_View").val(selectedItem.WitnessName);
			$("#Witness_Address_View").val(selectedItem.WitnessAddress);
			$("#Witness_phone_View").val(selectedItem.WitnessPhone);
		}
	},

	fnPopulateOccupantForm: function (Id) {
		if (Id == null) {
			Helpers.showNotificationModal("Error", "Please make sure that a specific row has been selected.");
		} else {
			$("#mdl_occupantView").modal();
			$("#mdl_occupantLabelView").html("View Occupant");
			Helpers.getViewReportChildByType(4, Id);
			CD.ViewAccidentForm.fnPopulateOccupantFields(CD.ViewAccidentForm.selectedItem);
		}
	},

	fnPopulateOccupantFields: function (selectedItem) {
		if (selectedItem != null) {
			$("#Ocp_FirstName_View").val(selectedItem.Occupant_FirstName);
			$("#Ocp_MiddleName_View").val(selectedItem.Occupant_MiddleName);
			$("#Ocp_LastName_View").val(selectedItem.Occupant_LastName);
			$("#Ocp_Address_View").val(selectedItem.OccupantAddress);
			$("#Ocp_InjuryView").val(selectedItem.Occupant_ExtentInjury);
			$("#Ocp_DriverPassengerView").val(selectedItem.Occupant_DriverPassenger);
			$("#Ocp_NoVehicle_View").val(selectedItem.Vehicle_Number);
			$("#Ocp_PedestrianView").val(selectedItem.Occupant_PedestrianVehicle);
			$("#Ocp_Age_View").val(selectedItem.Age);
			$("#Ocp_RemovedbyView").val(selectedItem.Occupant_RemovedBy);
			$("#Ocp_natureInjury_View").val(selectedItem.Occupant_Injuerynature);
			if (selectedItem.Sex == 1) {
				$("#chk_OcpSex_View").prop("checked", true);
			}
			else {
				$("#chk_OcpSex_View").prop("checked", false);
			}
		}
	},

	InitVehicleSectionEvents: function () {
		CD.ViewAccidentForm.oVehicleTable = $('#VehiclesTableView').dataTable({
			"aaSorting": [
                [1, "asc"]
			],
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
		});

		$('#VehiclesTableView tbody').on('click', 'tr', function () {
			if ($(this).hasClass('selected')) {
				$(this).removeClass('selected');
			} else {
				CD.ViewAccidentForm.oVehicleTable.$('tr.selected').removeClass('selected');
				$(this).addClass('selected');
			}
		});

		$('#Driver_DOBView').flatpickr({
		    enableTime: true,
		    dateFormat: "Y-m-d h:i K",
		    time_24hr: false,
		    static: true
		});

		
		$("#btn_Editvehicle_View").click(function () {
			Helpers.fnClearFormFields("#vehicleEditSection");
			var Id = Helpers.getSelectedRowId("#VehiclesTableView");
			CD.ViewAccidentForm.fnPopulateVehicleForm(Id);
			CD.ViewAccidentForm.addUpdateStatus = 2;
		});
	},

	InitChargeSectionEvents: function () {
		CD.ViewAccidentForm.oChargeTable = $('#ViewChargesTable').dataTable({
			"aaSorting": [
                [1, "asc"]
			],
			"pagingType": "simple",
			"bPaginate": true,
			"info": false,
			"columnDefs": [{
				"targets": [0],
				"visible": false
			}]
		});

		$('#ViewChargesTable tbody').on('click', 'tr', function () {
			if ($(this).hasClass('selected')) {
				$(this).removeClass('selected');
			} else {
				CD.ViewAccidentForm.oChargeTable.$('tr.selected').removeClass('selected');
				$(this).addClass('selected');
			}
		});

		$('#chargeView_TrialTime').flatpickr({
		    enableTime: true,
		    dateFormat: "Y-m-d h:i K",
		    time_24hr: false,
		    static: true
		});

		$("#btn_charge_View").click(function () {
			Helpers.fnClearFormFields("#chargeViewSection");
			var Id = Helpers.getSelectedRowId("#ViewChargesTable");
			CD.ViewAccidentForm.fnPopulateChargeForm(Id);
			CD.ViewAccidentForm.addUpdateStatus = 2;
		});
	},

	InitWitnessSectionEvents: function () {
		CD.ViewAccidentForm.oWitnessTable = $('#ViewWitnessesTable').dataTable({
			"aaSorting": [
                [1, "asc"]
			],
			"pagingType": "simple",
			"bPaginate": true,
			"info": false,
			"columnDefs": [{
				"targets": [0],
				"visible": false
			}]
		});

		$('#ViewWitnessesTable tbody').on('click', 'tr', function () {
			if ($(this).hasClass('selected')) {
				$(this).removeClass('selected');
			} else {
				CD.ViewAccidentForm.oWitnessTable.$('tr.selected').removeClass('selected');
				$(this).addClass('selected');
			}
		});

		$("#btn_Editwitness_View").click(function () {
			Helpers.fnClearFormFields("#witnessViewSection");
			var Id = Helpers.getSelectedRowId("#ViewWitnessesTable");
			CD.ViewAccidentForm.fnPopulateWitnessForm(Id);
			CD.ViewAccidentForm.addUpdateStatus = 2;
		});
	},

	InitReportInfoEvents: function () {
		Helpers.getViewReportChildByType(5, null);
	},

	InitOccupantSectionEvents: function () {
		CD.ViewAccidentForm.oOccupantTable = $('#OccupantsTableView').dataTable({
			"aaSorting": [
                [1, "asc"]
			],
			"pagingType": "simple",
			"bPaginate": true,
			"info": false,
			"columnDefs": [{
			    "targets": [0],
			    "visible": false
			}]
		});

		$('#OccupantsTableView tbody').on('click', 'tr', function () {
			if ($(this).hasClass('selected')) {
				$(this).removeClass('selected');
			} else {
				CD.ViewAccidentForm.oOccupantTable.$('tr.selected').removeClass('selected');
				$(this).addClass('selected');
			}
		});

		$("#btn_Editoccupant_View").click(function () {
			Helpers.fnClearFormFields("#occupantViewSection");
			var Id = Helpers.getSelectedRowId("#OccupantsTableView");
			CD.ViewAccidentForm.fnPopulateOccupantForm(Id);
			CD.ViewAccidentForm.addUpdateStatus = 2;
		});
	},

	InitdrawSignSectionEvents: function () {
		var dataUrl_SafetyOfficerSign, dataUrl_SupervisorSign,
            dataUrl_DriverSig, dataUrl_IntsSketch;
		if (CD.ViewAccidentForm.selectedReport != null) {
		    dataUrl_SafetyOfficerSign = CD.ViewAccidentForm.selectedReport.accidentReport.SafetyOfficerSig;
		    dataUrl_SupervisorSign = CD.ViewAccidentForm.selectedReport.accidentReport.SupervisorSig;
		    dataUrl_DriverSig = CD.ViewAccidentForm.selectedReport.accidentReport.DriverSig;
		    dataUrl_IntsSketch = CD.ViewAccidentForm.selectedReport.accidentReport.IntsSketch;
		    if (document.getElementById("SafetyOfficerSign_view") != null) {
		        CD.ViewAccidentForm.fnCreateImagesFromBlob("SafetyOfficerSign_view", dataUrl_SafetyOfficerSign);
		        CD.ViewAccidentForm.fnCreateImagesFromBlob("SupervisorSign_view", dataUrl_SupervisorSign);
		        CD.ViewAccidentForm.fnCreateImagesFromBlob("DriverSign_view", dataUrl_DriverSig);
		        CD.ViewAccidentForm.fnCreateImagesFromBlob("SafetyOfficerSketch_view", dataUrl_IntsSketch);
		    }		   
		}	
	},

	fnCreateImagesFromBlob: function (div, blob) {
	    if (typeof blob != 'undefined' && blob != null) {
	        var image = new Image();
	        image.src = "data:image/png;base64," + blob;
	        document.getElementById(div).appendChild(image);
	    }    
	},

	InitReportCaseObj: function () {
		var temp = localforage.getItem('selectedReport', function (err, value) {
			var reportData = value;
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
                            	CD.ViewAccidentForm.selectedReport = values[0];
                            	CD.ViewAccidentForm.InitVehicleSectionEvents();
                            	CD.ViewAccidentForm.InitChargeSectionEvents();
                            	CD.ViewAccidentForm.InitWitnessSectionEvents();
                            	CD.ViewAccidentForm.InitOccupantSectionEvents();
                            },
                            function failure(err) { }
                        )
					});
				}
			}
			CD.ViewAccidentForm.selectedReport = value;
			CD.ViewAccidentForm.InitVehicleSectionEvents();
			CD.ViewAccidentForm.InitChargeSectionEvents();
			CD.ViewAccidentForm.InitWitnessSectionEvents();
			CD.ViewAccidentForm.InitOccupantSectionEvents();
			CD.ViewAccidentForm.InitdrawSignSectionEvents();
			CD.ViewAccidentForm.fnInitMultiStepForm();
		});
	}
}