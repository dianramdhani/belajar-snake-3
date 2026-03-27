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

// src/game/collision.ts
function checkCollision(head, snake, gridSize) {
  if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
    return true;
  }
  for (let i = 0; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }
  return false;
}
function checkFoodCollision(head, food) {
  return head.x === food.x && head.y === food.y;
}

// src/game/food-generator.ts
function generateFood(gridSize, snake) {
  const snakeSet = new Set(snake.map((p) => `${p.x},${p.y}`));
  let food;
  let attempts = 0;
  const maxAttempts = gridSize * gridSize;
  do {
    food = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    };
    attempts++;
  } while (snakeSet.has(`${food.x},${food.y}`) && attempts < maxAttempts);
  if (attempts >= maxAttempts) {
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        if (!snakeSet.has(`${x},${y}`)) {
          return { x, y };
        }
      }
    }
    return { x: -1, y: -1 };
  }
  return food;
}

// src/game/grid-utils.ts
function moveSnake(snake, direction, grow) {
  const head = snake[0];
  let newHead;
  switch (direction) {
    case "UP":
      newHead = { x: head.x, y: head.y - 1 };
      break;
    case "DOWN":
      newHead = { x: head.x, y: head.y + 1 };
      break;
    case "LEFT":
      newHead = { x: head.x - 1, y: head.y };
      break;
    case "RIGHT":
      newHead = { x: head.x + 1, y: head.y };
      break;
  }
  const newSnake = [newHead, ...snake];
  if (!grow) {
    newSnake.pop();
  }
  return newSnake;
}

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

// src/ai/genetic/HeadlessGame.ts
var HeadlessGame = class {
  gridSize;
  network;
  snake;
  food;
  direction;
  score;
  lifespan;
  maxLifespan;
  stepsSinceLastFood;
  constructor(gridSize, network) {
    this.gridSize = gridSize;
    this.network = network;
    this.snake = [{ x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2) }];
    this.food = generateFood(gridSize, this.snake);
    this.direction = "RIGHT";
    this.score = 0;
    this.lifespan = 0;
    this.maxLifespan = gridSize * gridSize * 2;
    this.stepsSinceLastFood = 0;
  }
  // Run a single simulation until the snake dies
  run() {
    let loops = 0;
    while (this.lifespan < this.maxLifespan && this.stepsSinceLastFood < 200) {
      if (loops++ > 2e3) throw new Error("Infinite loop in HeadlessGame run()");
      const vision = getVision(this.snake, this.food, this.direction, this.gridSize);
      const output = this.network.predict(vision);
      let maxIdx = 0;
      for (let i = 1; i < output.length; i++) {
        if (output[i] > output[maxIdx]) {
          maxIdx = i;
        }
      }
      let newDir = this.direction;
      if (maxIdx === 1) {
        const rightTurns = { "UP": "RIGHT", "RIGHT": "DOWN", "DOWN": "LEFT", "LEFT": "UP" };
        newDir = rightTurns[this.direction];
      } else if (maxIdx === 2) {
        const leftTurns = { "UP": "LEFT", "LEFT": "DOWN", "DOWN": "RIGHT", "RIGHT": "UP" };
        newDir = leftTurns[this.direction];
      }
      this.direction = newDir;
      const actualDelta = {
        "UP": { x: 0, y: -1 },
        "DOWN": { x: 0, y: 1 },
        "LEFT": { x: -1, y: 0 },
        "RIGHT": { x: 1, y: 0 }
      }[this.direction];
      const newHead = {
        x: this.snake[0].x + actualDelta.x,
        y: this.snake[0].y + actualDelta.y
      };
      if (checkCollision(newHead, this.snake, this.gridSize)) {
        break;
      }
      const willEatFood = checkFoodCollision(newHead, this.food);
      this.snake = moveSnake(this.snake, this.direction, willEatFood);
      this.lifespan++;
      this.stepsSinceLastFood++;
      if (willEatFood) {
        this.score++;
        this.stepsSinceLastFood = 0;
        this.food = generateFood(this.gridSize, this.snake);
      }
    }
    return this.lifespan + (Math.pow(2, this.score) + Math.pow(this.score, 2.1) * 500) - Math.pow(this.score, 1.2) * Math.pow(0.25 * this.lifespan, 1.3);
  }
};

// src/ai/genetic/GeneticAlgorithm.ts
var GeneticAlgorithm = class {
  population;
  fitnessScores;
  options;
  generation;
  bestNetwork;
  bestFitness;
  constructor(options) {
    this.options = options;
    this.population = [];
    this.fitnessScores = new Array(options.populationSize).fill(0);
    this.generation = 1;
    this.bestNetwork = null;
    this.bestFitness = -1;
    for (let i = 0; i < options.populationSize; i++) {
      this.population.push(new NeuralNetwork(options.layers));
    }
  }
  // Evaluate the entire population
  evaluatePopulation() {
    this.fitnessScores = [];
    let currentBestFitness = -1;
    let currentBestNetwork = null;
    for (let i = 0; i < this.population.length; i++) {
      const network = this.population[i];
      const game = new HeadlessGame(this.options.gridSize, network);
      const fitness = game.run();
      this.fitnessScores[i] = fitness;
      if (fitness > currentBestFitness) {
        currentBestFitness = fitness;
        currentBestNetwork = network;
      }
    }
    if (currentBestFitness > this.bestFitness && currentBestNetwork) {
      this.bestFitness = currentBestFitness;
      this.bestNetwork = new NeuralNetwork([...currentBestNetwork.layers]);
      this.bestNetwork.loadWeights(currentBestNetwork.exportWeights());
    }
  }
  // Select a parent based on fitness (Roulette Wheel Selection)
  selectParent() {
    const totalFitness = this.fitnessScores.reduce((sum, f) => sum + f, 0);
    if (totalFitness === 0) {
      return this.population[Math.floor(Math.random() * this.population.length)];
    }
    let threshold = Math.random() * totalFitness;
    let currentSum = 0;
    for (let i = 0; i < this.population.length; i++) {
      currentSum += this.fitnessScores[i];
      if (currentSum >= threshold) {
        return this.population[i];
      }
    }
    return this.population[this.population.length - 1];
  }
  // Create the next generation
  nextGeneration() {
    this.evaluatePopulation();
    const newPopulation = [];
    if (this.bestNetwork) {
      const elite = new NeuralNetwork([...this.bestNetwork.layers]);
      elite.loadWeights(this.bestNetwork.exportWeights());
      newPopulation.push(elite);
    }
    while (newPopulation.length < this.options.populationSize) {
      const parentA = this.selectParent();
      const parentB = this.selectParent();
      let child = parentA.crossover(parentB);
      child.mutate(this.options.mutationRate);
      newPopulation.push(child);
    }
    this.population = newPopulation;
    this.generation++;
  }
};

// src/ai/genetic/test-nn-quick.ts
console.log("--- Quick Test ---");
try {
  const ga = new GeneticAlgorithm({
    populationSize: 5,
    mutationRate: 0.1,
    layers: [24, 16, 16, 3],
    gridSize: 20
  });
  console.log("Evaluating population...");
  let i = 0;
  for (const nn of ga.population) {
    console.log(`Evaluating NN ${i++}`);
    const game = new HeadlessGame(20, nn);
    game.run();
    console.log(`Finished NN ${i - 1}, Lifespan: ${game.lifespan}, Score: ${game.score}`);
  }
} catch (err) {
  console.error("ERROR CAUGHT:");
  console.error(err);
}
console.log("Done.");
