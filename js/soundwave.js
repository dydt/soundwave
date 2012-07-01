var root = "http://web.mit.edu/tfleish/www/soundwave/";
var root = "http://web.mit.edu/lalpert/www/soundwave/soundwave/";

// Track our overlays for re-use later
var overlays = [];
var drumsNormal = [];
var drumsActive = [];

var lastGoodEvent;
var lastEvent;

var currentInstrument;

var timeoutCounter = 61;


function getNote(event, bright) {
  if (timeoutCounter > 60) {
    if (currentInstrument == 'drum') {
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
        drumSound(1);
        timeoutCounter = 0;
      }
      else if (event.pan < -0.25) {
        console.log('Right');
        playDrum(1);
        drumSound(1);
        timeoutCounter = 0;
      }
    }
    else if (currentInstrument == 'guitar') {
      if (event.pan > 0.3) {
        console.log('');
      }
    }
  } else {
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

/** Event handler */
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

/** Sets up event handler and shows a topHat
 * from the Media app to indicate who is the current
 * face tracked.
 */
function startHeadTracking() {
  gapi.hangout.av.effects.onFaceTrackingDataChanged.
      add(onFaceTrackingChanged);
  console.log('Started head tracking');    
}


function showDrums() {
  currentInstrument = 'drum';
  console.log("showing drums");
  hideAllOverlays();
  for (var i=0; i<drumsNormal.length; i++) {
    drumsNormal[i].setVisible(true);
  }
}

function showGuitar() {
  currentInstrument = "guitar";
  hideAllOverlays();
}

function playDrum(i) {
  console.log("hitting drum");
  drumsActive[i].setVisible(true);
  drumsNormal[i].setVisible(false);
  setTimeout(function(){
    drumsNormal[i].setVisible(true);
    drumsActive[i].setVisible(false);
    },250);
}

function playGuitar(i){
  console.log("play guitar is not defined");
}

function showNothing() {
  currentInstrument = "";
  hideAllOverlays();
}

/** For removing every overlay */
function hideAllOverlays() {
  for (var i=0; i<drumsNormal.length; i++) {
    drumsNormal[i].setVisible(false);
    drumsActive[i].setVisible(false);
  }
}

//doesn't seem to work!
function createGuitar(){
  var canvas = document.createElement('canvas');
  canvas.setAttribute('width', 10);
  canvas.setAttribute('height', 400);
  var context = canvas.getContext('2d');
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(5,5);
  context.lineTo(5,300);
  context.stroke();
  return canvas.toDataURL();

}

/** Initialize our constants, build the overlays */
function createOverlays() {
  console.log("CREATING OVERLAYS");
  var scale = .1;
  x_pos = [0, -0.45, 0, .44];
  y_pos = [-.4, 0, 0.4, 0];
  //instrument = "drums";
  for (var i = 0; i < 4; i++){
    var drumURL = root + "images/DrumSH.png?num=" + i.toString();
    console.log(drumURL);
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
      'scale': {'magnitude': scale * 1.2, 
                'reference': gapi.hangout.av.effects.ScaleReference.WIDTH},
      'position': {'x': x_pos[i], 'y': y_pos[i] }
      });

    drumsActive.push(drumActiveOverlay);
  }
}

createOverlays();

function init() {
  gapi.hangout.onApiReady.add(function(eventObj) {
    if (eventObj.isApiReady) {
      // gapi.hangout.data.onStateChanged.add(onStateChanged);
      startHeadTracking();
      animate();
    }
  });
}

// Sound stuff

var stringURLs = [ 'http://www.learner.org/jnorth/sounds/ChordPiano.wav', 'http://amath.colorado.edu/pub/matlab/music/wav/violin_A4.wav', 
    'http://amath.colorado.edu/pub/matlab/music/wav/viola.wav', 'http://amath.colorado.edu/pub/matlab/music/wav/flute_A5.wav'];


function stringSound(i) {
    var stringSound = gapi.hangout.av.effects.createAudioResource(
        stringURLs[i]).createSound();
    stringSound.play({loop: false, volume:200});
}

var guitarURLs = ['http://soundcavern.free.fr/guitar/Acoustic_Guitar_Chords%20-%20Bmaj.wav', 'http://soundcavern.free.fr/guitar/AcGuit_Minor_Chords%20-%20Eminup.wav',
    'http://www.colorado.edu/physics/phys4830/phys4830_fa01/lab/guitar2.wav', 'http://soundcavern.free.fr/guitar/AcGuit_Minor_Chords%20-%20Dmin.wav'];
    
function guitarSound(i) {
    var guitarSound = gapi.hangout.av.effects.createAudioResource(
           guitarURLs[i]).createSound();
     guitarSound.play({loop: false, volume:200});
}

var drumURLs = ['http://students.cs.byu.edu/~cbeacham/Virtual%20Zoo/symbol.wav', 'http://home.foni.net/~musiksamples/techno/drums/bddruck.wav', 
    'http://muselogic.webmage.com/sounds/drums/akayamaha.wav', 'http://bigsamples.free.fr/d_kit/bdkick/909kik.wav'];

function drumSound(i) {   
    var drumSound = gapi.hangout.av.effects.createAudioResource(
        drumURLs[i]).createSound();
    drumSound.play({loop: false, volume:200});
    setTimeout(function(){return;}, 1000);
}


gadgets.util.registerOnLoadHandler(init);
