var IMG_WIDTH = 320;
var IMG_HEIGHT = 240;

 function getPixelAt(image, x, y){
  var index = 4 * (y*IMG_WIDTH + x);
  //console.log(index);
  //console.log(image);
  var color = [image[index], image[index+1], image[index+2], image[index+3]];
  return color;
}

function handInCorner(image){
  var color = getPixelAt(image, 310, 0);
  var sum = color[0] + color[1] + color[2];
  console.log(sum);
  if (sum < 150) {
    console.log("dark!");
  }
 }


 function makesound(sound) {
    var noteEvents = [];
    Array.prototype.push.apply(noteEvents, MidiEvent.createNote(sound));
    // Create a track that contains the events to play the notes above
    var track = new MidiTrack({ events: noteEvents });

    // Creates an object that contains the final MIDI track in base64 and some
    // useful methods.
    var song  = MidiWriter({ tracks: [track] });

    // Play the song
    song.play();

} 

$(document).ready(function() {
    
    // Make this sound!  :D
 //   makesound('G4');
    
    console.log('hi');
    
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
  		var tmp = parseInt(col[IMG_WIDTH - 1 - i]);
 			img.data[pos + 0] = (tmp >> 16) & 0xff;
 			img.data[pos + 1] = (tmp >> 8) & 0xff;
			img.data[pos + 2] = tmp & 0xff;
			img.data[pos + 3] = 0xff;
			pos += 4;
  	}

    handInCorner(img.data);

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

