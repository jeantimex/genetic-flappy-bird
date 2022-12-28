import { image } from "./util";
import GeneticAlgorithm from "./genetic_algorithm";
import state from "./state";
import PipeManager from "./pipe_manager";

export class App {
  async run() {
    await state.initialize();

    this.maxPassedPipesCount = -Infinity;
    this.pipeManager = new PipeManager();
    this.ga = new GeneticAlgorithm();
    this.loop();
  }

  draw() {
    const { context, assets, gameSize } = state;
    const { background, ground } = assets;

    image(context, background, 0, 0);

    const pipes = this.pipeManager.update();
    this.ga.update(pipes);

    if (this.ga.aliveBirds.length == 0) {
      this.pipeManager.reset();
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
    aliveBirdsInfo.textContent = `Alive birds: ${aliveBirds.length}`;

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
