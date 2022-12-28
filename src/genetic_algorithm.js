import { random } from "./util";
import state from "./state";
import Bird from "./bird";

export default class GeneticAlgorithm {
  constructor() {
    // The number of birds in each population
    this.totalPopulation = 300;

    // Birds currently alived
    this.aliveBirds = [];

    // all the birds of the current generation
    this.allBirds = [];

    // Current generation number
    this.generation = 1;

    for (let i = 0; i < this.totalPopulation; i++) {
      let bird = new Bird();
      this.aliveBirds[i] = bird;
      this.allBirds[i] = bird;
    }
  }

  resetGame() {
    state.frameCounter = 0;
    state.pipes = [];
  }

  createNextGeneration() {
    this.resetGame();
    this.normalizeFitness(this.allBirds);
    this.aliveBirds = this.generate(this.allBirds);
    this.allBirds = this.aliveBirds.slice();
    this.generation++;
  }

  generate(oldBirds) {
    let newBirds = [];
    for (let i = 0; i < oldBirds.length; i++) {
      // Select a bird based on fitness
      let bird = this.poolSelection(oldBirds);
      newBirds[i] = bird;
    }
    return newBirds;
  }

  normalizeFitness(birds) {
    for (let i = 0; i < birds.length; i++) {
      birds[i].score = Math.pow(birds[i].score, 2);
    }

    let sum = 0;
    for (let i = 0; i < birds.length; i++) {
      sum += birds[i].score;
    }

    for (let i = 0; i < birds.length; i++) {
      birds[i].fitness = birds[i].score / sum;
    }
  }

  // An algorithm for picking one bird from an array
  // based on fitness
  poolSelection(birds) {
    // Start at 0
    let index = 0;

    // Pick a random number between 0 and 1
    let r = random(1);

    // Keep subtracting probabilities until you get less than zero
    // Higher probabilities will be more likely to be fixed since they will
    // subtract a larger number towards zero
    while (r > 0) {
      r -= birds[index].fitness;
      // And move on to the next
      index += 1;
    }

    // Go back one
    index -= 1;

    // Make sure it's a copy!
    // (this includes mutation)
    return birds[index].copy();
  }
}
