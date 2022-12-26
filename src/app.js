import { image } from "./util";
import GeneticAlgorithm from "./genetic_algorithm";
import Pipe from "./pipe";
import state from "./state";

export class App {
  async run() {
    await state.initialize();
    this.ga = new GeneticAlgorithm();
    this.loop();
  }

  draw() {
    const { context, assets, gameSize, pipes, aliveBirds } = state;
    const { background, ground } = assets;

    image(context, background, 0, 0);

    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();
      if (pipes[i].checkOffScreen()) {
        pipes.splice(i, 1);
      }
    }

    for (let i = aliveBirds.length - 1; i >= 0; i--) {
      let bird = aliveBirds[i];
      bird.chooseAction(pipes);
      bird.update();
      for (let j = 0; j < pipes.length; j++) {
        if (pipes[j].checkCollision(bird)) {
          aliveBirds.splice(i, 1);
          break;
        }
      }
      if (bird.bottomTopCollision()) {
        aliveBirds.splice(i, 1);
      }
    }

    if (state.frameCounter % 50 === 0) {
      pipes.push(new Pipe());
    }

    state.frameCounter++;

    for (let i = 0; i < pipes.length; i++) {
      pipes[i].show();
    }
    for (let i = 0; i < aliveBirds.length; i++) {
      aliveBirds[i].show();
    }

    if (aliveBirds.length == 0) {
      state.generation++;
      this.ga.createNextGeneration();
    }

    image(context, ground, 0, gameSize.height - ground.height);
  }

  loop() {
    requestAnimationFrame(() => {
      this.draw();
      this.loop();
    });
  }
}
