export async function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function createCanvas(options, canvasIdOrElement) {
  const { width, height } = options;

  let canvas = null;

  if (typeof canvasIdOrElement === "string") {
    canvas = document.getElementById(canvasIdOrElement);
  } else if (canvasIdOrElement instanceof Element) {
    canvas = canvasIdOrElement;
  } else {
    canvas = document.createElement("canvas");
  }

  if (canvas && !canvas.isConnected) {
    document.body.append(canvas);
  }

  const devicePixelRatio = window.devicePixelRatio || 1;
  const context = canvas.getContext("2d");

  canvas.width = width * devicePixelRatio;
  canvas.height = height * devicePixelRatio;

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  context.scale(devicePixelRatio, devicePixelRatio);

  return canvas;
}

export function random(min, max) {
  if (min == null) {
    return Math.random();
  }

  if (max == null) {
    return Math.random() * min;
  }

  if (min > max) {
    const temp = min;
    min = max;
    max = temp;
  }
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function constrain(n, low, high) {
  return Math.max(Math.min(n, high), low);
}

export function map(n, start1, stop1, start2, stop2, withinBounds) {
  const newValue =
    ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;

  if (!withinBounds) {
    return newValue;
  }

  if (start2 < stop2) {
    return constrain(newValue, start2, stop2);
  } else {
    return constrain(newValue, stop2, start2);
  }
}

export function image(context, img, x, y) {
  context.drawImage(img, x, y);
}

export class GaussianRandom {
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
