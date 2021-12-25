class Animation {
  constructor(x, y, sheet, spriteIndex) {
    this.x = x;
    this.y = y;
    this.spriteIndex = spriteIndex;
    this.index = 0;
    this.sheet = sheet;
  }

  render(x, y, canvas) {
    if (this.index >= this.spriteIndex.length) {
      this.index = 0;
    }
    const spriteIndex = this.spriteIndex;
    const index = this.index;
    const sprite = spriteIndex[index];

    // context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);.
    const context = canvas.getContext("2d");
    context.drawImage(
      this.sheet,
      sprite[0],
      sprite[1],
      sprite[2],
      sprite[3],
      x + sprite[4],
      y,
      sprite[2] * 2,
      sprite[3] * 2
    );

    this.index++;
  }
}

class RunningMan {
  constructor(x, y, dx, dy) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;

    const img = new Image();
    img.src = "./images/prince-spritesheet.gif";
    this.img = img;

    this.animation = new Animation(100, 100, img, [
      [4, 0, 31, 43, 0],
      [34, 0, 33, 43, 0],
      [67, 0, 24, 43, 10],
      [90, 0, 28, 43, 0],
      [118, 0, 30, 43, 0],
      [151, 0, 32, 43, 0],
      [184, 0, 26, 43, 0],
      [209, 0, 31, 43, 0],
    ]);
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;

    if (this.x > canvas.width) {
      this.x = -30;
    }
  }

  render(canvas) {
    this.animation.render(this.x, this.y, canvas);
  }
}

class PrinceEngine {
  constructor(config) {
    this.config = config;
    this.name = "prince";
  }

  init(canvas) {
    this.canvas = canvas;
    this.runningMan = new RunningMan(150, 550, 15, 0);

    document.getElementById("role").style.filter = "invert(100%)";
    document.getElementById("social").style.filter = "invert(100%)";
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  update() {
    this.runningMan.move();

    this.runningMan.render(this.canvas);
  }
}

const princeEngine = new PrinceEngine({ fps: 10, backgroundColor: "black" });

export default princeEngine;
