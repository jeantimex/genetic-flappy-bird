import { random } from "./util";

export default class GaussianRandom {
  constructor() {
    this.y2 = 0;
    this.hasPreviousGaussian = false;
  }

  random(mean = 0, sd = 1) {
    let y1, x1, x2, w;

    if (this.hasPreviousGaussian) {
      y1 = this.y2;
      this.hasPreviousGaussian = false;
    } else {
      do {
        x1 = random(2) - 1;
        x2 = random(2) - 1;
        w = x1 * x1 + x2 * x2;
      } while (w >= 1);

      w = Math.sqrt((-2 * Math.log(w)) / w);
      y1 = x1 * w;
      this.y2 = x2 * w;
      this.hasPreviousGaussian = true;
    }

    return y1 * sd + mean;
  }
}
