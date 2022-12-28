import { loadImage, createCanvas } from "./util";

class State {
  constructor() {
    this.assets = null;
    this.context = null;
  }

  async initialize() {
    this.assets = await this.loadAssets();

    const canvas = this.setupCanvas(this.assets.background);
    this.context = canvas.getContext("2d");
  }

  get gameSize() {
    if (!this.assets) return { width: 0, height: 0, actualHeight: 0 };
    const { background, ground } = this.assets;
    return {
      width: background.width,
      height: background.height,
      actualHeight: background.height - ground.height,
    };
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

  setupCanvas(background) {
    const { width, height } = background;
    const c = createCanvas(
      {
        width,
        height,
      },
      "canvas"
    );
    return c;
  }
}

const state = new State();

export default state;
