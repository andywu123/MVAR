(function(global, undefined) {
	
	//// Get a regular interval for drawing to the screen
	//window.requestAnimFrame = (function (callback) {
	//	return window.requestAnimationFrame || 
	//				window.webkitRequestAnimationFrame ||
	//				window.mozRequestAnimationFrame ||
	//				window.oRequestAnimationFrame ||
	//				window.msRequestAnimaitonFrame ||
	//				function (callback) {
	//				 	window.setTimeout(callback, 1000/60);
	//				};
	//})();

	// Set up the canvas
	var canvas = document.getElementById("signature-pad");
	var ctx = canvas.getContext("2d");
	ctx.strokeStyle = "#222222";
	ctx.lineWith = 2;
	// Set up the UI
    //var sigImage = document.getElementById("sig-image");
	var clearBtn = document.getElementById("sig-clearBtn");
	var submitBtn = document.getElementById("sig-submitBtn");
	clearBtn.addEventListener("click", function (e) {
		clearCanvas();
		//sigImage.setAttribute("src", "");
	}, false);
	submitBtn.addEventListener("click", function (e) {
	    var dataUrl = canvas.toDataURL();
	    var sketchArray = Helpers.fnConvertDataURIToBinary(dataUrl);
        // safety officer signs
	    if (CD.AccidentForm.signedRole == 1) {
	        Helpers.updateReportChildByType(8, dataUrl);
	        CD.intersection.fnCreateImagesFromBlob("SafetyOfficerSign_edit", dataUrl);	      
	    }
            //supervisor sign
	    else if (CD.AccidentForm.signedRole == 2) {
	        Helpers.updateReportChildByType(7, dataUrl);
	        CD.intersection.fnCreateImagesFromBlob("SupervisorSign_edit", dataUrl);
	    }
            // driver sign
	    else if (CD.AccidentForm.signedRole == 3) {
	        Helpers.updateReportChildByType(6, dataUrl);
	        CD.intersection.fnCreateImagesFromBlob("DriverSign_edit", dataUrl);
	    }

	    if ($("#btn_submitAccdForm_Edit").hasClass('btn-success')) {
	        $("#btn_submitAccdForm_Edit").removeClass('btn-success');
	        $("#btn_submitAccdForm_Edit").addClass('btn-danger');
	        $("#CommitStatus").html("There are changes not committed yet.");
	    }
	    //Helpers.showNotificationModal("Signature Save", "The Ink Signature is saved successfully!");
	}, false);

	var signaturePad = new SignaturePad(canvas, {
	    backgroundColor: 'rgb(255, 255, 255)' // necessary for saving image as JPEG; can be removed is only saving as PNG or SVG
	});

	var SimpleDrawingBoard = global.SimpleDrawingBoard;

	global.sdb = new SimpleDrawingBoard(document.getElementById('intersectionDraw'), {
	    lineColor: '#000',
	    lineSize: 5,
	    boardColor: 'transparent',
	    historyDepth: 30
	});
	var bckImage = AbsoluteURL + "/Content/images/trafficIntersection.png";
	global.sdb.setImg(bckImage, false, false);

    // Adjust canvas coordinate space taking into account pixel ratio,
    // to make it look crisp on mobile devices.
    // This also causes canvas to be cleared.
	function resizeCanvas() {
	    // When zoomed out to less than 100%, for some very strange reason,
	    // some browsers report devicePixelRatio as less than 1
	    // and only part of the canvas is cleared then.
	    var ratio = Math.max(window.devicePixelRatio || 1, 1);

	    // This part causes the canvas to be cleared
	    canvas.width = canvas.offsetWidth * ratio;
	    canvas.height = canvas.offsetHeight * ratio;
	    canvas.getContext("2d").scale(ratio, ratio);

	    // This library does not listen for canvas changes, so after the canvas is automatically
	    // cleared by the browser, SignaturePad#isEmpty might still return false, even though the
	    // canvas looks empty, because the internal data of this library wasn't cleared. To make sure
	    // that the state of this library is consistent with visual state of the canvas, you
	    // have to clear it manually.    
	}

    // On mobile devices it might make more sense to listen to orientation change,
    // rather than window resize events.
	//window.onresize = resizeCanvas;
	$('#inkSignModal').on('shown.bs.modal', function () {
	    resizeCanvas();
	    signaturePad = new SignaturePad(canvas, {
	        backgroundColor: 'rgb(255, 255, 255)' // necessary for saving image as JPEG; can be removed is only saving as PNG or SVG
	    });
	    signaturePad.clear();
	})


	//// Set up mouse events for drawing
	//var drawing = false;
	//var mousePos = { x:0, y:0 };
	//var lastPos = mousePos;
	//canvas.addEventListener("mousedown", function (e) {
	//	drawing = true;
	//	lastPos = getMousePos(canvas, e);
	//}, false);
	//canvas.addEventListener("mouseup", function (e) {
	//	drawing = false;
	//}, false);
	//canvas.addEventListener("mousemove", function (e) {
	//	mousePos = getMousePos(canvas, e);
	//}, false);

	//// Set up touch events for mobile, etc
	//canvas.addEventListener("touchstart", function (e) {
	//	mousePos = getTouchPos(canvas, e);
	//	var touch = e.touches[0];
	//	var mouseEvent = new MouseEvent("mousedown", {
	//		clientX: touch.clientX,
	//		clientY: touch.clientY
	//	});
	//	canvas.dispatchEvent(mouseEvent);
	//}, false);
	//canvas.addEventListener("touchend", function (e) {
	//	var mouseEvent = new MouseEvent("mouseup", {});
	//	canvas.dispatchEvent(mouseEvent);
	//}, false);
	//canvas.addEventListener("touchmove", function (e) {
	//	var touch = e.touches[0];
	//	var mouseEvent = new MouseEvent("mousemove", {
	//		clientX: touch.clientX,
	//		clientY: touch.clientY
	//	});
	//	canvas.dispatchEvent(mouseEvent);
	//    // Prevent the whole page from dragging if on mobile
	//	e.preventDefault();
	//}, false);

	//// Prevent scrolling when touching the canvas
	////document.body.addEventListener("touchstart", function (e) {
	////	if (e.target == canvas) {
	////		e.preventDefault();
	////	}
	////}, false);
	////document.body.addEventListener("touchend", function (e) {
	////	if (e.target == canvas) {
	////		e.preventDefault();
	////	}
	////}, false);
	////document.body.addEventListener("touchmove", function (e) {
	////	if (e.target == canvas) {
	////		e.preventDefault();
	////	}
	////}, false);

	//// Get the position of the mouse relative to the canvas
	//function getMousePos(canvasDom, mouseEvent) {
	//	var rect = canvasDom.getBoundingClientRect();
	//	return {
	//		x: mouseEvent.clientX - rect.left,
	//		y: mouseEvent.clientY - rect.top
	//	};
	//}

	//// Get the position of a touch relative to the canvas
	//function getTouchPos(canvasDom, touchEvent) {
	//	var rect = canvasDom.getBoundingClientRect();
	//	return {
	//		x: touchEvent.touches[0].clientX - rect.left,
	//		y: touchEvent.touches[0].clientY - rect.top
	//	};
	//}

	//// Draw to the canvas
	//function renderCanvas() {
	//    if (drawing) {
	//        ctx.beginPath();
	//		ctx.moveTo(lastPos.x, lastPos.y);
	//		ctx.lineTo(mousePos.x, mousePos.y);
	//		ctx.stroke();
	//		ctx.closePath();
	//		lastPos = mousePos;
	//	}
	//}

	function clearCanvas() {
	    //canvas.width = canvas.width;
	    var context = canvas.getContext('2d');
	    context.clearRect(0, 0, canvas.width, canvas.height);
	}

	//// Allow for animation
	//(function drawLoop () {
	//	requestAnimFrame(drawLoop);
	//	renderCanvas();
	//})();

}(window));