var THOLD = 0x15;
var drumNotes = [0, 100];
var drumPos = [(50, 100, 100, 150), (150, 100, 200, 150)];

// $(document).ready(function() {

	var lastImageData;

	function blend() {
		console.log('hi');
		var sourceData = contextSource.getImageData(0, 0, IMG_WIDTH, IMG_HEIGHT);
		if (!lastImageData) 
			lastImageData = contextSource.getImageData(0, 0, IMG_WIDTH, IMG_HEIGHT);
		var blendedData = contextSource.createImageData(IMG_WIDTH, IMG_HEIGHT);
		differenceAccuracy(blendedData.data, sourceData.data, lastImageData.data);
		contextBlended.putImageData(blendedData, 0, 0);
		lastImageData = sourceData;
	}

	function threshold(value) {
		if (value > THOLD) return 0xFF;
		return 0;
	}

	function difference(target, data1, data2) {
		if (data1.length != data2.length) return null;
		for (var i = 0; i < (data1.length * 0.25); i++) {
			if (data1[4*i] == 0)
				target[4*i] = 0;
			else
				target[4*i] = Math.abs(data1[4*i] - data2[4*i]);
			if (data1[4*i+1] == 0)
				target[4*i+1] = 0;
			else
				target[4*i+1] = Math.abs(data1[4*i+1] - data2[4*i+1]);
			if (data1[4*i+2] == 0)
				target[4*i+2] = 0;
			else
				target[4*i+2] = Math.abs(data1[4*i+2] - data2[4*i+2]);
			target[4*i+3] = 0xFF;
		}
	}

	function differenceAccuracy(target, data1, data2) {
		if (data1.length != data2.length) return null;
		for (var i = 0; i < (data1.length * 0.25); i++) {
			var av1 = (data1[4*i] + data1[4*i+1] + data1[4*i+2]) / 3;
			var av2 = (data2[4*i] + data2[4*i+1] + data2[4*i+2]) / 3;
			var difference = threshold(Math.abs(av1 - av2));
			target[4*i] = difference;
			target[4*i+1] = difference;
			target[4*i+2] = difference;
			target[4*i+3] = 0xFF;
		}
	}

	function checkAreas() {
		for (var i = 0; i < drumPos.length; i++) {
			var blendedData = contextBlended.getImageData(drumPos[i][0],
																										drumPos[i][1],
																										drumPos[i][2],
																										drumPos[i][3]);
			var average = 0;
			for (var j = 0; j < (blendedData.data.length * 0.25); j++) {
				average += ( blendedData.data[j*4] 
										 + blendedData.data[j*4+1] 
										 + blendedData.data[j*4+2] ) / 3;
			}
			average = Math.round(average / (blendedData.data.length * 0.25));
			if (average > 10) {
				console.log("Play note " + i);
			}
		}
	}


// });