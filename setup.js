// detect HTTP or HTTPS then force HTTPS
// if (location.protocol != 'https:') {
//     location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
// }

// if (window.matchMedia("(orientation: portrait)").matches) {
//     // you're in PORTRAIT mode
//  }
 
//  if (window.matchMedia("(orientation: landscape)").matches) {
//     // you're in LANDSCAPE mode
// }


// the video 
// ** ISSUE: if user resize the screen, the size of components won't change
let capture;
let w = window.innerWidth;
    h = window.innerHeight;

// display the label
let label = 'waiting...';
let button;

let play = false;
let scan = true;

// display the code scanned
let code = [];
let txt = '';
let behavior = [];
let snapshots = [];
let targets = [];

// card images
let Resource;
let Trigger_Run;
let Trigger_Scissors;
let duck;

function setup(){
    // setup() waits until preload() is done

    // Load the image
    // Resource = loadImage('assets/cards/Resource.png');
    // Trigger_Run = loadImage('assets/cards/Trigger_Play.png');
    // Trigger_Scissors = loadImage('assets/cards/Trigger_Scissors.png');
    // Behavior = loadImage('assets/cards/Action.png')
    // duck = loadImage('assets/images/duck.png'); 

    // create canvas
    pixelDensity(1); // this makes the internal p5 canvas smaller
    if (scan) {
        capture = createCapture({
            audio: false,
            video: {
                width: 350,
                height: 350
            }
        }, function() {
            console.log('capture ready.')
        });

        // capture = capture.get(w/2, (h-120)/2, 350, 350);        
        capture.elt.setAttribute('playsinline', '');
        createCanvas(w, h);
        capture.size(350, 350);
        capture.parent('container');
        cnv = createCanvas(w, h);
        cnv.parent('container');
        capture.position(w/2, (h-120)/2);
        capture.style('opacity',0); // use this to hide the capture later on (change to 0 to hide)...
        // capture.hide(); // tracking.js can't track the video when it's hidden
        // drawBottomBar();
    }

        
    // } else if (play) {
    //     capture = createCapture({
    //         audio: false,
    //         video: {
    //             width: w,
    //             height: h
    //         }
    //     }, function() {
    //         console.log('capture ready.')
    //     });
        
    //     capture.elt.setAttribute('playsinline', '');
    //     createCanvas(w, h);
    //     capture.size(w, h);
    //     capture.parent('container');
    //     cnv = createCanvas(w, h);
    //     cnv.parent('container');
    //     capture.position(w, h);
    //     capture.style('opacity',0)// use this to hide the capture later on (change to 0 to hide)...
    //     // capture.hide(); // tracking.js can't track the video when it's hidden 

        
    // }

    // detect the grid card and the drawn
    detectGrid();
    // start classifying for other coding cards
    classifyCapture();

    //   button = createButton('Show Outcome');
    //   button.position(600, 65);
    //   button.mousePressed(showImage);
    // button = createButton('snap');
    // button.mousePressed(takesnap);

    buttonAdd = createButton('Confirm');
    buttonAdd.id('addBtn'); // haven't changed the id name to confirmBtn
    buttonAdd.position(w-115, (h-120)/2-55);
    buttonAdd.mousePressed(addCard);
    
    
    buttonPlay = createButton('Run');
    buttonPlay.id('playBtn'); // haven't changed the id name to runBtn
    buttonPlay.position(w-115, 10);
    buttonPlay.mousePressed(switchMode);

    buttonPlay = createButton('Tutorial');
    buttonPlay.id('tutorialBtn');
    buttonPlay.position(10, 10);
    // buttonPlay.mousePressed(step5);
    buttonPlay.mousePressed(openTutorial);

    // working versions
    buttonRES = createButton('Card');
    buttonRES.id('CardBtn');	    
    buttonRES.position(10, 70);
    buttonRES.mousePressed(linkCards);

    buttonRES = createButton('Sparks');
    buttonRES.id('SparkBtn');
    buttonRES.position(10, 130);
    buttonRES.mousePressed(linkSparks);

    // buttonStop = createButton('Stop');
    // buttonStop.position(10, 145);
    // buttonStop.mousePressed(stop);

    // duck = loadImage('assets/images/duck.png');

    
    // target = loadImage('assets/cards/Resource.png');
}

function stop() {
    play = false;
}



// function createTarget() {
//     // create an object and save it to an array
//     let t = new Target(imageX, imageY, snapshots[snapshots.length-1]); // the last item in the takesnaps array
//     targets.push(t);
//     console.log('saved' + targets);
// }