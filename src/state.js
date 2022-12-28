import { loadImage, createCanvas } from "./util";
import Bird from "./bird";

class State {
  constructor() {
    this.assets = null;

    this.canvas = null;
    this.context = null;

    // The number of birds in each population
    this.totalPopulation = 300;

    // Birds currently alived
    this.aliveBirds = [];

    // all the birds of the current generation
    this.allBirds = [];

    // Array which holds all the pipes on the screen
    this.pipes = [];

    this.frameCounter = 0;

    this.maxPassedPipesCount = -Infinity;
  }

  async initialize() {
    this.assets = await this.loadAssets();
    this.canvas = this.setupCanvas(this.assets);
    this.context = this.canvas.getContext("2d");

    for (let i = 0; i < this.totalPopulation; i++) {
      let bird = new Bird();
      this.aliveBirds[i] = bird;
      this.allBirds[i] = bird;
    }

    return this;
  }

  get gameSize() {
    if (!this.assets) return { width: 0, height: 0 };
    const { width, height } = this.assets.background;
    return { width, height };
  }

  async loadAssets() {
    return {
      background: await loadImage("/assets/bg.png"),
      bird: await loadImage("/assets/bird.png"),
      ground: await loadImage("/assets/ground.png"),
      pipeDown: await loadImage("/assets/pipeDown.png"),
      pipeTop: await loadImage("/assets/pipeUp.png"),
    };
  }

  setupCanvas(assets) {
    const c = createCanvas(
      {
        width: assets.background.width,
        height: assets.background.height,
      },
      "canvas"
    );
    return c;
  }
}

const state = new State();

export default state;
