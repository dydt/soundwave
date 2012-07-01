var IMG_WIDTH = 320;
var IMG_HEIGHT = 240;

$(document).ready(function() {
	var pos = 0;
	var ctx = null;
	var saveCB, image = [];
	var canvas = document.getElementById("canvas");
	canvas.setAttribute('width', IMG_WIDTH);
	canvas.setAttribute('height', IMG_HEIGHT);
  ctx = canvas.getContext("2d");
  image = ctx.getImageData(0, 0, IMG_WIDTH, IMG_HEIGHT);

  $("#start").click(function() { 
  	webcam.capture();
  });
  
  setImage = function(data) {
  	var col = data.split(";");
  	var img = image;
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
  };

  $("#camera").webcam({
    width: IMG_WIDTH,
    height: IMG_HEIGHT,
    mode: "stream",
    swffile: "lib/jquery-webcam/jscam.swf",

    onSave: setImage,
    debug: function (type, string) { console.log(type + ": " + string); }
	});
});