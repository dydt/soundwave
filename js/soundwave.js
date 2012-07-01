var root = "http://web.mit.edu/tfleish/www/soundwave/";

// Track our overlays for re-use later
var overlays = [];
var drumsNormal = [];
var drumsActive = [];
var guitarNormal = [];
var guitarActive = [];
var miscNormal = [];
var miscActive = [];

var lastGoodEvent;
var lastEvent;

var currentInstrument;

var timeoutCounter = 56;


function getNote(event, hasFace) {
  if ((timeoutCounter > 20) && (currentInstrument == 'drum')) {
    if (event.tilt > 0.35) {
      console.log('Up');
      playDrum(0);
      drumSound(0);
      timeoutCounter = 0;
    }
    else if (event.tilt < -0.1) {
      console.log('Down');
      playDrum(2);
      drumSound(2);
      timeoutCounter = 0;
    }
    else if (event.pan > 0.25) {
      console.log('Left');
      playDrum(3);
      drumSound(3);
      timeoutCounter = 0;
    }
    else if (event.pan < -0.25) {
      console.log('Right');
      playDrum(1);
      drumSound(1);
      timeoutCounter = 0;
    }
  }
  else if ((timeoutCounter > 55) && (currentInstrument == 'guitar')) {
    if (event.tilt > 0.35) {
      console.log('Up');
      playGuitar(0);
      guitarSound(0);
      timeoutCounter = 0;
    }
    else if (event.tilt < -0.1) {
      console.log('Down');
      playGuitar(2);
      guitarSound(2);
      timeoutCounter = 0;
    }
    else if (event.pan > 0.25) {
      console.log('Left');
      playGuitar(3);
      guitarSound(3);
      timeoutCounter = 0;
    }
    else if (event.pan < -0.25) {
      console.log('Right');
      playGuitar(1);
      guitarSound(1);
      timeoutCounter = 0;
    }
  }
  else if ((timeoutCounter > 55) && (currentInstrument == 'misc')) {
    if (event.tilt > 0.35) {
      console.log('Up');
      playMisc(0);
      miscSound(0);
      timeoutCounter = 0;
    }
    else if (event.tilt < -0.1) {
      console.log('Down');
      playMisc(2);
      miscSound(2);
      timeoutCounter = 0;
    }
    else if (event.pan > 0.25) {
      console.log('Left');
      playMisc(3);
      miscSound(3);
      timeoutCounter = 0;
    }
    else if (event.pan < -0.25) {
      console.log('Right');
      playMisc(1);
      miscSound(1);
      timeoutCounter = 0;
    }
  } 
  else {
    timeoutCounter += 1;
  }
}

/** Animation loop */
function animate(){
  if (lastGoodEvent)
  getNote(lastGoodEvent, lastEvent.hasFace);
  requestAnimFrame(function () {
    animate();
  });
}

/** Standard requestAnimFrame from paulirish.com, running 30 fps */
window.requestAnimFrame = (function (callback) {
  return window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(callback){
    window.setTimeout(callback, 1000 / 1);
  };
})();

function onFaceTrackingChanged(event) {
  try {
    lastEvent = event;
    if (event.hasFace) {
      lastGoodEvent = event;
    }
  } catch(e) {
    console.log("onFaceTrackingChanged: ERROR");
    console.log(e);
  }
}

function startHeadTracking() {
  gapi.hangout.av.effects.onFaceTrackingDataChanged.
      add(onFaceTrackingChanged);
  console.log('Started head tracking');    
}

function showDrums() {
  currentInstrument = 'drum';
  console.log("showing drums");
  hideAllOverlays();
  for (var i = 0; i < drumsNormal.length; i++) {
    drumsNormal[i].setVisible(true);
  }
}

function showGuitar() {
  currentInstrument = "guitar";
  console.log("showing guitar");
  hideAllOverlays();
  for (var i = 0; i < guitarNormal.length; i++) {
    guitarNormal[i].setVisible(true);
  }
}

function showMisc() {
  currentInstrument = "misc";
  console.log("showing misc");
  hideAllOverlays();
  for (var i = 0; i < miscNormal.length; i++) {
    miscNormal[i].setVisible(true);
  }
}

function playDrum(i) {
  console.log("hitting drum");
  drumsActive[i].setVisible(true);
  drumsNormal[i].setVisible(false);
  setTimeout(function() {
    drumsNormal[i].setVisible(true);
    drumsActive[i].setVisible(false);
  }, 450);
}

function playGuitar(i) {
  console.log("hitting guitar");
  guitarActive[i].setVisible(true);
  guitarNormal[i].setVisible(false);
  setTimeout(function() {
    guitarNormal[i].setVisible(true);
    guitarActive[i].setVisible(false);
  }, 450);
}

function playMisc(i) {
  console.log("hitting misc");
  miscActive[i].setVisible(true);
  miscNormal[i].setVisible(false);
  setTimeout(function() {
    miscNormal[i].setVisible(true);
    miscActive[i].setVisible(false);
  }, 450);
}

function showNothing() {
  currentInstrument = "";
  hideAllOverlays();
}

function hideAllOverlays() {
  for (var i = 0; i < drumsNormal.length; i++) {
    drumsNormal[i].setVisible(false);
    drumsActive[i].setVisible(false);
  }
  for (var i = 0; i < guitarNormal.length; i++) {
    guitarNormal[i].setVisible(false);
    guitarActive[i].setVisible(false);
  }
}


/** Initialize our constants, build the overlays */
function createOverlays() {
  console.log("CREATING OVERLAYS");
  x_pos = [0, -0.45, 0, .44];
  y_pos = [-.4, 0, 0.4, 0];
  var scale = .1;
  for (var i = 0; i < 4; i++){
    var drumURL = root + "images/DrumSH.png?num=" + i.toString();
    var drumImage = gapi.hangout.av.effects.createImageResource(drumURL);
    var drumOverlay = drumImage.createOverlay(
      {
      'scale': {'magnitude': scale, 
                'reference': gapi.hangout.av.effects.ScaleReference.WIDTH},
      'position': {'x': x_pos[i], 'y': y_pos[i] }
      });
    drumsNormal.push(drumOverlay);

    var drumActiveURL = root + "images/DrumSH.png?num=1" + i.toString();
    var drumActiveImage = gapi.hangout.av.effects.createImageResource(drumActiveURL);
    var drumActiveOverlay = drumActiveImage.createOverlay(
      {
      'scale': {'magnitude': scale * 1.4, 
                'reference': gapi.hangout.av.effects.ScaleReference.WIDTH},
      'position': {'x': x_pos[i], 'y': y_pos[i] }
      });

    drumsActive.push(drumActiveOverlay);
  }

  scale = 0.15;
  for (var i = 0; i < 4; i++){
    var guitarURL = root + "images/guitar2.png?num=" + i.toString();
    var guitarImage = gapi.hangout.av.effects.createImageResource(guitarURL);
    var guitarOverlay = guitarImage.createOverlay(
      {
      'scale': {'magnitude': scale, 
                'reference': gapi.hangout.av.effects.ScaleReference.WIDTH},
      'position': {'x': x_pos[i], 'y': y_pos[i] }
      });
    guitarNormal.push(guitarOverlay);

    var guitarActiveURL = root + "images/guitar2.png?num=1" + i.toString();
    var guitarActiveImage = gapi.hangout.av.effects.createImageResource(guitarActiveURL);
    var guitarActiveOverlay = guitarActiveImage.createOverlay(
      {
      'scale': {'magnitude': scale * 1.4, 
                'reference': gapi.hangout.av.effects.ScaleReference.WIDTH},
      'position': {'x': x_pos[i], 'y': y_pos[i] }
      });

    guitarActive.push(guitarActiveOverlay);
  }

  var images = ['images/piano.png', 'images/violin.png', 
                'images/viola.png', 'images/flute.png'];
  for (var i = 0; i < 4; i++) {
    var URL = root + images[i];
    var image = gapi.hangout.av.effects.createImageResource(URL);
    var overlay = image.createOverlay(
      {
        'scale': {'magnitude': scale,
                  'reference': gapi.hangout.av.effects.ScaleReference.WIDTH},
        'position': {'x': x_pos[i], 'y': y_pos[i]}
      });
    miscNormal.push(overlay);

    var activeURL = root + images[i] + '?num=1';
    var activeImage = gapi.hangout.av.effects.createImageResource(activeURL);
    var activeOverlay = activeImage.createOverlay(
      {
      'scale': {'magnitude': scale * 1.4, 
                'reference': gapi.hangout.av.effects.ScaleReference.WIDTH},
      'position': {'x': x_pos[i], 'y': y_pos[i] }
      });

    miscActive.push(activeOverlay);

}

createOverlays();

function init() {
  gapi.hangout.onApiReady.add(function(eventObj) {
    if (eventObj.isApiReady) {
      startHeadTracking();
      animate();
    }
  });
}

// Sound stuff

var stringURLs = ['http://www.learner.org/jnorth/sounds/ChordPiano.wav',
                  'http://amath.colorado.edu/pub/matlab/music/wav/violin_A4.wav',
                  'http://amath.colorado.edu/pub/matlab/music/wav/viola.wav',
                  'http://amath.colorado.edu/pub/matlab/music/wav/flute_A5.wav'];


function miscSound(i) {
    var stringSound = gapi.hangout.av.effects.createAudioResource(
        stringURLs[i]).createSound();
    stringSound.play({loop: false, volume:200});
}


var guitarURLs = ['http://soundcavern.free.fr/guitar/Acoustic_Guitar_Chords%20-%20Bmaj.wav',
                  'http://soundcavern.free.fr/guitar/AcGuit_Minor_Chords%20-%20Eminup.wav',
                  'http://www.colorado.edu/physics/phys4830/phys4830_fa01/lab/guitar2.wav',
                  'http://soundcavern.free.fr/guitar/AcGuit_Minor_Chords%20-%20Dmin.wav'];

    
function guitarSound(i) {
    var guitarSound = gapi.hangout.av.effects.createAudioResource(
           guitarURLs[i]).createSound();
     guitarSound.play({loop: false, volume:200});
}


var drumURLs = ['http://students.cs.byu.edu/~cbeacham/Virtual%20Zoo/symbol.wav',
                'http://home.foni.net/~musiksamples/techno/drums/bddruck.wav', 
                'http://muselogic.webmage.com/sounds/drums/akayamaha.wav',
                'http://bigsamples.free.fr/d_kit/bdkick/909kik.wav'];


function drumSound(i) {   
    var drumSound = gapi.hangout.av.effects.createAudioResource(
        drumURLs[i]).createSound();
    drumSound.play({loop: false, volume:200});
    setTimeout(function(){return;}, 1000);
}


gadgets.util.registerOnLoadHandler(init);
