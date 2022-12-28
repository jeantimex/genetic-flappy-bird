import { random, image } from "./util";
import state from "./state";

export default class Pipe {
  constructor() {
    const { assets, gameSize } = state;
    const { pipeDown, pipeTop } = assets;

    // Spacing between the top and bottom pipes
    const pipeGap = 75;

    // Center of the pipe
    const centerOfPipe = random(
      gameSize.height - pipeDown.height - pipeGap / 2,
      pipeTop.height + pipeGap / 2
    );

    // Top pipe's bottom y coordinate
    this.top = centerOfPipe - pipeGap / 2;

    // Bottom pipe's top y coordinate
    this.bottom = centerOfPipe + pipeGap / 2;

    // x position of left edge of the pipe
    this.x = gameSize.width;

    // Width of the pipe
    this.width = pipeDown.width;

    // Speed of the pipe
    this.speed = 6;
  }

  checkCollision(bird) {
    if (
      bird.x + bird.width / 2 >= this.x &&
      bird.x - bird.width / 2 <= this.x + this.width
    ) {
      if (
        bird.y - bird.height / 2 <= this.top ||
        bird.y + bird.height / 2 >= this.bottom
      ) {
        return true;
      }
    }
    return false;
  }

  show() {
    const { context, assets } = state;
    const { pipeDown, pipeTop } = assets;

    image(
      context,
      pipeTop,
      this.x,
      -Math.abs(pipeTop.height - this.top),
      this.width,
      pipeTop.height
    );
    image(context, pipeDown, this.x, this.bottom, this.width, pipeDown.height);
  }

  update() {
    this.x -= this.speed;
  }

  checkOffScreen() {
    if (this.x < -this.width) {
      return true;
    }
    return false;
  }

  hasPassed(bird) {
    return bird.x - bird.width / 2 > this.x + this.width;
  }
}
