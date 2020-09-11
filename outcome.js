let frame = 0;
let index = 0;
let spirit;
let codeBarHeight = 120;
let cleanCode = false;

// authoring
let sprites = [];
let frames = [];
let sprite1;
let img;
let frameNum = 0;

function draw() {
  background(238, 238, 238);

  // draw the video
  imageMode(CENTER);

  push(); // save the style settings

  // flip the video if it runs on desktop or uses the front camera on mobile
  if (!mobile || switchFlag) {
    translate(width, 0);
    scale(-1, 1);
  }

  if (scan) {
    image(capture, windowW / 2, (windowH - codeBarHeight) / 2, w, h); // resize needed on mobile screen
    drawBottomBar();
  } 
  else if (run) {
    // draw the video in full screen size
    image(capture, windowW / 2, (windowH - codeBarHeight) / 2, windowW, windowH);
    
    if (cleanCode) {
      drawSprites();
      if (frameNum < frames.length) {
        if (frameCount % 20 == 0) { // update every 20 frames
          spr.position.x = frames[frameNum].x;
          spr.position.y = frames[frameNum].y;
          spr.scale = frames[frameNum].scale;
          frameNum++;
        }
      }
    }
  }

  pop(); // restore the settings so the label is not flipped

  if (pause) {
    filter(GRAY); // if you hit the switchBtn, it should be not applied
  }
  drawCodingBlock();
  drawCode();
  // detectActionCard();
}

// draw the classification and image of coding block
function drawCodingBlock() {
  let card = "";
  let cardW = 0;
  let cardH = 0;

  imageMode(CENTER);
  textSize(22);
  textAlign(CENTER, CENTER);
  noStroke();
  fill(0);
  textFont('Work Sans');

  if (label == "waiting...") {
    text(label, windowW / 2, 30);
  } else if (label == "None") {
    text("Scan your code", windowW / 2, 30);
  } else if (label == "Resource") {
    card = Spirit;
    cardW = 340;
    cardH = 250;
    cardName = "Sprite";
  } else if (label == "Trigger_Run") {
    card = Event_Run;
    cardW = 300;
    cardH = 250;
    cardName = "Run";
  } else if (label == "Trigger_Scissors") {
    card = Event_Scissors;
    cardW = 300;
    cardH = 250;
    cardName = "Scissors";
  } else if (label == "Behavior") {
    card = Action;
    cardW = 360;
    cardH = 200;
    cardName = "Action";
  }

  if (card) {
    tint(255, 200); // modify alpha value
    image(card, windowW / 2, (windowH - codeBarHeight) / 2, cardW, cardH);
    tint(255, 255);
    text(cardName, windowW / 2, 15);
  }
}

function drawBottomBar() {
  noStroke();
  fill("#fff");
  rect(0, windowH - codeBarHeight, windowW, codeBarHeight + 100);
}



function scanCard() {
  let code;
  let drawing;
  let frame;

  if (label != "None" && label != "Undefined" && label != "waiting...") {

    if (label == "Resource") {
      // save the image within the boundary
      drawing = takeSnap(windowW / 2 - 68, (windowH - codeBarHeight) / 2 - 90, 180, 180);
      console.log(drawing);
    } else if (label == "Behavior") {
      drawing = takeSnap(windowW / 2 - 130, (windowH - codeBarHeight) / 2 - 70, 220, 130);
      // create Frame objects
      frame = new Frame(200, 200, 0.3); // x, y, scale
      frames.push(frame);
    } else {
      drawing = '';
    }
    code = new Code(label, drawing);
    codes.push(code);
    console.log(code);
  }
}

function takeSnap(x, y, w, h) {
  return get(x, y, w, h); // grab pixel from the image itself
}

function drawCode() {
  let item = '';
  let itemX = 50;
  let itemY = windowH - codeBarHeight + 35;
  let itemW = 0;
  let itemGap = 0;
  let doodle = '';

  for (let i = 0; i < codes.length; i++) {
    item = codes[i].codingBlockName;
    doodle = codes[i].drawing;

    if (item == "Resource") {
      item = Spirit;
      itemW = 90;
      itemGap = itemW - 13;
      image(doodle, itemX + 6, itemY, 52, 52);
    } else if (item == "Trigger_Run") {
      item = Event_Run;
      itemW = 75;
      itemGap = itemW + 15;
    } else if (item == "Trigger_Scissors") {
      item = Event_Scissors;
      itemW = 75;
      itemGap = itemW + 15;
    } else if (item == "Behavior") {
      item = Action;
      itemW = 120;
      itemGap = itemW - 8;
      image(doodle, itemX - 5, itemY - 2, 80, 42);
    }

    image(item, itemX, itemY, itemW, 65);
    if (itemX > windowW - 50) {
      itemX = 50;
      itemY = itemY + 75;
    }
    itemX = itemX + itemGap;
  }
}

