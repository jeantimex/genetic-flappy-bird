import Pipe from "./pipe";

export default class PipeManager {
  constructor() {
    // Array which holds all the pipes on the screen
    this.pipes = [];
    this.frameCounter = 0;
  }

  update() {
    for (let i = this.pipes.length - 1; i >= 0; i--) {
      this.pipes[i].update();
      if (this.pipes[i].checkOffScreen()) {
        this.pipes.splice(i, 1);
      }
    }

    if (this.frameCounter % 50 === 0) {
      this.pipes.push(new Pipe());
    }

    this.frameCounter++;

    return this.pipes;
  }

  reset() {
    this.frameCounter = 0;
    this.pipes = [];
  }
}
