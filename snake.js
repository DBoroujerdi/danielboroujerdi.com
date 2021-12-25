class Block {
  constructor({ x, y, direction, size }) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.color = "#3D4747";
    this.size = size;
  }

  render(canvas) {
    const context = canvas.getContext("2d");
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.size - 1, this.size - 1);
  }
}

class Food {
  constructor(engine) {
    this.x = Math.random() * (engine.width - 50) + 25;
    this.y = Math.random() * (engine.height - 50) + 25;
    this.engine = engine;
  }

  render(canvas) {
    canvas.getContext("2d").fillText("🍎", this.x, this.y);
  }
}

class Snake {
  constructor(canvas, engine, config, direction) {
    this.canvas = canvas;
    this.engine = engine;
    this.blocks = [];
    this.config = config;
    this.direction = direction;
  }

  changeDirection(direction) {
    this.direction = direction;
  }

  addBlockToFront() {
    if (this.blocks.length) {
      const headBlock = this.head();
      this.blocks.push(
        new Block({
          x: headBlock.x + this.config.blockSize * this.direction.dx,
          y: headBlock.y + this.config.blockSize * this.direction.dy,
          direction: this.direction,
          size: this.config.blockSize,
        })
      );
    } else {
      this.blocks.push(
        new Block({
          x: 100,
          y: 100,
          direction: this.direction,
          size: this.config.blockSize,
        })
      );
    }
  }

  move() {
    this.dropLastBlock();
    this.addBlockToFront();
  }

  render(canvas) {
    for (let block of this.blocks) {
      block.render(canvas);
    }
  }

  isOutOfBounds() {
    const head = this.head();
    return (
      head.x < 0 ||
      head.x > this.canvas.width ||
      head.y < 0 ||
      head.y > this.canvas.height
    );
  }

  overlaps() {
    const head = this.head();
    for (let i = 0; i < this.blocks.length - 1; i++) {
      const block = this.blocks[i];
      if (head.x === block.x && head.y === block.y) {
        return true;
      }
    }
    return false;
  }

  hasEaten(food) {
    const head = this.head();
    return (
      head.x - this.config.blockSize <= food.x &&
      head.x + this.config.blockSize * 2 >= food.x &&
      head.y - this.config.blockSize <= food.y &&
      head.y + this.config.blockSize * 2 >= food.y
    );
  }

  grow() {
    this.addBlockToFront();
  }

  dropLastBlock() {
    this.blocks.shift();
  }

  head() {
    return this.blocks[this.blocks.length - 1];
  }
}

const DIRECTIONS = {
  UP: { dx: 0, dy: -1 },
  DOWN: { dx: 0, dy: 1 },
  LEFT: { dx: -1, dy: 0 },
  RIGHT: { dx: 1, dy: 0 },
};

class ScoreDisplay {
  constructor() {
    this.score = 0;
  }

  reset() {
    this.score = 0;
  }

  increment() {
    this.score++;
  }

  render(canvas) {
    canvas
      .getContext("2d")
      .fillText("SCORE: " + this.score, 30, canvas.height - 30);
  }
}

class SnakeEngine {
  constructor(config) {
    this.config = config;
    this.score = new ScoreDisplay();
    this.name = "snake";
  }

  init(canvas) {
    this.canvas = canvas;

    this.reset();

    this.setupKeyboardListeners(this);

    document.getElementById("role").style.filter = undefined;
    document.getElementById("social").style.filter = undefined;
  }

  reset() {
    this.snake = new Snake(canvas, this, this.config, DIRECTIONS.RIGHT);
    const { startingSnakeLength } = this.config;

    for (let i = 0; i < startingSnakeLength; i++) {
      this.snake.addBlockToFront();
    }

    this.food = new Food(this);
  }

  setupKeyboardListeners(engine) {
    document.addEventListener("keydown", (event) => {
      const key = event.key;
      const { snake } = engine;

      switch (key) {
        case "ArrowUp":
          if (snake.direction !== DIRECTIONS.DOWN) {
            snake.changeDirection(DIRECTIONS.UP);
          }
          break;
        case "ArrowDown":
          if (snake.direction !== DIRECTIONS.UP) {
            snake.changeDirection(DIRECTIONS.DOWN);
          }
          break;
        case "ArrowLeft":
          if (snake.direction !== DIRECTIONS.RIGHT) {
            snake.changeDirection(DIRECTIONS.LEFT);
          }
          break;
        case "ArrowRight":
          if (snake.direction !== DIRECTIONS.LEFT) {
            snake.changeDirection(DIRECTIONS.RIGHT);
          }
          break;
      }
    });
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  update() {
    this.snake.move();

    if (this.snake.hasEaten(this.food)) {
      this.snake.grow();
      this.food = new Food(this);
      this.score.increment();
    }

    this.snake.render(this.canvas);

    this.food.render(this.canvas);

    this.score.render(this.canvas);

    if (this.snake.isOutOfBounds() || this.snake.overlaps()) {
      this.reset();
      this.score.reset();
    }
  }
}

const snake = new SnakeEngine({
  fps: 30,
  blockSize: 10,
  startingSnakeLength: 7,
  backgroundColor: "#7e9881",
});

export default snake;
