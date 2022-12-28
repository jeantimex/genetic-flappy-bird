import { image } from "./util";
import GeneticAlgorithm from "./genetic_algorithm";
import Pipe from "./pipe";
import state from "./state";

export class App {
  async run() {
    await state.initialize();

    this.frameCounter = 0;
    // Array which holds all the pipes on the screen
    this.pipes = [];
    this.maxPassedPipesCount = -Infinity;
    this.ga = new GeneticAlgorithm();
    this.loop();
  }

  draw() {
    const { context, assets, gameSize } = state;
    const { background, ground } = assets;
    const { aliveBirds } = this.ga;

    image(context, background, 0, 0);

    for (let i = this.pipes.length - 1; i >= 0; i--) {
      this.pipes[i].update();
      if (this.pipes[i].checkOffScreen()) {
        this.pipes.splice(i, 1);
      }
    }

    for (let i = aliveBirds.length - 1; i >= 0; i--) {
      let bird = aliveBirds[i];
      bird.chooseAction(this.pipes);
      bird.update(this.pipes);
      for (let j = 0; j < this.pipes.length; j++) {
        if (this.pipes[j].checkCollision(bird)) {
          aliveBirds.splice(i, 1);
          break;
        }
      }
      if (bird.bottomTopCollision()) {
        aliveBirds.splice(i, 1);
      }
    }

    if (this.frameCounter % 50 === 0) {
      this.pipes.push(new Pipe());
    }

    this.frameCounter++;

    for (let i = 0; i < this.pipes.length; i++) {
      this.pipes[i].show();
    }
    for (let i = 0; i < aliveBirds.length; i++) {
      aliveBirds[i].show();
    }

    if (aliveBirds.length == 0) {
      this.ga.createNextGeneration();
    }

    image(context, ground, 0, gameSize.height - ground.height);

    this.updateInfo();
  }

  updateInfo() {
    const { generation, aliveBirds } = this.ga;

    const generationInfo = document.getElementById("generation");
    generationInfo.textContent = `Current generation: ${generation}`;

    const aliveBirdsInfo = document.getElementById("aliveBirds");
    aliveBirdsInfo.textContent = `Live birds: ${aliveBirds.length}`;

    if (this.ga.aliveBirds.length > 0) {
      const passedPipes = document.getElementById("passedPipes");
      const bestPassedPipes = document.getElementById("bestPassedPipes");
      const passedPipesCount = aliveBirds[0].passedPipes.size;

      this.maxPassedPipesCount = Math.max(
        this.maxPassedPipesCount,
        passedPipesCount
      );
      passedPipes.textContent = `Passed pipes: ${passedPipesCount}`;
      bestPassedPipes.textContent = `Max passed pipes: ${this.maxPassedPipesCount}`;
    }
  }

  loop() {
    requestAnimationFrame(() => {
      this.draw();
      this.loop();
    });
  }
}
