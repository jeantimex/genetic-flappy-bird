import { image } from "./util";
import BirdManager from "./bird_manager";
import state from "./state";
import PipeManager from "./pipe_manager";

export class App {
  async run() {
    await state.initialize();

    this.maxPassedPipesCount = -Infinity;
    this.pipeManager = new PipeManager();
    this.birdManager = new BirdManager();
    this.loop();
  }

  update() {
    const pipes = this.pipeManager.update();
    const birds = this.birdManager.update(pipes);

    if (birds.length == 0) {
      this.pipeManager.reset();
      this.birdManager.createNextGeneration();
    }

    this.draw(pipes, birds);
    this.updateInfo();
  }

  draw(pipes, birds) {
    const { context, assets, gameSize } = state;
    const { background, ground } = assets;

    image(context, background, 0, 0);

    for (let i = 0; i < pipes.length; i++) {
      pipes[i].show();
    }

    for (let i = 0; i < birds.length; i++) {
      birds[i].show();
    }

    image(context, ground, 0, gameSize.height - ground.height);
  }

  updateInfo() {
    const { generation, aliveBirds } = this.birdManager;

    const generationInfo = document.getElementById("generation");
    generationInfo.textContent = `Current generation: ${generation}`;

    const aliveBirdsInfo = document.getElementById("aliveBirds");
    aliveBirdsInfo.textContent = `Alive birds: ${aliveBirds.length}`;

    if (aliveBirds.length > 0) {
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
      this.update();
      this.loop();
    });
  }
}
