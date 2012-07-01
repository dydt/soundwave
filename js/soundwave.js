var root = "http://web.mit.edu/tfleish/www/soundwave/";

// Track our overlays for re-use later
var overlays = [];
var drumsNormal = [];
var drumsActive = [];

var lastGoodEvent;
var lastEvent;
var currentInstrument = "";

function getNote(event, bright) {
  if (event.tilt > 0.2) {
    console.log('Up');
    hitDrum(0);
  }
  else if (event.tilt < -0.2) {
    console.log('Down');
    hitDrum(2);
  }
  else if (event.pan > 0.2) {
    console.log('Left');
    hitDrum(3);
  }
  else if (event.pan < -0.2) {
    console.log('Right');
    hitDrum(1);
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
    window.setTimeout(callback, 1000 / 30);
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
  // Create hat overlay.
  var topHat = gapi.hangout.av.effects.createImageResource(
      'http://hangoutmediastarter.appspot.com/static/topHat.png');
  var overlay = topHat.createFaceTrackingOverlay(
      {'trackingFeature':
       gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
       'scaleWithFace': true,
       'rotateWithFace': true,
       'scale': 1.0});
  overlay.setVisible(true);

  // Add event handler.
  gapi.hangout.av.effects.onFaceTrackingDataChanged.
      add(onFaceTrackingChanged);

  console.log('Started head tracking');    
}


function showDrums() {
  currentInstrument = "drum"; 
  console.log("showing drums");
  //hideAllOverlays();
  for (var i=0; i<drumsNormal.length; i++) {
    drumsNormal[i].setVisible(true);
    console.log(drumsNormal[i].getImageResource().getUrl());
  }
  //hitDrum(3);
}

function showGuitar() {
  currentInstrument = "guitar";
}

function playDrum(i){
  console.log("hitting drum");
  drumsActive[i].setVisible(true);
  drumsNormal[i].setVisible(false);
  setTimeout(function(){
    drumsNormal[i].setVisible(true);
    drumsActive[i].setVisible(false);
    },250);
}

function playGuitar(i){

}

function showNothing() {
  currentTime = null;
  hideAllOverlays();
  setControlVisibility(false);
}

/** For removing every overlay */
function hideAllOverlays() {
  for (var index in overlays) {
    overlays[index].setVisible(false);
  }
}

/** Initialize our constants, build the overlays */
function createOverlays() {
  console.log("CREATING OVERLAYS");
  var instrument = 'drums';
  var scale = 0.1;
  x_pos = [0, -0.45, 0, .44];
  y_pos = [-.4, 0, 0.4, 0];
  for (var i = 0; i < 4; i++){
    //var drumURL = root + "images/" + instrument + i.toString() + ".png";
    var drumURL = 'http://www.veryicon.com/icon/png/Media/Multimedia%202/Drum%20SH.png?num=' + i.toString();
    var drumImage = gapi.hangout.av.effects.createImageResource(drumURL);
    var drumOverlay = drumImage.createOverlay(
      {
      'scale': {'magnitude': scale, 
                'reference': gapi.hangout.av.effects.ScaleReference.WIDTH},
      'position': {'x': x_pos[i], 'y': y_pos[i] }
      });
    drumsNormal.push(drumOverlay);


    //var drumActiveURL = root + "images/" + instrument + "active" + i.toString() + ".png";
    //var drumActiveURL = 'http://hangoutmediastarter.appspot.com/static/mustache.png';
    var drumActiveURL = 'http://www.veryicon.com/icon/png/Media/Multimedia%202/Drum%20SH.png?num=1' + i.toString();
    var drumActiveImage = gapi.hangout.av.effects.createImageResource(drumActiveURL);
    var drumActiveOverlay = drumActiveImage.createOverlay(
      {
      'scale': {'magnitude': scale * 1.1, 
                'reference': gapi.hangout.av.effects.ScaleReference.WIDTH},
      'position': {'x': x_pos[i], 'y': y_pos[i] }
      });

    drumsActive.push(drumActiveOverlay);
    console.log(drumsActive.length);
  }

  var topHat = gapi.hangout.av.effects.createImageResource(
      'http://hangoutmediastarter.appspot.com/static/mustache.png');
  console.log("tophat");
  console.log(topHat);
  overlays['topHat'] = topHat.createOverlay(
      {
      'scale': {'magnitude': 0.1, 
                'reference': gapi.hangout.av.effects.ScaleReference.WIDTH},
      'position': {'x': 0, 'y': 0 }
      });


  console.log(overlays['topHat']);
}
/*
      'http://hangoutmediastarter.appspot.com/static/topHat.png');
 */


createOverlays();

// SOUND

var gooddaySoundURL =
    'http://hangoutmediastarter.appspot.com/static/goodday.wav';

var gooddaySound = gapi.hangout.av.effects.createAudioResource(
    gooddaySoundURL).createSound();

function sayGoodDay() {
  // There can only be one active resource, Audio or Image.
  // By playing the sound, we activate this resource
  // and will automatically hide all the other overlays.
  // Thus, we hide the scaling controls.
  setControlVisibility(false);
  gooddaySound.play({loop: false});
}

function emitGoodDayEvent() {
  // Make an arbitrary change to the shared state.
  // This will set off an event change, which in turn
  // will make a noise.  If two people are mashing the button
  // at the same time, you might miss a soundplay....and that
  // would be OK in that situation.
  var countStr = gapi.hangout.data.getState()['count'];

  if (countStr == null) {
    count = 0;
  }
  else {
    count = parseInt(countStr) + 1;
  }

  gapi.hangout.data.submitDelta({'count': '' + count});
}

function onStateChanged(event) {
  try {
    console.log('State changed...');
    // If the shared state changes with an addition
    // or modification, make a noise.
    if (event.addedKeys.length > 0) {
      console.log('I say good day to you!');
      sayGoodDay();
    }
  } catch (e) {
    console.log('Fail state changed');
    console.log(e);
  }
}

function init() {
  gapi.hangout.onApiReady.add(function(eventObj) {
    if (eventObj.isApiReady) {
      // gapi.hangout.data.onStateChanged.add(onStateChanged);
      startHeadTracking();
      animate();
    }
  });
}

gadgets.util.registerOnLoadHandler(init);
