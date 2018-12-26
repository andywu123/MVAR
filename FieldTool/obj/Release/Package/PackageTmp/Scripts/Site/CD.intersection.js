﻿CD.intersection = {  
    savePNGButton: null, 
    saveJPGButton: null,
    saveSVGButton: null, 
    canvas: null,
    mdl: "#IntersectionModal",
    init: function () {
        // CD.intersection.canvas = CD.canvasDraw.canvas;
        //$(CD.intersection.mdl).modal();
        //$(CD.intersection.mdl).show();
        //var c = document.getElementById("intersectionDraw");
        //if (c != null) {
        //    var ctx = c.getContext("2d");
        //    CD.intersection.canvas = c;
        //}

        $("#Intersection-pad #savejpg").click(function (event) {
            var canvas = sdb.ctx.canvas;
            if (CD.intersection.isCanvasBlank(canvas)) {
                alert("Please provide a SKETCH first.");
            } else {
                //var dataURL = CD.intersection.canvas.toDataURL("image/jpeg");
                var parsedURL = sdb.getImg();
                CD.intersection.download(parsedURL, "sketch.jpg");
           
                //$("#SafetyOfficerSketch").attr("src", parsedURL);
                //var reportId = $("#reportID").val();
                //var safetyofficerSketch = reportId + "_OfficerSketch";

                //localforage.setItem(safetyofficerSketch, { safetyOfficerSignature: parsedURL, reportID: reportId }).then(
                //           function success() {
                //               Helpers.showNotificationModal("Intersection Sketch",
                //   "Safety Officer Sketch is saved!");
                //           }, function failure(err) {

                //           });
            }
        });

        $("#Intersection-pad #saveSketchChanges").click(function (event) {
            var canvas = sdb.ctx.canvas;
            if (CD.intersection.isCanvasBlank(canvas)) {
                alert("Please provide a SKETCH first.");
            } else {
                
                var dataURL = sdb.getImg();
                Helpers.updateReportChildByType(9, dataURL);
                CD.intersection.fnCreateImagesFromBlob("SafetyOfficerSketch_Edit", dataURL);
                if ($("#btn_submitAccdForm_Edit").hasClass('btn-success')) {
                    $("#btn_submitAccdForm_Edit").removeClass('btn-success');
                    $("#btn_submitAccdForm_Edit").addClass('btn-danger');
                    $("#CommitStatus").html("There are changes not committed yet.");
                }
               // Helpers.showNotificationModal("Sketch Save", "The Intersection Sketch is saved successfully!");
            }
        });
    },

    fnCreateImagesFromBlob: function (div, blob) {
        if (typeof blob != 'undefined' && blob != null) {
            var image = new Image();
            image.src = blob;
            document.getElementById(div).innerHTML = '';
            document.getElementById(div).appendChild(image);
        }
    },
    

    parseOriginalCanvas: function () {
        var canvas = document.createElement('canvas');
        var originalCanvas = CD.intersection.canvas;
        // 111
        var x = CD.canvasDraw.drawingAreaX;
        // 11
        var y = CD.canvasDraw.drawingAreaY;
        var w = CD.canvasDraw.drawingAreaWidth;
        var h = CD.canvasDraw.drawingAreaHeight;
        desiredWidth = w;
        desiredHeight = h;

        canvas.width = desiredWidth;
        canvas.height = desiredHeight;
        canvas.getContext('2d').drawImage(originalCanvas, x, y, w, h, 0, 0, desiredWidth, desiredHeight);
        result = canvas.toDataURL();
        return result;
    },

    download: function (dataURL, filename) {
        var blob = CD.intersection.dataURLToBlob(dataURL);
        if (window.navigator && window.navigator.msSaveOrOpenBlob)
        {
            window.navigator.msSaveOrOpenBlob(blob, filename);
        }
        else{
            var url = window.URL.createObjectURL(blob);
            var image = new Image();
            image.src = url;
            var a = document.createElement("a");
            a.style = "display: none";
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        }            
    },

    openImageNewTab: function (image)
    {
        var w = window.open("");
        w.document.write(image.outerHTML);
        //window.open(url, "_blank");
    },

    isCanvasBlank: function (canvas) {
        var blank = document.createElement('canvas');
        blank.width = canvas.width;
        blank.height = canvas.height;
        return canvas.toDataURL() == blank.toDataURL();
    },

    dataURLToBlob: function (dataURL) {
        // Code taken from https://github.com/ebidel/filer.js
        var parts = dataURL.split(';base64,');
        var contentType = parts[0].split(":")[1];
        var raw = window.atob(parts[1]);
        var rawLength = raw.length;
        var uInt8Array = new Uint8Array(rawLength);

        for (var i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }

        return new Blob([uInt8Array], { type: contentType });
    }
}


