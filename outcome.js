let frame = 0;
let index = 0;
let spirit;

function draw() {
    if (scan) {
        // draw the video
        // imageMode(CENTER);

        //move image by the width of image to the left
        // translate(capture.width, 0);
        //then scale it by -1 in the x-axis
        //to flip the image
        // scale(-1, 1);
        image(capture, w/2, (h-120)/2, 350, 350);

        // draw the label
        drawCard();
        drawBottomBar();
        drawCode();

        drawGrid();
    }   
    else if (play) {
        // draw the video in full screen size
        imageMode(CORNER);

        image(capture, 0, 0, w, h);

        frameRate(6);
        let x, y, height, width;
        if (behavior.length > index) {
            noStroke();
            x = behavior[index].info.x;
            y = behavior[index].info.y;
            height = behavior[index].info.height;
            width = behavior[index].info.width;
        }

        image(snapshots[0], x, y, width, height);
        index += 1;

        // for (let i = 0; i < snapshots.length; i++) {
        //     for (let j = 0; j < behavior.length; j++) {
        //         if (behavior[j].info.x) {
        //         noStroke();
        //         let x = behavior[j].info.x;
        //         let y = behavior[j].info.y;
        //         let height = behavior[j].info.height;
        //         let width = behavior[j].info.width;
        //         image(snapshots[i], x, y, width, height); // make them repeat 
        //         // j = (index + 1) % snapshots.length; 
                
        //         }
        //     }
        // }
    }
    // take snap
    // if(document.getElementById('snap').clicked == true) {
    //     takesnap();
    // }
    showButtons();
    
}
  
function switchMode() {
    play = true;
    scan = false;
    modelURL = 'https://teachablemachine.withgoogle.com/models/VOgRsStGF/'; // rock scissors paper

    // create an animation
    // sprit = loadAnimation
}

function drawCard() {
    if (label == "waiting...") {
        textSize(32);
        textAlign(CENTER, CENTER);
        noStroke();
        fill(0);
        textFont('Work Sans');
        text(label, w/2, 30);
    } 

    imageMode(CENTER);
    let card = "";
    let cardW = 0;
    let cardH = 0;
    if (label == "Resource") {
        card = Resource;
        cardW = 340;
        cardH = 250;
        cardName = "Sprite";
    } else if (label == "Trigger_Run") {
        card = Trigger_Run;
        cardW = 300;
        cardH = 250;
        cardName = "Event";
    } else if (label == "Trigger_Scissors") {
        card = Trigger_Scissors;
        cardW = 300;
        cardH = 250;
        cardName = "Event";
    } else if (label == "Behavior" && detected == 2) {
        card = Behavior;
        cardW = 360;
        cardH = 200;
        cardName = "Action";
    }

    // Draw the card
    if (card) {
        image(card, w/2, (h-120)/2, cardW, cardH);
        
        // Draw the card name
        textSize(32);
        textAlign(CENTER, CENTER);
        noStroke();
        fill(0);
        textFont('Work Sans');
        text(cardName, w/2, 30);
    }
}

function drawBottomBar() {
    noStroke();
    fill("#fff");
    rect(0, h-120, w, 120);
}

function getTxt(value, index) {
    // draw coding cards that are scanned
    txt = txt + value + "  +  ";  // show the code on the bottom bar
}

function drawCode() {
    let item = '';
    let itemX = 80;
    let itemW = 0;
    let itemGap = 0;
    let drawing;

    for (let i = 0; i < code.length; i++) {
        item = code[i];

        if (item == "Resource") {
            item = Resource;
            itemW = 145;
            itemGap = itemW - 20;
            drawing = snapshots[i]; // need to be updated later
            image(drawing, itemX+10, h-60, 75, 75);
        } else if (item == "Trigger_Run") {
            item = Trigger_Run;
            itemW = 120;
            itemGap = itemW + 15;
        } else if (item == "Trigger_Scissors") {
            item = Trigger_Scissors;
            itemW = 175;
            itemGap = itemW + 15;
        } else if (item == "Behavior") {
            item = Behavior;
            itemW = 175;
            itemGap = itemW - 12;
        }

        image(item, itemX, h-60, itemW, 100);
        itemX = itemX + itemGap;
    }
}

function addCard() {
    if (label != "None" && label != "Undefined" && label != "waiting...") {
        code.push(label);

        if (label == "Resource") {
            // when the capture button is pressed, save the image data within the boundary
            takeSnap();
        }

        if (label == "Behavior") {
            let info = {x: imageX, y: imageY, width: imageWidth, height: imageHeight};
            behavior.push({info: info});
        }
    }
}

function takeSnap() {
    snapshots.push(get((w/2)-70, (h-120)/2-100, 190, 190)); // grabbing pixel from the image itself
}

function drawAnimation() {
    for (let i = 0; i < snapshots.length; i++) {
        let w1 = 80;
        let h1 = 60;
        let x1 = 0;
        let y1 = 0;
        image(snapshots[i], 0, 0);
    }
}


function showButtons() {
    if (scan) {
        document.getElementById("playBtn").style.display = "block";
        document.getElementById("addBtn").style.display = "block";
        document.getElementById("tutorialBtn").style.display = "block";
        // document.getElementById("CardBtn").style.display = "block";
        // document.getElementById("SparkBtn").style.display = "block";
    } else if (play) {
        document.getElementById("playBtn").style.display = "none";
        document.getElementById("addBtn").style.display = "none";
        document.getElementById("tutorialBtn").style.display = "none";
        // document.getElementById("CardBtn").style.display = "none";
        // document.getElementById("SparkBtn").style.display = "none";
    }
}

// NOTE: use download page in github for now, can update it as a individual page in the future 
function linkCards(){
    window.open('https://github.com/hyejinim/draw2code/blob/master/assets/cards/draw2code_coding_cards.pdf', '_blank');
}


// NOTE: use google doc's link for now, can update it as a individual page in the future 
function linkSparks(){
    window.open('https://docs.google.com/document/d/1bHBShg13TFhTErruXkIbynvSGfJyzOdNG26JPrGvIqY/edit?usp=sharing', '_blank');
}

