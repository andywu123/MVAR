CD.Reports = {
    oReportTable: null,
    oClosedReportTable: null,
    /* Initialize home page's datatable and click handlers */
    init: function ReportInit() {
        //var format = "M/D/YYYY h:m:s a";
        //if (CD.Reports.OpenLoginModal) {
        //    CD.Reports.fnOpenLoginNotification();
        //};
        var value = JSON.parse(sessionStorage.getItem('HideLoginModal'));
        if (!value == true) {
            //CD.Reports.fnOpenLoginNotification();
        }
        oReportTable = $('#ReportTable').dataTable({
            "order": [[4, "desc"]],
            //"sScrollY": "300px",
            "pagingType": "simple",
            "bPaginate": true,
            "info": false,
            "columnDefs": [
                        { "ordable": false, "targets": 2 },
                        { "type": "datetime-system", "targets": 4 },
                        //{ "searchable": false, "targets": 2 },
                        {
                            "targets": [0],
                            "visible": false
                        }]
        });

        $('#ReportTable tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oReportTable.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });
        //
        //click Events for home page
        $('#close_Report_fr_home').click(function () {
            var tbl = $('#ReportTable').DataTable();
            var $row = Helpers.findSelectedRow(tbl);
            if ($row == null)
                return;
            var data = tbl.row($row).data();
            var ReportCaseID = data[0];
            if (ReportCaseID >= 0) {
                Helpers.showSaveStatusModal("Close Report", "Are you sure to close this report",
                      function () {
                          $.post(siteBaseUrl + "Home/CloseAccidentReport?CaseId=" + ReportCaseID,
                              function (data) {
                                  if (data == "True") {
                                      tbl.row($row)
                                      .remove()
                                      .draw();
                                  } else {
                                      Helpers.showNotificationModal("Close Case Failed", "This Report is failed to close. ");
                                      window.open(siteBaseUrl + "Home/Index", "_self");
                                  }
                              }
                            );
                      },
                        function () {
                            //Do nothing
                        });
            }
        });

        $('#print_Report_fr_home').click(function () {
            var tbl = $('#ReportTable').DataTable();
            var $row = Helpers.findSelectedRow(tbl);
            if ($row == null)
                return;
            var data = tbl.row($row).data();
            var ReportCaseID = data[0];
            var reportCaseNumber = data[1];
            if (ReportCaseID >= 0) {
                var $this = $(this);

                Helpers.showSaveStatusModal("Print Report", "Are you sure to print this report with case number " + '<b>' + reportCaseNumber + '</b>',
                        function () {
                            //$this.button('loading');
                            $('#myOverlay').show();
                            document.getElementById("loader").style.display = "block";
                            $.post(siteBaseUrl + "Home/PrintAccidentReport?CaseId=" + ReportCaseID,
                            function (html) {
                                if (html != "" && html != null) {
                                    window.location = siteBaseUrl + "Home/DownloadFile?fileguid=" + html.FileGuid + "&filename=" + html.FileName;
                                    setTimeout(function () {
                                        $('#myOverlay').hide();
                                        document.getElementById("loader").style.display = "none";
                                    }, 100);
                                } else {
                                    Helpers.showNotificationModal("Print Report Failed", "This Report is failed to Print! ");
                                    window.open(siteBaseUrl + "Home/Index", "_self");
                                }
                            }
                            );
                        },
                        function () {
                            //Do nothing
                        });

            }
        });

        $('#create_Report_to_home').click(function () {
            window.open(siteBaseUrl + "Home/CreateAccidentReport", "_self");
        });

        $('#edit_Report_in_home').click(function () {
            var tbl = $('#ReportTable').DataTable();
            var $row = Helpers.findSelectedRow(tbl);
            if ($row == null)
                return;
            var data = tbl.row($row).data();
            var ReportCaseID = data[0];
            if (ReportCaseID >= 0) {

                Promise.all([
                   CD.services.getReportById(ReportCaseID)
                ]).then(function success(values) {
                    localforage.setItem("selectedReport", values[0]).then(
                            function success() {
                                var a = {
                                    CaseId: ReportCaseID
                                };
                                var params = jQuery.param(a, true);
                                window.open(siteBaseUrl + "Home/EditAccidentReport?" + params, "_self");
                            }, function failure(err) {
                            }
                        )


                });

            }
        });

        $('#ClosedReportTable tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oClosedReportTable.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $('#SearchClosedReport_fr_home').click(function () {
            // get ddl options for case owner and accident date and case number 
            if (Offline.state === 'down') {
                Helpers.showNotificationModal("Internet Offline", "There is no internet connection, the search function is not available.");
                $("#btn_searchReports").prop('disabled', true);
                $("#FilterReportsModal").modal();

            }
            else {
                var sel_owner = document.getElementById('OfficeDDL');
                var sel_casenumber = document.getElementById('CaseNumberDDL');
                var sel_accidentdate = document.getElementById('AccidentDateDDL');
                var sel_OwnerOpts, sel_CasenumberOpts, sel_DatesOpts;

                Promise.all([
                      CD.services.getReportOwnerDDL()
                ]).then(function success(values) {
                    if (values.toString() != "") {
                        sel_OwnerOpts = values[0];
                        Promise.all([
                            CD.services.getCaseNumberDDL()
                        ]).then(function success(values) {
                            if (values.toString() != "") {
                                sel_CasenumberOpts = values[0];
                                Promise.all([
                                    CD.services.getAccidentDatesDDL()
                                ]).then(function success(values) {
                                    if (values.toString() != "") {
                                        sel_DatesOpts = values[0];
                                        CD.Reports.fnPopulateSelect(sel_OwnerOpts, sel_owner);
                                        CD.Reports.fnPopulateSelect(sel_CasenumberOpts, sel_casenumber);
                                        CD.Reports.fnPopulateSelect(sel_DatesOpts, sel_accidentdate);
                                        $("#btn_searchReports").prop('disabled', false);
                                        $('#OfficeDDL').val('N/A');
                                        $('#CaseNumberDDL').val('N/A');
                                        $('#AccidentDateDDL').val('N/A');
                                        $("#FilterReportsModal").modal();
                                    }
                                    else {
                                        Helpers.showNotificationModal("Returned Results", "There is no Accident Report found.");
                                        return;
                                    }

                                });
                            }
                            else {
                                Helpers.showNotificationModal("Returned Results", "There is no Accident Report found.");
                                return;
                            }

                        });
                    }
                    else {
                        Helpers.showNotificationModal("Returned Results", "There is no Accident Report found.");
                        return;
                    }
                });

            }

        });

        $('#print_ClosedReport_fr_home').click(function () {
            var tbl = $('#ClosedReportTable').DataTable();
            var $row = Helpers.findSelectedRow(tbl);
            if ($row == null)
                return;
            var data = tbl.row($row).data();
            var ReportCaseID = data[0];
            var reportCaseNumber = data[1];
            if (ReportCaseID >= 0) {
                var $this = $(this);

                Helpers.showSaveStatusModal("Print Report", "Are you sure to print this report with case number " + '<b>' + reportCaseNumber + '</b>',
                        function () {
                            //$this.button('loading');
                            $('#myOverlay').show();
                            document.getElementById("loader").style.display = "block";
                            $.post(siteBaseUrl + "Home/PrintAccidentReport?CaseId=" + ReportCaseID,
                            function (html) {
                                if (html != "" && html != null) {
                                    window.location = siteBaseUrl + "Home/DownloadFile?fileguid=" + html.FileGuid + "&filename=" + html.FileName;
                                    setTimeout(function () {
                                        $('#myOverlay').hide();
                                        document.getElementById("loader").style.display = "none";
                                    }, 100);
                                } else {
                                    Helpers.showNotificationModal("Print Report Failed", "This Report is failed to Print! ");
                                    window.open(siteBaseUrl + "Home/Index", "_self");
                                }
                            }
                            );
                        },
                        function () {
                            //Do nothing
                        });

            }
        });

        $('#edit_ClosedReport_in_home').click(function () {
            var tbl = $('#ClosedReportTable').DataTable();
            var $row = Helpers.findSelectedRow(tbl);
            if ($row == null)
                return;
            var data = tbl.row($row).data();
            var ReportCaseID = data[0];
            if (ReportCaseID >= 0) {
                Promise.all([
                   CD.services.getReportById(ReportCaseID)
                ]).then(function success(values) {
                    localforage.setItem("selectedReport", values[0]).then(
                            function success() {
                                var a = {
                                    CaseId: ReportCaseID
                                };
                                var params = jQuery.param(a, true);
                                window.open(siteBaseUrl + "Home/ViewAccidentReport?" + params, "_self");
                            }, function failure(err) {
                            }
                        )
                });
            }
        });

        oClosedReportTable = $('#ClosedReportTable').dataTable({
            "aaSorting": [[1, "asc"]],
            //"sScrollY": "300px",
            "pagingType": "simple",
            "bPaginate": true,
            "info": false,
            "columnDefs": [
                        { "ordable": false, "targets": 2 },
                        { "searchable": false, "targets": 2 },
                        {
                            "targets": 0,
                            "visible": false
                        }]
        });

        $('#btn_searchReports').click(function () {
            var officer = $('#FilterForm #OfficeDDL').val();
            var accidentDate = $('#FilterForm #AccidentDateDDL').val();
            var caseNumber = $('#FilterForm #CaseNumberDDL').val();

            if (officer != null && accidentDate != null && caseNumber != null) {
                Promise.all([
                   CD.services.getClosedReportsByParas(officer, accidentDate, caseNumber)
                ]).then(function success(values) {
                    if (values.toString() != "")
                    {
                        var result = values[0];
                        //datatable
                        var pointArray = [];

                        $.each(result, function (i, item) {
                            pointArray.push([item.CaseId, item.CaseNumber, item.AccidentLocation, item.AccidentTime, item.CreateDate]);

                        })
                        var datatable = $('#ClosedReportTable').DataTable();
                        datatable.clear();
                        datatable.rows.add(pointArray);
                        datatable.draw();
                        $("#CloseReportsModal").modal();
                    }
                    else {
                        Helpers.showNotificationModal("Returned Results", "There is no Accident Report found.");
                    }
                   

                });

            }
            else {
                Helpers.showNotificationModal("Returned Results", "There is no Accident Report found.");
            }
        });

        var updatedName = CD.Reports.fnUpdateUserName(usrName);
        $('#logoutDiv')[0].innerHTML = '<span class="glyphicon glyphicon-log-out"></span> ' + updatedName;
        $('#logoutDiv').click(function () {
            CD.Reports.fnOpenLoginNotification();
        });

    },

    fnOpenLoginNotification: function(){
        Helpers.showNotificationModal(
                "Instructions to Login (Credentials)",
                 '<ul class="list-group">' +
                  '<li class="list-group-item"><span class="badge">Note</span>The User Name on the top right is the user credential used to login to the app. If it\'s not your credential, please follow the instructions below to use your own credential to login to the site. </li><br>'
                  + '<li class="list-group-item"><span class="badge">Recommended!</span>It\'s strongly recommended not to check <strong>remember my credential checkbox</strong> everytime user credential prompt shows up.</li><br>'
                   + '<li class="list-group-item"><span class="badge">Instructions</span>Please follow the link below to Remove the Saved Credential:'
                     + '<br><ul><li>'
                     + '<a href="https://www.computerhope.com/issues/ch000731.htm" target="_blank">' + "Login Credential Clear Instruction" + '</a>'
                     + '</li></ul>'
                   + '</ul>')
        //Helpers.showLoginNotificationModal();
    },

    fnUpdateUserName: function (userName) {
        var returnedName = "";
        if (userName == "") {
            returnedName = "N/A";
            return returnedName;
        }

        matchString = "baltimore";
        var index = userName.toLowerCase().indexOf(matchString);
        if (index != -1) {
            returnedName = CD.Reports.fnAddTag2Str(userName, "\\", index + 9);
            return returnedName;
        }
        return userName;
    },

    fnAddTag2Str: function insert(main_string, ins_string, pos) {
        if (typeof (pos) == "undefined") {
            pos = 0;
        }

        if (typeof (ins_string) == "undefined") {
            ins_string = '';
        }
        return main_string.slice(0, pos) + ins_string + main_string.slice(pos);
    },

    fnPopulateSelect: function (options, sel) {
        sel.innerHTML = "";
        for (var i = 0; i < options.length; i++) {
            var opt = document.createElement('option');
            opt.innerHTML = options[i];
            opt.value = options[i];
            sel.appendChild(opt);
        }
    }

}