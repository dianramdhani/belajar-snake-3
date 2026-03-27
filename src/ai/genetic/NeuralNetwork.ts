import type { NeuralNetworkWeights } from '../../types/game';

export class NeuralNetwork {
  layers: number[];
  weights: number[][][]; // weights[layer][node][prevNode]
  biases: number[][]; // biases[layer][node]

  constructor(layerSizes: number[]) {
    this.layers = layerSizes;
    this.weights = [];
    this.biases = [];

    // Initialize weights and biases randomly between -1 and 1
    // Note: layers[0] is the input layer, it doesn't have weights/biases towards it
    for (let i = 1; i < this.layers.length; i++) {
      const prevNodes = this.layers[i - 1];
      const currentNodes = this.layers[i];
      
      const layerWeights: number[][] = [];
      const layerBiases: number[] = [];

      for (let j = 0; j < currentNodes; j++) {
        const nodeWeights: number[] = [];
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
  loadWeights(savedWeights: NeuralNetworkWeights) {
    this.weights = savedWeights.layers;
    this.biases = savedWeights.biases;
  }

  // Export current weights
  exportWeights(): NeuralNetworkWeights {
    return {
      layers: this.weights,
      biases: this.biases,
    };
  }

  // Sigmoid activation function
  private activate(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }

  // Predict output based on inputs
  predict(inputs: number[]): number[] {
    if (inputs.length !== this.layers[0]) {
      throw new Error(`Expected ${this.layers[0]} inputs, got ${inputs.length}`);
    }

    let currentOutputs = [...inputs];

    // Propagate forward through each layer
    for (let i = 0; i < this.weights.length; i++) { // this.weights.length is layers.length - 1
      const nextOutputs: number[] = [];
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
  mutate(mutationRate: number) {
    // Mutate weights
    for (let i = 0; i < this.weights.length; i++) {
      for (let j = 0; j < this.weights[i].length; j++) {
        for (let k = 0; k < this.weights[i][j].length; k++) {
          if (Math.random() < mutationRate) {
            // Apply small random adjustment (-0.5 to 0.5) instead of full reset
            this.weights[i][j][k] += (Math.random() * 2 - 1) * 0.5;
            // Clamp between -1 and 1 (optional, depends on design, but good practice to keep them bounded)
            this.weights[i][j][k] = Math.max(-1, Math.min(1, this.weights[i][j][k]));
          }
        }
      }
    }

    // Mutate biases
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
  crossover(partner: NeuralNetwork): NeuralNetwork {
    const child = new NeuralNetwork([...this.layers]);
    
    // Crossover weights
    for (let i = 0; i < this.weights.length; i++) {
      for (let j = 0; j < this.weights[i].length; j++) {
        for (let k = 0; k < this.weights[i][j].length; k++) {
          // 50% chance to inherit from partner
          child.weights[i][j][k] = Math.random() < 0.5 ? this.weights[i][j][k] : partner.weights[i][j][k];
        }
      }
    }

    // Crossover biases
    for (let i = 0; i < this.biases.length; i++) {
      for (let j = 0; j < this.biases[i].length; j++) {
        child.biases[i][j] = Math.random() < 0.5 ? this.biases[i][j] : partner.biases[i][j];
      }
    }

    return child;
  }
}
