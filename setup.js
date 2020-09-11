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

// classifier
let classifier;
let modelURL = 'https://teachablemachine.withgoogle.com/models/0tuGHNcv5/';

// switch camera
let options = {
  video: {
    facingMode: {
      exact: "user"
    }
  }
};

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
        width: w,
        height: h
      }
    };
  } else {
    capture.remove();
    options = {
      video: {
        facingMode: {
          exact: "environment"
        },
        width: w,
        height: h
      }
    };
  }
  capture = createCapture(options);

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
  // let roi = get((windowW/2)-250/2, (windowH-codeBarHeight)/2-250/2, 250, 250);
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
  } else {
    scan = true;
    run = false;    
  }
}

// objects
function Code(codingBlockName, drawing) {
    this.codingBlockName = codingBlockName;
    this.drawing = drawing;
}

function Frame(x, y, scale) {
  this.x = x;
  this.y = y;
  this.scale = scale;
}