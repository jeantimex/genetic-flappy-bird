import state from "./state";
import NeuralNetwork from "./neural_network";
import { map, image } from "./util";

export default class Bird {
  constructor(brain) {
    const { gameSize, assets } = state;
    const { bird } = assets;

    this.x = 50;
    this.y = gameSize.actualHeight / 2;
    this.width = bird.width;
    this.height = bird.height;
    this.gravity = 0.8;
    this.upLift = -12;
    this.velocity = 0;

    // How many frames the bird stays alive
    this.score = 0;

    this.passedPipes = new Set();

    // The fitness of the bird
    this.fitness = 0;

    if (brain instanceof NeuralNetwork) {
      this.brain = brain.copy();
      this.brain.mutate(0.1);
    } else {
      // Parameters are number of inputs, number of units in hidden Layer, number of outputs
      this.brain = new NeuralNetwork(5, 8, 1);
    }
  }

  copy() {
    return new Bird(this.brain);
  }

  // mutate(rate) {
  // 	this.brain.mutate(rate);
  // }

  show() {
    const { context, assets } = state;
    image(context, assets.bird, this.x, this.y);
  }

  chooseAction(pipes) {
    const { gameSize } = state;

    let closest = null;
    let minimum = Infinity;
    for (let i = 0; i < pipes.length; i++) {
      let diff = pipes[i].x + pipes[i].width - this.x;
      if (diff > 0 && diff < minimum) {
        minimum = diff;
        closest = pipes[i];
      }
    }

    if (closest != null) {
      // We get all the inputs and normalize them between 0 and 1
      let inputs = [];
      // The 5 inpputs I have chosen for the network are
      // 1. The horizontal distance of the pipe from the bird
      inputs[0] = map(closest.x, this.x, gameSize.width, 0, 1);

      // 2. top of the closest pipe
      inputs[1] = map(closest.top, 0, gameSize.actualHeight, 0, 1);

      // 3. bottom of the closest pipe
      inputs[2] = map(closest.bottom, 0, gameSize.actualHeight, 0, 1);

      // 4. bird's y position
      inputs[3] = map(this.y, 0, gameSize.actualHeight, 0, 1);

      // 5. bird's velocity
      inputs[4] = map(this.velocity, -12, 12, 0, 1);

      const action = this.brain.predict(inputs);
      if (action[0] > 0.5) {
        this.jump();
      }
    }
  }

  jump() {
    this.velocity += this.upLift;
    this.velocity *= 0.9;
  }

  bottomTopCollision() {
    const { gameSize } = state;

    return (
      this.y + this.height / 2 > gameSize.actualHeight ||
      this.y - this.hieght / 2 < 0
    );
  }

  update(pipes) {
    this.velocity += this.gravity;
    this.velocity *= 0.9;
    this.y += this.velocity;
    this.score++;

    for (const pipe of pipes) {
      if (pipe.hasPassed(this)) {
        this.passedPipes.add(pipe);
      }
    }
  }
}
