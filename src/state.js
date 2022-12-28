import { loadImage, createCanvas } from "./util";

class State {
  constructor() {
    this.assets = null;
    this.canvas = null;
    this.context = null;
  }

  async initialize() {
    this.assets = await this.loadAssets();
    this.canvas = this.setupCanvas(this.assets);
    this.context = this.canvas.getContext("2d");
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
