var IMG_WIDTH = 320;
var IMG_HEIGHT = 240;

$(document).ready(function() {
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, IMG_WIDTH, IMG_HEIGHT);

  $("#camera").webcam({
    width: IMG_WIDTH,
    height: IMG_HEIGHT,
    mode: "callback",
    swffile: "lib/jquery-webcam/jscam.swf",
    onTick: 
    	function (remain) {
				if (remain == 0)
					$("#status").text("Cheese!");
				else
					$("#status").text(remain + " seconds remaining...");
			},
    onCapture:
    	function () {
    		webcam.save();
    	},
    onSave:
    	function (data) {
    		var col = data.split(";");
    		alert("hi");
    		var img = new Image();
    		var pos = 0;
    		for (var i = 0; i < IMG_WIDTH; i++) {
    			var tmp = parseInt(col[i]);
    			img.data[pos + 0] = (tmp >> 16) & 0xff;
    			img.data[pos + 1] = (tmp >> 8) & 0xff;
					img.data[pos + 2] = tmp & 0xff;
					img.data[pos + 3] = 0xff;
					pos += 4;
    		}
    		if (pos >= 4 * IMG_WIDTH * IMG_HEIGHT) {
    			ctx.putImageData(img, 0, 0);
    			pos = 0;
    		}
    	},
    debug: 	
    	function (type, string) {
        $("#status").html(type + ": " + string);
			},
    onLoad: 
    	function() {
				var cams = webcam.getCameraList();
				for (var i in cams) {
		      $("#cams").append("<li>" + cams[i] + "</li>");
			  }
    	}
	});
});