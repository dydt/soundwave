var root = "http://web.mit.edu/tfleish/www/soundwave/";

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
        sayPiano1();
        timeoutCounter = 0;
      }
      else if (event.tilt < -0.1) {
        console.log('Down');
        playDrum(2);
        sayPiano1();
        timeoutCounter = 0;
      }
      else if (event.pan > 0.25) {
        console.log('Left');
        playDrum(3);
        sayPiano1();
        timeoutCounter = 0;
      }
      else if (event.pan < -0.25) {
        console.log('Right');
        playDrum(1);
        sayPiano1();
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
  gapi.hangout.av.effects.onFaceTrackingDataChanged.
      add(onFaceTrackingChanged);
  console.log('Started head tracking');    
}





/** Responds to buttons
 * @param {string} name Item to show.
 */
function showOverlay(name) {
  console.log("showing overlay");
  console.log(name);
  hideAllOverlays();
  currentItem = name;
  overlays[currentItem].setVisible(true);
}

function showDrums() {
  currentInstrument = 'drum';
  console.log("showing drums");
  //hideAllOverlays();
  for (var i=0; i<drumsNormal.length; i++) {
    drumsNormal[i].setVisible(true);
    console.log(drumsNormal[i].getImageResource().getUrl());
  }
  //hitDrum(3);
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

// Sound stuff

var piano1SoundURL =
    'http://www.learner.org/jnorth/sounds/ChordPiano.wav';


var piano1Sound = gapi.hangout.av.effects.createAudioResource(
    piano1SoundURL).createSound();


function sayPiano1() {
  // There can only be one active resource, Audio or Image.                                                       
  // By playing the sound, we activate this resource                                                              
  // and will automatically hide all the other overlays.                                                          
  // Thus, we hide the scaling controls.                                                                          
//  setControlVisibility(false);                                                                                  
    piano1Sound.play({loop: false, volume:20});
}



gadgets.util.registerOnLoadHandler(init);
