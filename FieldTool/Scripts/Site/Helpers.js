Helpers = {
    getNewGUID: function () {
        return "{" + uuid.v4().toUpperCase() + "}";
    },

    getlocalforageReportKey: function (reportId) {
        return reportId + Helpers.getNewGUID();
    },

    findSelectedRow: function (tbl) {
        if (tbl.$('tr.selected').length == 0) {
            this.showNotificationModal("Error", "Please make sure that a specific row has been selected.");
        }
        else return tbl.$('tr.selected').first();
    },
    findSelectedDelRow: function (tbl) {
        if (tbl.$('tr.selected').length == 0) {
            return null;
        }
        else return tbl.$('tr.selected').first();
    },
    showNotificationModal: function (title, body) {
        $('#notificationModal .modal-title').html(title);
        $('#notificationModal .modal-body').html(body);
        $('#notificationModal').modal({ keyboard: false });
    },

    showLoginNotificationModal: function () {
        $('#LoginNotificationModal').modal({ keyboard: false });
    },

    showSaveStatusModal: function (title, body, fnOnYes, fnOnNo) {
        $('#confirmationModal .modal-title').html(title);
        $('#confirmationModal .modal-body').html(body);
        $('#confirmationModal').modal({ keyboard: false });

        $('#confirmationModal .btn-primary').off();
        $('#confirmationModal .btn-primary').on('click', function (e) {
            if (fnOnYes != null) {
                fnOnYes();
            }
        });

        $('#confirmationModal .btn-danger').off();
        $('#confirmationModal .btn-danger').on('click', function (e) {
            if (fnOnNo != null) {
                fnOnNo();
            }
        });

    },
    showConfirmationModal: function (fnOnYes, fnOnNo) {
        $('#confirmationModal').modal({ keyboard: false });
        $('#confirmationModal .btn-primary').off();
        $('#confirmationModal .btn-primary').on('click', function (e) {
            if (fnOnYes != null) {
                fnOnYes();
            }
        });

        $('#confirmationModal .btn-danger').off();
        $('#confirmationModal .btn-danger').on('click', function (e) {
            if (fnOnNo != null) {
                fnOnNo();
            }
        });
    },

    showSyncFormDataModal: function (fnOnYes, fnOnNo) {
        $('#SyncFormDataModal').modal({ keyboard: false });
        $('#SyncFormDataModal .btnYes').off();
        $('#SyncFormDataModal .btnYes').on('click', function (e) {
            if (fnOnYes != null) {
                fnOnYes();
            }
        });

        $('#SyncFormDataModal .btnNo').off();
        $('#SyncFormDataModal .btnNo').on('click', function (e) {
            if (fnOnNo != null) {
                fnOnNo();
            }
        });
    },

    getAllIDsInTableAsString: function (oTableLocal) {
        var sReturn = "";
        var data = oTableLocal.fnGetData();

        for (var i = 0; i < data.length; i++) {
            if (i == 0) {
                sReturn += data[i][0];
            } else {
                sReturn += " " + data[i][0];
            }
        }

        return sReturn;
    },

    fnGetSelectedIndex: function (oTableLocal, Div) {
        //var aTrs = oTableLocal.fnGetNodes();
        //var aTrs = oTableLocal.fnGetSelectedData();
        //for (var i = 0; i < aTrs.length; i++) {
        //    if ($(aTrs[i]).hasClass('row_selected')) {
        //        return i;
        //    }
        //}

        //get the real row index, even if the table is sorted 
        var tbl = $(Div).DataTable();
        var $row = Helpers.findSelectedDelRow(tbl);
        if ($row == null)
            return -1;
        var data = tbl.row($row).data();
        var Index = data[0];
        return Index;
    },

    fnGetSelectedDelIndex: function (oTableLocal, Div) {
        var tbl = $(Div).DataTable();
        var $row = Helpers.findSelectedRow(tbl);
        if ($row == null)
            return -1;
        var data = tbl.row($row).data();
        var Index = data[0];
        return Index;
    },

    fnGetSelectedData: function (oTableLocal, Div, ind) {

        if (ind < 0) {
            return null;
        } else {
            //wrong usage, we can not use index here, we need to use the first column such as id here 
            for (var i = 0; i < oTableLocal.fnGetData().length; i++) {
                var obj = oTableLocal.fnGetData()[i];
                if (obj[0] == ind)
                    return oTableLocal.fnGetData(i);
            }

            return null;
        }
    },

    fnCreateMultiStepForm: function (divShow) {
        divShow.steps({
            headerTag: "h3",
            bodyTag: "fieldset",
            enablePagination: false,
            transitionEffect: "slideLeft"
        });

    },

    fnCreateMultiStepForm_edit: function (form, fn) {
        form.steps({
            headerTag: "h3",
            bodyTag: "fieldset",
            transitionEffect: "slideLeft",
            onStepChanging: function (event, currentIndex, newIndex) {
                // Allways allow previous action even if the current form is not valid!
                if (currentIndex > newIndex) {
                    return true;
                }

                // Needed in some cases if the user went back (clean up)
                if (currentIndex < newIndex) {
                    // To remove error styles
                    form.find(".body:eq(" + newIndex + ") label.error").remove();
                    form.find(".body:eq(" + newIndex + ") .error").removeClass("error");
                }
                form.validate().settings.ignore = ":disabled,:hidden";
                return form.valid();
            },
            onStepChanged: function (event, currentIndex, priorIndex) {

                // Used to skip the "Warning" step if the user is old enough and wants to the previous step.
                if (currentIndex === 2 && priorIndex === 3) {
                    form.steps("previous");
                }
            },
            onFinishing: function (event, currentIndex) {
                form.validate().settings.ignore = ":disabled";
                return form.valid();
            },
            onFinished: function (event, currentIndex) {
                alert("Submitted!");
            },
            onInit: function (event, currentIndex) {
                alert("Test form load point call back function");
                //Run callback function
                if (fn != null) {
                    fn();
                }
            }
        });

    },

    serializeObject: function (formData) {
        var o = {};
        var a = formData;
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return JSON.stringify(o);
    },

    saveJSON2Txt: function (filepath, output) {
        var textFile = null;

        var data = new Blob([output], { type: 'text/plain' });

        // If we are replacing a previously generated file we need to
        // manually revoke the object URL to avoid memory leaks.
        if (textFile !== null) {
            window.URL.revokeObjectURL(textFile);
        }

        textFile = window.URL.createObjectURL(data);

    },

    handleFileSelect: function (file) {

        var reader = new FileReader();
        reader.onload = (function (reader) {
            return function () {
                var contents = reader.result;
                var result = [];
                var contentJSON = JSON.parse(contents);
                for (var i in contentJSON) {
                    result.push({ name: i, value: contentJSON[i] });
                }

                console.log(contents);
                Helpers.poplulateForm(result);

            }
        })(reader);

        reader.readAsText(file);

    },

    parseTXT: function (text) {
        var data = JSON.parse(text);
        console.log(data);
    },

    poplulateForm: function (data) {
        // reset form values from json object
        $.each(data, function (name, val) {
            var $el = $('input[name="' + val.name + '"]'),
				type = $el.attr('type');

            switch (type) {
                case 'checkbox':
                    $el.attr('checked', 'checked');
                    break;
                case 'radio':
                    $el.filter('[value="' + val.value + '"]').attr('checked', 'checked');
                    break;
                default:
                    $el.val(val.value);
            }

            // handle textarea fields
            var $elTextarea = $('textarea[name="' + val.name + '"]');
            $elTextarea.val(val.value);

            var $elSelect = $('select[name="' + val.name + '"]'),
            typeOfSelect = $elSelect.attr('multiple');
            if ((typeOfSelect) && (typeOfSelect === 'multiple')) {
                // handle multi select scenario
                if (val.value !== undefined && val.value instanceof Array) {
                    //alert(val+' is an Array');   
                    $elSelect.val(val.value);
                } else {
                    $elSelect.find($("option[value='" + val.value + "']")).prop('selected', true);
                }
            } else {
                // handle single select scenario
                $elSelect.val(val.value);
            }

        });
    },
    toDatetimeLocal: function () {
        var
          date = this,
          ten = function (i) {
              return (i < 10 ? '0' : '') + i;
          },
          YYYY = date.getFullYear(),
          MM = ten(date.getMonth() + 1),
          DD = ten(date.getDate()),
          HH = ten(date.getHours()),
          II = ten(date.getMinutes()),
          SS = ten(date.getSeconds())
        ;
        return YYYY + '-' + MM + '-' + DD + 'T' +
                 HH + ':' + II + ':' + SS;
    },
    
    getSelectedRowId: function(div){
        var tbl = $(div).DataTable();
        var $row = Helpers.findSelectedRow(tbl);
        if ($row == null)
            return;
        var data = tbl.row($row).data();
        var selectedID = data[0];
        return selectedID;
    },

    updateReportChildByType: function (Type, item) {
        var selectedItem = null;       
        var reportJSON = CD.AccidentForm.selectedReport;
        if (reportJSON != undefined && reportJSON != null) {
            switch (Type) {
                //get vehicles              
                case 1:
                    var index = reportJSON.vehicles.findIndex(function (el) {
                        return el.VehicleId == item.VehicleId;
                    });
                    if (index >= 0) {
                        reportJSON.vehicles[index] = item;
                    }
                    break;
                //get charges
                case 2:                       
                    var index = reportJSON.charges.findIndex(function (el) {
                        return el.CHARGEId == item.CHARGEId;
                    });
                    if (index >= 0) {
                        reportJSON.charges[index] = item;
                    }
                    break;
                    //get witnesses
                case 3:
                    var index = reportJSON.witnesses.findIndex(function (el) {
                        return el.WitnessId == item.WitnessId;
                    });
                    if (index >= 0) {
                        reportJSON.witnesses[index] = item;
                    }
                    break;
                    //get occupants
                case 4:
                    var index = reportJSON.occupants.findIndex(function (el) {
                        return el.OccupantId == item.OccupantId;
                    });
                    if (index >= 0) {
                        reportJSON.occupants[index] = item;
                    }
                    break;
                case 5:
                    if (reportJSON.accidentReport.CaseId == item.CaseId) {
                        reportJSON.accidentReport = item;
                    }
                    break;
                    // get sketch
                case 6:               
                    reportJSON.accidentReport.DriverSig = item;
                    var d = new Date();
                    reportJSON.accidentReport.DriverSign_Time = d;
                    break;
                case 7:
                    reportJSON.accidentReport.SupervisorSig = item;
                    var d = new Date();
                    reportJSON.accidentReport.SupervisorSig_Time = d;
                    break;
                case 8:
                    reportJSON.accidentReport.SafetyOfficerSig = item;
                    var d = new Date();
                    reportJSON.accidentReport.SafetyOfficerSig_Time = d;
                    break;
                case 9:
                    reportJSON.accidentReport.IntsSketch = item;
                    break;


            }
            //localforage.setItem("selectedReport", reportJSON).then(
            //                            function success() {
            //                            }, function failure(err) {
            //                            }
            //                        )
        }
        CD.AccidentForm.selectedReport = reportJSON;
    },

    
    addReportChildByType: function (Type, item) {
        var selectedItem = null;
        var reportJSON = CD.AccidentForm.selectedReport;
        if (reportJSON != undefined && reportJSON != null) {
            switch (Type) {
                //get vehicles              
                case 1:
                    var theMatch = reportJSON.vehicles.find(function (el) {
                        return el.VehicleId == item.VehicleId;
                    });
                    if (theMatch != null) {
                        // do nothing if there is a charge in the list with same charge id with added charge
                    }
                    else{
                        reportJSON.vehicles.push(item);
                    }
                    break;
                //get charges
                case 2:
                    var theMatch = reportJSON.charges.find(function (el) {
                        return el.CHARGEId == item.CHARGEId;
                    });
                    if (theMatch != null) {
                        // do nothing if there is a charge in the list with same charge id with added charge
                    }
                    else{
                        reportJSON.charges.push(item);
                    }
                    break;
                //get witnesses
                case 3:
                    var theMatch = reportJSON.witnesses.find(function (el) {
                        return el.WitnessId == item.WitnessId;
                    });

                    if (theMatch != null) {
                        // do nothing if there is a charge in the list with same charge id with added charge
                    }
                    else {
                        reportJSON.witnesses.push(item);
                    }
                    break;
                //get occupants
                case 4:
                    var theMatch = reportJSON.occupants.find(function (el) {
                        return el.OccupantId == item.OccupantId;
                    });
                    if (theMatch != null) {
                        // do nothing if there is a charge in the list with same charge id with added charge
                    }
                    else {
                        reportJSON.occupants.push(item);
                    }                       
            }
        }
        CD.AccidentForm.selectedReport = reportJSON;
    },

    delReportChildByType: function (Type, Id) {
        var items = null;
        var reportJSON = CD.AccidentForm.selectedReport;
        if (reportJSON != undefined && reportJSON != null) {
            switch (Type) {
                //get vehicles              
                case 1:
                    items = reportJSON.vehicles.filter(function (el) {
                        return el.VehicleId !== Id;
                    });
                    CD.AccidentForm.selectedReport.vehicles = items;
                    break;
                //get charges
                case 2:
                    items = reportJSON.charges.filter(function (el) {
                        return el.CHARGEId !== Id;
                    });
                    CD.AccidentForm.selectedReport.charges = items;
                    break;
                //get witnesses
                case 3:
                    items = reportJSON.witnesses.filter(function (el) {
                        return el.WitnessId !== Id;
                    });
                    CD.AccidentForm.selectedReport.witnesses = items;
                    break;
                //get occupants
                case 4:
                    items = reportJSON.occupants.filter(function (el) {
                        return el.OccupantId !== Id;
                    });
                    CD.AccidentForm.selectedReport.occupants = items;
            }
            //localforage.setItem("selectedReport", reportJSON).then(
            //                            function success() {
            //                            }, function failure(err) {
            //                            }
            //                        )
        }
       
    },

    findMaxChildrenID: function (Type) {
        var index = 0;
        var reportJSON = CD.AccidentForm.selectedReport;
        if (reportJSON != undefined && reportJSON != null) {
            switch (Type) {
                //get vehicles              
                case 1:
                    index = Math.max.apply(Math, reportJSON.vehicles.map(function (o) { return o.VehicleId; }));
                    break;
                    //get charges
                case 2:
                    index = Math.max.apply(Math, reportJSON.charges.map(function (o) { return o.CHARGEId; }));
                    break;
                    //get witnesses
                case 3:
                    index = Math.max.apply(Math, reportJSON.witnesses.map(function (o) { return o.WitnessId; }));
                    break;
                    //get occupants
                case 4:
                    index = Math.max.apply(Math, reportJSON.occupants.map(function (o) { return o.OccupantId; }));
            }           
        }
        if (index == -Infinity || index == Infinity) {
            index = 0;
        }
        return index;
    },

    getReportChildByType: function (Type, Id) {
        var selectedItem = null;
        var reportJSON = CD.AccidentForm.selectedReport;
        if (reportJSON != undefined && reportJSON != null) {
            var ind, len;
            switch (Type) {
                //get vehicles              
                case 1:
                    for (ind = 0, len = reportJSON.vehicles.length; ind < len; ind++) {
                        var a = reportJSON.vehicles[ind];
                        if (a.VehicleId == Id) {
                            selectedItem = a;
                        }
                    }
                    CD.AccidentForm.selectedItem = selectedItem;
                    break;
                //get charges
                case 2:
                    for (ind = 0, len = reportJSON.charges.length; ind < len; ind++) {
                        var a = reportJSON.charges[ind];
                        if (a.CHARGEId == Id) {
                            selectedItem = a;
                        }
                    }
                    CD.AccidentForm.selectedItem = selectedItem;
                    break;
                //get witnesses
                case 3:
                    for (ind = 0, len = reportJSON.witnesses.length; ind < len; ind++) {
                        var a = reportJSON.witnesses[ind];
                        if (a.WitnessId == Id) {
                            selectedItem = a;
                        }
                    }
                    CD.AccidentForm.selectedItem = selectedItem;
                    break;
                //get occupants
                case 4:
                    for (ind = 0, len = reportJSON.occupants.length; ind < len; ind++) {
                        var a = reportJSON.occupants[ind];
                        if (a.OccupantId == Id) {
                            selectedItem = a;
                        }
                    }
                    CD.AccidentForm.selectedItem = selectedItem;
                    break;
                case 5:
                    CD.AccidentForm.selectedItem = reportJSON.accidentReport;
                    break;

            }
        }
        return selectedItem;
    },

    getViewReportChildByType: function (Type, Id) {
        var selectedItem = null;
        var reportJSON = CD.ViewAccidentForm.selectedReport;
        if (reportJSON != undefined && reportJSON != null) {
            var ind, len;
            switch (Type) {
                //get vehicles              
                case 1:
                    for (ind = 0, len = reportJSON.vehicles.length; ind < len; ind++) {
                        var a = reportJSON.vehicles[ind];
                        if (a.VehicleId == Id) {
                            selectedItem = a;
                        }
                    }
                    CD.ViewAccidentForm.selectedItem = selectedItem;
                    break;
                    //get charges
                case 2:
                    for (ind = 0, len = reportJSON.charges.length; ind < len; ind++) {
                        var a = reportJSON.charges[ind];
                        if (a.CHARGEId == Id) {
                            selectedItem = a;
                        }
                    }
                    CD.ViewAccidentForm.selectedItem = selectedItem;
                    break;
                    //get witnesses
                case 3:
                    for (ind = 0, len = reportJSON.witnesses.length; ind < len; ind++) {
                        var a = reportJSON.witnesses[ind];
                        if (a.WitnessId == Id) {
                            selectedItem = a;
                        }
                    }
                    CD.ViewAccidentForm.selectedItem = selectedItem;
                    break;
                    //get occupants
                case 4:
                    for (ind = 0, len = reportJSON.occupants.length; ind < len; ind++) {
                        var a = reportJSON.occupants[ind];
                        if (a.OccupantId == Id) {
                            selectedItem = a;
                        }
                    }
                    CD.ViewAccidentForm.selectedItem = selectedItem;
                    break;
                case 5:
                    CD.ViewAccidentForm.selectedItem = reportJSON.accidentReport;
                    break;

            }
        }
        return selectedItem;
    },
    //PopulateReport2JSON: function (data) {
    //    console.log(data);
    //    CD.AccidentForm.incidentFormObj = CD.AccidentForm.IncidentRawData;
    //},
    fnDisableFormFields: function(div){
        $(div).find(':input').each(function () {
            switch (this.type) {
                case 'password':
                case 'text':
                case 'textarea':
                case 'file':
                case 'select-one':
                case 'select-multiple':
                case 'date':
                case 'datetime-local':
                case 'number':
                case 'tel':
                case 'email':
                case 'checkbox':
                case 'radio':
                    jQuery(this).prop("disabled", true);
                    break;
            }
        })
    },

    fnListenFormFields: function(div){
        $(div).find(':input').each(
            function () {
                jQuery(this).change(function () {
                    if ($("#btn_submitAccdForm_Edit").hasClass('btn-success')) {
                        $("#btn_submitAccdForm_Edit").removeClass('btn-success');
                        $("#btn_submitAccdForm_Edit").addClass('btn-danger');
                        $("#CommitStatus").html("There are changes not committed yet.");
                    } 
                })
            }
        )

    },

    fnClearFormFields: function(div){
        $(div).find(':input').each(function () {
            switch (this.type) {
                case 'password':
                case 'text':
                case 'textarea':
                case 'file':
                case 'select-one':
                case 'select-multiple':
                case 'date':
                case 'datetime-local':                   
                case 'number':
                case 'tel':
                case 'email':
                    jQuery(this).val('');
                    break;
                case 'checkbox':
                case 'radio':
                    this.checked = false;
                    break;
            }
        })
    },
   
    fnConvertDataURIToBinary: function (dataURI) {
        var BASE64_MARKER = ';base64,';
        var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
        var base64 = dataURI.substring(base64Index);
        var raw = window.atob(base64);
        var rawLength = raw.length;
        var array = new Uint8Array(new ArrayBuffer(rawLength));

        for(i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i);
        }
        return array;
    }

    //fnGetSelectedID: function(oTableLocal) {
    //    var ind = Helpers.fnGetSelectedIndex(oTableLocal);

    //    if (ind < 0) {
    //        return -1;
    //    } else {
    //        return oTableLocal.fnGetData(ind, 0);
    //    }
    //}

}