let frame = 0;
let index = 0;
let spirit;
let codeBarHeight = 80;
let cleanCode = false;

// authoring
let sprites = [];
let frames = [];
let sprite1;
let spritesNum = 0;
let eventsNum = 0;
let img;
let frameNum = 0;

let ww, wh, wx, wy; // white blob
let bw, bh, bx, by; // blue blob
let sx, sy, sw, sh; // new spirit
let rectColor;
let sprX, sprY, sprW, sprH;

function draw() {
  background(238, 238, 238);
  // background(0, 0, 0);

  if (scan) {
    if (!mobile || switchFlag) {  
      push();  // save the style settings
      translate(width, 0); // flip the video if it runs on desktop or uses the front camera on mobile
      scale(-1, 1);
    }
    // draw the video
    imageMode(CENTER);
    image(capture, windowW / 2, (windowH - codeBarHeight) / 2, w, h); // resize needed on mobile screen
    pop(); // restore the settings so the label is not flipped

    drawCodingBlock();
    
    if (trackingData) { //if there is tracking data to look at, then...
      for (var i = 0; i < trackingData.length; i++) { //loop through each of the detected colors    
  
        bx = trackingData[i].x + (windowW/2-190);
        by = trackingData[i].y + (windowH-codeBarHeight)/2-140;
        bw = trackingData[i].width;
        bh = trackingData[i].height;
  
        wx = windowW/2-ww/2 - 5;
        wy = (windowH-codeBarHeight)/2-wh/2 + 5;
        ww = 220;
        wh = 140;
  
        rectColor = "yellow";
        noFill();
        stroke(rectColor);
        imageMode(CORNER);
  
        push();  // save the style settings

        if (!mobile) {
        translate(width, 0); // flip the video for desktop
        scale(-1, 1);
        }

        rect(bx, by, bw, bh);
  
  
        // spirit's size and position
        stroke(0,0,0);
        imageMode(CORNER);
        sx = (bx-wx)*(windowW/ww);
        sy = (by-wy)*(windowH-codeBarHeight)/wh;
        sw = bw*(windowW/ww);
        sh = bh*(windowH/wh);
        sx = Math.round(sx);
        sy = Math.round(sy);
        sw = Math.round(sw);
        sh = Math.round(sh);
  
        pop();
  
        stroke(255, 255 ,255);
  
        noStroke();
        fill(0);
      }
    }
    drawBottomBar();
    drawCode();  
  } 
  else if (run) {

    push();

    if (!mobile) {  
      translate(width, 0); // flip the video for desktop
      scale(-1, 1);
    }

    imageMode(CENTER);
    image(capture, windowW / 2, (windowH - codeBarHeight) / 2, windowW, windowH); // draw the video in full screen size
    
    imageMode(CORNER);
    showAnimation();
    
    pop(); 
    
  }

  if (pause) {
    filter(GRAY); // if you hit the switchBtn, it should be not applied
  }
  if (codeFlag) {
    drawBottomBar();
    drawCode();  
  }
  
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
  } else if (label == "Banana") {
    card = Banana;
    cardW = 300;
    cardH = 250;
    cardName = "Banana";
  } else if (label == "Marker1") {
    card = Marker1;
    cardW = 300;
    cardH = 250;
    cardName = "Marker1";
  } else if (label == "Marker2") {
    card = Marker2;
    cardW = 300;
    cardH = 250;
    cardName = "Marker2";
  } else if (label == "Marker3") {
    card = Marker3;
    cardW = 300;
    cardH = 250;
    cardName = "Marker3";
  } else if (label == "Behavior") {
    card = Action;
    cardW = 340; 
    cardH = 250; 
    cardName = "Action";
    
    colors = new tracking.ColorTracker(['blue']); // start the tracking of the colors above on the camera in p5
    
    colors.on('track', function(event) {
      trackingData = event.data // break the trackingjs data into a global so we can access it with p5
      setTimeout(() => {
        trackingTask.stop();
      }, 5500);
    });
    const trackingTask = tracking.track('#myVideo', colors);

  }

  if (card) {
    tint(255, 200); // modify alpha value
    image(card, windowW / 2, (windowH - codeBarHeight) / 2, cardW, cardH);
    tint(255, 255);
      text(cardName, windowW / 2, 30);
  }
}

function drawBottomBar() {
  noStroke();
  fill("#fff");
  imageMode(CORNER);
  rect(0, windowH - codeBarHeight, windowW, codeBarHeight + 100);
}



function scanCard() {
  let code;
  let drawing;
  let frame;
  let sprite;
  let event;

  if (label != "None" && label != "Undefined" && label != "waiting...") {

    if (label == "Resource") {
      
      // save the image within the boundary
      drawing = takeSnap(windowW / 2 - 68, (windowH - codeBarHeight) / 2 - 90, 180, 180);

      spr = drawing;
      sprite = {
        drawing: drawing,
        events: [],
      };
      sprites.push(sprite);
      spritesNum = sprites.length - 1;
    } else if (label == "Trigger_Scissors" || label == "Trigger_Run") {
      event = {
        type: label,
        frames: [] 
      };
      sprites[spritesNum].events.push(event);
      eventsNum = sprites[spritesNum].events.length - 1;
    } else if (label == "Behavior") {
      drawing = takeSnap(windowW / 2 - 130, (windowH - codeBarHeight) / 2 - 70, 220, 130);

      console.log('sprite: ', sx, sy, sw, sh);
      // create Frame objects
      frame = new Frame(sx, sy, sw, sh); // x, y, width, height
      sprites[spritesNum].events[eventsNum].frames.push(frame);
    } else {
      drawing = '';
    }
    code = new Code(label, drawing);
    codes.push(code);
    console.log(sprites);
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

  imageMode(CENTER);
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

function showAnimation() {
  push();
  // if (mobile) {
  //   translate(width, 0); // flip the video for desktop
  //   scale(-1, 1);
  // }
  if (playFlag) {
    console.log("play animation");
    if (frameNum < sprites[spritesNum].events[eventsNum].frames.length) {
      // if (sprites[spritesNum].events[].type == "Trigger_Run")
      sprX = sprites[spritesNum].events[eventsNum].frames[frameNum].x;
      sprY = sprites[spritesNum].events[eventsNum].frames[frameNum].y;
      sprW = sprites[spritesNum].events[eventsNum].frames[frameNum].w;
      sprH = sprites[spritesNum].events[eventsNum].frames[frameNum].w;
      
      image(spr, sprX, sprY, sprW, sprH);
      if (frameCount % 10 == 0) { // update every # frames
        sprX = sprites[spritesNum].events[eventsNum].frames[frameNum].x;
        sprY = sprites[spritesNum].events[eventsNum].frames[frameNum].y;
        sprW = sprites[spritesNum].events[eventsNum].frames[frameNum].w;
        sprH = sprites[spritesNum].events[eventsNum].frames[frameNum].w;
        frameNum = frameNum + 1;
      }
    }  
    if (frameNum == sprites[spritesNum].events[eventsNum].frames.length) {
      playFlag = !playFlag;
    }
  } 
  
  if (label == "Rock") {
    text("Rock", windowW / 2, 30);
  } else if (label == "Scissors") {
    text("Scissors", windowW / 2, 30);
  } else if (label == "Paper") {
    text("Paper", windowW / 2, 30);
  } else if (label == "None") {
    text("None", windowW / 2, 30);
  } 
  pop();
}