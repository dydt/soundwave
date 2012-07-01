// Track our overlays for re-use later
var overlays = [];
var drumsNormal = []
var drumsActive = []

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
  console.log("showing drums");
  hideAllOverlays();
  for (var i=0; i<drumsNormal.length; i++) {
    overlays[drumsNormal[i]].setVisible(true);
  }
}

function hitDrum(index){
  console.log("hitting drum");
  overlays[drumsActive[i]].setVisible(true);
  overlays[drumsNormal[i]].setVisible(false);
  setTimeout(function(){
    overlays[drumsNormal[i]].setVisible(true);
    overlays[drumsActive[i]].setVisible(false);
    },500);
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
  var root = 'http:hangoutmediastarte.appsport.com/static/';
  var instrument = 'drum';
  var scale = 0.1;
  x_pos = [0, -0.45, 0, 0.45];
  y_pos = [-0.1, 0.1, 0.2, 0.1];
  for (var i = 0; i < 4; i++){
    var drumURL = root + instrument + i.toString();
    var drumActiveURL = root + instrument + "active" + i.toString();
    var drumImage = gapi.hangout.av.effects.createImageResource(drumURL);
    var drumImage = gapi.hangout.av.effects.createImageResource(drumActiveURL);
    var drumOverlay = drumImage.createOverlay(
      {
      'scale': {'magnitude': scale, 
                'reference': gapi.hangout.av.effects.ScaleReference.WIDTH},
      'position': {'x': x_pos[i], 'y': y_pos[i] }
      });
    var drumActiveOverlay = drumImage.createOverlay(
      {
      'scale': {'magnitude': scale, 
                'reference': gapi.hangout.av.effects.ScaleReference.WIDTH},
      'position': {'x': x_pos[i], 'y': y_pos[i] }
      });
    drumsNormal.append(drumOverlay);
    drumsActive.append(drumActiveOverlay);
  }
}
/*
      'http://hangoutmediastarter.appspot.com/static/topHat.png');
  var topHat2 = gapi.hangout.av.effects.createImageResource(
      'http://hangoutmediastarter.appspot.com/static/mustache.png');
  overlays['topHat'] = topHat.createOverlay(
      overlays['topHat2'] = topHat2.createOverlay(
      {
      'scale': {'magnitude': 0.1, 
                'reference': gapi.hangout.av.effects.ScaleReference.WIDTH},
      'position': {'x': -0.45, 'y': .1 }
      });
*/
}

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
      gapi.hangout.data.onStateChanged.add(onStateChanged);
    }
  });
}

gadgets.util.registerOnLoadHandler(init);
