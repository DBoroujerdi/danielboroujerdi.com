import boids from "./boids.js";
import snake from "./snake.js";

class FPSDisplay {
  constructor(container) {
    this.fpsCount = 0;
    this.fps = 0;
    this.lastAnimationFrameTime = Date.now();
    this.interval = 0;
    this.container = container;
  }

  reset() {
    this.fps = this.fpsCount;
    this.fpsCount = 0;
    this.interval = 0;
  }

  update() {
    const now = Date.now();
    this.interval += now - this.lastAnimationFrameTime;
    this.lastAnimationFrameTime = now;
    this.fpsCount++;

    if (this.interval >= 1000) {
      this.reset();
    }

    const canvas = this.container.canvas;

    const context = canvas.getContext("2d");

    context.fillText("FPS: " + this.fps, 30, canvas.height - 30);
  }
}

class CanvasContainer {
  constructor(engine) {
    this.engine = engine;
    this.stopped = false;
    this.animationFrameId = 0;

    this.lastAnimationFrameTime = Date.now();
    this.fpsInterval = 1000 / engine.config.fps;
  }

  start() {
    this.createNewCanvas();

    this.resizeCanvasToFitWindow();

    this.updateCanvasColor();

    this.engine.init(this.canvas);

    this.startLoop();
  }

  updateCanvasColor() {
    document.body.style.backgroundColor = this.engine.config.backgroundColor;
  }

  stop() {
    this.stopped = true;

    let id = this.animationFrameId;
    do {
      window.cancelAnimationFrame(id);
    } while (id--);

    this.destroyOldCanvas();
  }

  resizeCanvasToFitWindow() {
    const vw = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0,
      window.visualViewport.width || 0,
    );
    const vh = Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0,
      window.visualViewport.height || 0,
    );

    this.canvas.width = vw;
    this.canvas.height = vh;
  }

  startLoop() {
    this.stopped = false;
    this.loop();
  }

  clear() {
    this.canvas
      .getContext("2d")
      .clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  loop() {
    if (this.stopped) return;

    const now = Date.now();
    const elapsed = now - this.lastAnimationFrameTime;

    if (elapsed > this.fpsInterval) {
      this.clear();
      this.engine.update();
      this.lastAnimationFrameTime = now;
    }

    this.animationFrameId = window.requestAnimationFrame(this.loop.bind(this));
  }

  destroyOldCanvas() {
    const container = document.getElementById("canvas-container");
    const canvas = document.getElementById("canvas");
    container.removeChild(canvas);
  }

  createNewCanvas() {
    const container = document.getElementById("canvas-container");
    const canvas = document.createElement("canvas");
    this.canvas = canvas;
    canvas.id = "canvas";
    container.appendChild(canvas);
  }

  changeEngine(engine) {
    const urlParams = new URLSearchParams({
      engine: engine.name,
    }).toString();
    const location = window.location;
    const url = location.protocol + "//" + location.host + location.pathname;
    window.history.replaceState({}, document.title, `${url}?${urlParams}`);
    this.engine = engine;
  }
}

const engines = {
  boids,
  snake,
};

const urlSearchParams = new URLSearchParams(window.location.search);

let engine = "boids";

if (urlSearchParams.has("engine")) {
  engine = urlSearchParams.get("engine");
} else {
  const urlParams = new URLSearchParams({
    engine,
  }).toString();
  const location = window.location;
  const url = location.protocol + "//" + location.host + location.pathname;
  window.history.replaceState({}, document.title, `${url}?${urlParams}`);
}

window.onload = () => {
  const container = new CanvasContainer(engines[engine]);

  container.start();

  const select = document.getElementById("canvas-selector");

  select.value = engine;

  select.addEventListener("change", (event) => {
    container.stop();

    switch (event.target.value) {
      case "boids":
        container.changeEngine(boids);
        break;
      case "snake":
        container.changeEngine(snake);
        break;
      default:
        throw Error();
    }

    container.start();
  });

  window.addEventListener(
    "resize",
    () => {
      container.resizeCanvasToFitWindow();
    },
    false,
  );
};
