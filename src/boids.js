class BoidsEngine {
  constructor(config) {
    const { numBoids, visualRange, behaviors } = config;
    this.config = config;
    this.numBoids = numBoids;
    this.visualRange = visualRange;
    this.boids = [];
    this.behaviors = behaviors;
    this.mousedHoverLocation = { x: 0, y: 0 };
    this.name = "boids";
  }

  init(canvas) {
    this.boids = [];
    this.canvas = canvas;

    for (let i = 0; i < this.numBoids; i++) {
      const boid = new Boid(canvas, this, {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: 0.1,
        dy: 0.1,
      });

      boid.render();

      this.boids.push(boid);
    }

    document.getElementById("role").style.filter = undefined;
    document.getElementById("social").style.filter = undefined;
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  update() {
    for (let boid of this.boids) {
      boid.move();
      boid.render();
    }
  }
}

class WallAvoidBehavior {
  constructor({ margin, turnFactor }) {
    this.margin = margin;
    this.turnFactor = turnFactor;
  }

  update(boid, engine) {
    const margin = this.margin;
    const turnFactor = this.turnFactor;
    const width = engine.width;
    const height = engine.height;

    if (boid.x < margin) {
      boid.dx += turnFactor;
    }
    if (boid.x > width - margin) {
      boid.dx -= turnFactor;
    }
    if (boid.y < margin) {
      boid.dy += turnFactor;
    }
    if (boid.y > height - margin) {
      boid.dy -= turnFactor;
    }
  }
}

class AvoidProfilePicBehavior {
  constructor({ avoidFactor, picDiameter }) {
    this.avoidFactor = avoidFactor;
    this.picDiameter = picDiameter;
  }

  distance(boid, engine) {
    const x = engine.width / 2;
    const y = engine.height / 2;

    return Math.sqrt((boid.x - x) * (boid.x - x) + (boid.y - y) * (boid.y - y));
  }

  update(boid, engine) {
    if (this.distance(boid, engine) < this.picDiameter) {
      boid.dx += 1; // * this.avoidFactor;
      boid.dy += 1; // * this.avoidFactor;
    }
  }
}

class AvoidMouseBehavior {
  constructor({ avoidFactor }) {
    this.avoidFactor = avoidFactor;
  }

  update(boid, engine) {
    const mouse = engine.mousedHoverLocation;

    if (mouse.x > 0 && mouse.y > 0) {
      boid.dx += (mouse.x - boid.x) * this.avoidFactor;
      boid.dy += (mouse.y - boid.y) * this.avoidFactor;
    }
  }
}

class AvoidOtherBehavior {
  constructor({ minDistance, avoidFactor }) {
    this.minDistance = minDistance;
    this.avoidFactor = avoidFactor;
  }

  update(boid, engine) {
    const minDistance = 20;
    const avoidFactor = 0.05;

    let moveX = 0;
    let moveY = 0;
    for (let otherBoid of engine.boids) {
      if (otherBoid !== boid) {
        if (boid.distance(otherBoid) < minDistance) {
          moveX += boid.x - otherBoid.x;
          moveY += boid.y - otherBoid.y;
        }
      }
    }

    boid.dx += moveX * avoidFactor;
    boid.dy += moveY * avoidFactor;
  }
}

class FlyTowardsCenterBehavior {
  constructor({ centeringFactor }) {
    this.centeringFactor = centeringFactor;
  }

  update(boid, engine) {
    const centeringFactor = this.centeringFactor;
    const boids = engine.boids;
    const visualRange = engine.visualRange;

    let centerX = 0;
    let centerY = 0;
    let numNeighbors = 0;

    for (let otherBoid of boids) {
      if (boid.distance(otherBoid) < visualRange) {
        centerX += otherBoid.x;
        centerY += otherBoid.y;
        numNeighbors += 1;
      }
    }

    if (numNeighbors) {
      centerX = centerX / numNeighbors;
      centerY = centerY / numNeighbors;

      boid.dx += (centerX - boid.x) * centeringFactor;
      boid.dy += (centerY - boid.y) * centeringFactor;
    }
  }
}

class MatchVelocityBehavior {
  constructor({ matchingFactor }) {
    this.matchingFactor = matchingFactor;
  }

  update(boid, engine) {
    const matchingFactor = this.matchingFactor;

    let avgDX = 0;
    let avgDY = 0;
    let numNeighbors = 0;

    for (let otherBoid of engine.boids) {
      if (boid.distance(otherBoid) < engine.visualRange) {
        avgDX += otherBoid.dx;
        avgDY += otherBoid.dy;
        numNeighbors += 1;
      }
    }

    if (numNeighbors) {
      avgDX = avgDX / numNeighbors;
      avgDY = avgDY / numNeighbors;

      boid.dx += (avgDX - boid.dx) * matchingFactor;
      boid.dy += (avgDY - boid.dy) * matchingFactor;
    }
  }
}

class LimitSpeedBehavior {
  constructor({ maxSpeed }) {
    this.maxSpeed = maxSpeed;
  }

  update(boid, engine) {
    const speedLimit = this.maxSpeed;

    const speed = Math.sqrt(boid.dx * boid.dx + boid.dy * boid.dy);
    if (speed > speedLimit) {
      boid.dx = (boid.dx / speed) * speedLimit;
      boid.dy = (boid.dy / speed) * speedLimit;
    }
  }
}

class Boid {
  constructor(canvas, engine, { x, y, dx, dy }) {
    this.engine = engine;
    this.canvas = canvas;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
  }

  render() {
    this.canvas.getContext("2d").fillRect(this.x, this.y, 4, 4);
  }

  distance(other) {
    return Math.sqrt(
      (this.x - other.x) * (this.x - other.x) +
        (this.y - other.y) * (this.y - other.y)
    );
  }

  move() {
    this.engine.behaviors.forEach((behavior) =>
      behavior.update(this, this.engine)
    );

    this.x += this.dx;
    this.y += this.dy;
  }

  print() {
    console.log(this.x, this.y);
  }
}

const engine = new BoidsEngine({
  fps: 60,
  numBoids: 1000,
  visualRange: 79,
  backgroundColor: "#db9494",
  behaviors: [
    new AvoidOtherBehavior({ minDistance: 5, avoidFactor: 0.05 }),
    new WallAvoidBehavior({ margin: 30, turnFactor: 0.4 }),
    new FlyTowardsCenterBehavior({ centeringFactor: 0.005 }),
    new MatchVelocityBehavior({ matchingFactor: 0.05 }),
    new LimitSpeedBehavior({ maxSpeed: 10 }),
    // new AvoidProfilePicBehavior({ avoidFactor: 0.05, picDiameter: 200 }),
    new AvoidMouseBehavior({ avoidFactor: 1 }),
  ],
});

export default engine;
