// video
let capture;
let w = 380;
let h = 280;
let windowW = window.innerWidth;
let windowH = window.innerHeight;

// to store the classification
let label = 'waiting...';

// status
let run = false;
let scan = true;
let pause = false;
let switchFlag = false;
let modeRun = false;
let mobile;
let playFlag = false;
let codeFlag = false;

// code arrays
let codes = [];
let spirits = [];
let actions = [];

// card images
let Resource;
let Trigger_Run;
let Trigger_Scissors;
let Behavior;

// buttons
let switchBtn;
let scanBtn;
let runBtn;
let playBtn;
let codeBtn;

// classifier
let classifier;
let modelURL = 'https://teachablemachine.withgoogle.com/models/0tuGHNcv5/';

// color tracking
let colors;
let trackingData;

// switch camera
let options = {
  video: {
    facingMode: {
      exact: "user"
    }
  }
};

// test
let myImage;

// load the model and images
function preload() {
  classifier = ml5.imageClassifier(modelURL + 'model.json');

  Spirit = loadImage('assets/cards/Spirit.png');
  Event_Run = loadImage('assets/cards/Event_Run.png');
  Event_Scissors = loadImage('assets/cards/Event_Scissors.png');
  Action = loadImage('assets/cards/Action.png')
}

function setup() {
  pixelDensity(1);

  // detect device
  mobile = isMobileDevice();
  console.log('this is mobile device: ' + mobile);

  if (scan) {
    // create canvas
    capture = createCapture({
      audio: false,
      video: {
        width: windowW,
        height: windowH
      }
    }, function() {
      console.log('capture ready.')
    });

    if (mobile) {
      capture = {
        video: {
          facingMode: {
            exact: "environment"
          },
          width: windowW,
          height: windowH
        }
      };
      capture = createCapture(capture);
    }


    capture.elt.setAttribute('playsinline', '');
    // capture.hide();
    capture.size(w, h);
    capture.parent('container');
    cnv = createCanvas(windowW, windowH + 100);
    cnv.parent('container');
    capture.position(0, 0);
    capture.style('opacity', 0); // hide capture
    capture.id('myVideo');

    // classify coding blocks
    classifyCapture();

    // detect markers on the action block
    // detectMarkers();

    // add buttons
    if (mobile) {
      switchBtn = createButton('Switch Camera');
      switchBtn.id('switchBtn');
      switchBtn.position(19, 19);
      switchBtn.mousePressed(switchCamera);
    }

    pauseBtn = createButton('Pause');
    pauseBtn.id('pauseBtn');
    pauseBtn.position(19, 49);
    pauseBtn.mousePressed(pauseCapture);

    scanBtn = createButton('Scan');
    scanBtn.id('scanBtn');
    scanBtn.position(windowW - 100, (windowH - codeBarHeight) / 2 - 40);
    scanBtn.mousePressed(scanCard);


    runBtn = createButton('Run');
    runBtn.id('runBtn'); 
    runBtn.position(19, 79);
    runBtn.mousePressed(switchMode);

    //     tutorialBtn = createButton('Tutorial');
    //     tutorialBtn.id('tutorialBtn');
    //     tutorialBtn.position(10, 10);
    //     tutorialBtn.mousePressed(openTutorial);

    tracking.ColorTracker.registerColor('white', function(r, g, b) {
      if (r > 180 && g > 180 && b > 180) {
        return true;
      }
      return false;
    });
  
    tracking.ColorTracker.registerColor('blue', function(r, g, b) {
      if (r < 50 && g < 85 && b > 100) {
        return true;
      }
      return false;
    });
  } 
}

function switchCamera() {
  console.log('switchBtn clicked ' + switchFlag);
  switchFlag = !switchFlag;

  stopCapture();
  if (switchFlag) {
    capture.remove();
    options = {
      video: {
        facingMode: {
          exact: "user"
        },
        width: windowW,
        height: windowH
      }
    };
  } else {
    capture.remove();
    options = {
      video: {
        facingMode: {
          exact: "environment"
        },
        width: windowW,
        height: windowH
      }
    };
  }
  capture = createCapture(options);

  capture.elt.setAttribute('playsinline', '');
  // capture.hide();
  capture.size(w, h);
  capture.parent('container');
  cnv = createCanvas(windowW, windowH + 100);
  cnv.parent('container');
  
  capture.position(0, 0);
  capture.style('opacity', 0); // hide capture
  capture.id('myVideo');

  // classify coding blocks
  classifyCapture();
}

function stopCapture() {
  if (this instanceof p5.MediaElement) {
    let stream = this.elt.srcObject;
    let tracks = stream.getTracks();

    tracks.forEach(function(track) {
      track.stop();
    });

    this.elt.srcObject = null;
  }
}

function isMobileDevice() {
  return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

function pauseCapture() {
  pause = !pause;
  if (pause) {
    capture.pause();
  } else {
    capture.play();
  }
}

function classifyCapture() {
  classifier.classify(capture, gotResults);
}

// get the classification
function gotResults(error, results) {
  // Something went wrong!
  if (error) {
    console.error(error);
    return;
  }
  // Store the label and classify again!
  label = results[0].label;
  classifyCapture();
}

function switchMode() {
  modeRun = !modeRun;
  if (modeRun) {
    run = true;
    scan = false;
    modelURL = 'https://teachablemachine.withgoogle.com/models/VOgRsStGF/'; // rock scissors paper
    classifier = ml5.imageClassifier(modelURL + 'model.json');
    // classify coding blocks
    classifyCapture();
    document.getElementById('runBtn').remove();
    document.getElementById('pauseBtn').remove();
    document.getElementById('scanBtn').remove();
    
    playBtn = createButton('Play');
    playBtn.id('playBtn');
    playBtn.position(19, 49);
    playBtn.mousePressed(play);

    codeBtn = createButton('Code');
    codeBtn.id('codeBtn');
    codeBtn.position(19, 79);
    codeBtn.mousePressed(showCode);

  } else {
    scan = true;
    run = false;
    modelURL = 'https://teachablemachine.withgoogle.com/models/0tuGHNcv5/'; // coding block
    classifier = ml5.imageClassifier(modelURL + 'model.json');
    // classify coding blocks
    classifyCapture();    
  }
}

// objects
function Code(codingBlockName, drawing) {
    this.codingBlockName = codingBlockName;
    this.drawing = drawing;
}

function Frame(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.scale = scale;
  this.w = w;
  this.h = h;
}

function play() {
  playFlag = !playFlag;
}

function showCode() {
  codeFlag = !codeFlag;
}