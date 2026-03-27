var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/ai/genetic/NeuralNetwork.ts
var NeuralNetwork = class _NeuralNetwork {
  layers;
  weights;
  // weights[layer][node][prevNode]
  biases;
  // biases[layer][node]
  constructor(layerSizes) {
    this.layers = layerSizes;
    this.weights = [];
    this.biases = [];
    for (let i = 1; i < this.layers.length; i++) {
      const prevNodes = this.layers[i - 1];
      const currentNodes = this.layers[i];
      const layerWeights = [];
      const layerBiases = [];
      for (let j = 0; j < currentNodes; j++) {
        const nodeWeights = [];
        for (let k = 0; k < prevNodes; k++) {
          nodeWeights.push(Math.random() * 2 - 1);
        }
        layerWeights.push(nodeWeights);
        layerBiases.push(Math.random() * 2 - 1);
      }
      this.weights.push(layerWeights);
      this.biases.push(layerBiases);
    }
  }
  // Load predefined weights
  loadWeights(savedWeights) {
    this.weights = savedWeights.layers;
    this.biases = savedWeights.biases;
  }
  // Export current weights
  exportWeights() {
    return {
      layers: this.weights,
      biases: this.biases
    };
  }
  // Sigmoid activation function
  activate(x) {
    return 1 / (1 + Math.exp(-x));
  }
  // Predict output based on inputs
  predict(inputs) {
    if (inputs.length !== this.layers[0]) {
      throw new Error(`Expected ${this.layers[0]} inputs, got ${inputs.length}`);
    }
    let currentOutputs = [...inputs];
    for (let i = 0; i < this.weights.length; i++) {
      const nextOutputs = [];
      const layerWeights = this.weights[i];
      const layerBiases = this.biases[i];
      for (let j = 0; j < layerWeights.length; j++) {
        let sum = layerBiases[j];
        for (let k = 0; k < layerWeights[j].length; k++) {
          sum += currentOutputs[k] * layerWeights[j][k];
        }
        nextOutputs.push(this.activate(sum));
      }
      currentOutputs = nextOutputs;
    }
    return currentOutputs;
  }
  // Mutate weights for genetic variability
  mutate(mutationRate) {
    for (let i = 0; i < this.weights.length; i++) {
      for (let j = 0; j < this.weights[i].length; j++) {
        for (let k = 0; k < this.weights[i][j].length; k++) {
          if (Math.random() < mutationRate) {
            this.weights[i][j][k] += (Math.random() * 2 - 1) * 0.5;
            this.weights[i][j][k] = Math.max(-1, Math.min(1, this.weights[i][j][k]));
          }
        }
      }
    }
    for (let i = 0; i < this.biases.length; i++) {
      for (let j = 0; j < this.biases[i].length; j++) {
        if (Math.random() < mutationRate) {
          this.biases[i][j] += (Math.random() * 2 - 1) * 0.5;
          this.biases[i][j] = Math.max(-1, Math.min(1, this.biases[i][j]));
        }
      }
    }
  }
  // Crossover (mixes genes from two parents to create offspring)
  crossover(partner) {
    const child = new _NeuralNetwork([...this.layers]);
    for (let i = 0; i < this.weights.length; i++) {
      for (let j = 0; j < this.weights[i].length; j++) {
        for (let k = 0; k < this.weights[i][j].length; k++) {
          child.weights[i][j][k] = Math.random() < 0.5 ? this.weights[i][j][k] : partner.weights[i][j][k];
        }
      }
    }
    for (let i = 0; i < this.biases.length; i++) {
      for (let j = 0; j < this.biases[i].length; j++) {
        child.biases[i][j] = Math.random() < 0.5 ? this.biases[i][j] : partner.biases[i][j];
      }
    }
    return child;
  }
};

// src/ai/genetic/vision.ts
function getVision(snake, food, direction, gridSize) {
  const head = snake[0];
  const vision = [];
  let dirs = [];
  switch (direction) {
    case "UP":
      dirs = [
        { x: 0, y: -1 },
        { x: 1, y: -1 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 0, y: 1 },
        { x: -1, y: 1 },
        { x: -1, y: 0 },
        { x: -1, y: -1 }
      ];
      break;
    case "RIGHT":
      dirs = [
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 0, y: 1 },
        { x: -1, y: 1 },
        { x: -1, y: 0 },
        { x: -1, y: -1 },
        { x: 0, y: -1 },
        { x: 1, y: -1 }
      ];
      break;
    case "DOWN":
      dirs = [
        { x: 0, y: 1 },
        { x: -1, y: 1 },
        { x: -1, y: 0 },
        { x: -1, y: -1 },
        { x: 0, y: -1 },
        { x: 1, y: -1 },
        { x: 1, y: 0 },
        { x: 1, y: 1 }
      ];
      break;
    case "LEFT":
      dirs = [
        { x: -1, y: 0 },
        { x: -1, y: -1 },
        { x: 0, y: -1 },
        { x: 1, y: -1 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 0, y: 1 },
        { x: -1, y: 1 }
      ];
      break;
  }
  for (const dir of dirs) {
    let distWall = 0;
    let distFood = 0;
    let distBody = 0;
    let currX = head.x;
    let currY = head.y;
    let foundFood = false;
    let foundBody = false;
    let loops = 0;
    while (true) {
      if (loops++ > 100) throw new Error("Infinite loop in getVision");
      currX += dir.x;
      currY += dir.y;
      distWall++;
      if (currX < 0 || currX >= gridSize || currY < 0 || currY >= gridSize) {
        break;
      }
      if (!foundFood && currX === food.x && currY === food.y) {
        distFood = distWall;
        foundFood = true;
      }
      if (!foundBody && snake.some((s) => s.x === currX && s.y === currY)) {
        distBody = distWall;
        foundBody = true;
      }
    }
    vision.push(
      1 / distWall,
      foundFood ? 1 / distFood : 0,
      foundBody ? 1 / distBody : 0
    );
  }
  return vision;
}

// src/ai/genetic/test-user-weights.ts
var import_fs = __toESM(require("fs"), 1);
var weights = JSON.parse(import_fs.default.readFileSync("user-weights.json", "utf8"));
var nn = new NeuralNetwork([24, 16, 16, 3]);
nn.loadWeights(weights);
var visionRight = getVision([{ x: 10, y: 10 }], { x: 15, y: 10 }, "RIGHT", 20);
var outRight = nn.predict(visionRight);
var maxIdxRight = outRight.indexOf(Math.max(...outRight));
console.log("Facing RIGHT. Output:", outRight, "Decision:", ["FORWARD", "RIGHT", "LEFT"][maxIdxRight]);
var visionUp = getVision([{ x: 10, y: 10 }], { x: 10, y: 5 }, "UP", 20);
var outUp = nn.predict(visionUp);
var maxIdxUp = outUp.indexOf(Math.max(...outUp));
console.log("Facing UP. Output:", outUp, "Decision:", ["FORWARD", "RIGHT", "LEFT"][maxIdxUp]);
