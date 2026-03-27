import { NeuralNetwork } from './NeuralNetwork';
import { HeadlessGame } from './HeadlessGame';

export interface GATrainingOptions {
  populationSize: number;
  mutationRate: number;
  layers: number[];
  gridSize: number;
}

export class GeneticAlgorithm {
  population: NeuralNetwork[];
  fitnessScores: number[];
  options: GATrainingOptions;
  generation: number;

  bestNetwork: NeuralNetwork | null;
  bestFitness: number;

  constructor(options: GATrainingOptions) {
    this.options = options;
    this.population = [];
    this.fitnessScores = new Array(options.populationSize).fill(0);
    this.generation = 1;
    this.bestNetwork = null;
    this.bestFitness = -1;

    // Initialize population
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
      // Run the network in 3 headless games to reduce noise/luck
      let totalFitness = 0;
      for (let j = 0; j < 3; j++) {
        const game = new HeadlessGame(this.options.gridSize, network);
        totalFitness += game.run();
      }
      
      const fitness = totalFitness / 3;

      this.fitnessScores[i] = fitness;

      if (fitness > currentBestFitness) {
        currentBestFitness = fitness;
        currentBestNetwork = network;
      }
    }

    if (currentBestFitness > this.bestFitness && currentBestNetwork) {
      this.bestFitness = currentBestFitness;
      // Deep copy best network to prevent mutation
      this.bestNetwork = new NeuralNetwork([...currentBestNetwork.layers]);
      this.bestNetwork.loadWeights(currentBestNetwork.exportWeights());
    }
  }

  // Select a parent based on fitness (Roulette Wheel Selection)
  selectParent(): NeuralNetwork {
    const totalFitness = this.fitnessScores.reduce((sum, f) => sum + f, 0);
    if (totalFitness === 0) {
      // If all failed, pick random
      return this.population[Math.floor(Math.random() * this.population.length)];
    }

    const threshold = Math.random() * totalFitness;
    let currentSum = 0;

    for (let i = 0; i < this.population.length; i++) {
      currentSum += this.fitnessScores[i];
      if (currentSum >= threshold) {
        return this.population[i];
      }
    }

    // Fallback
    return this.population[this.population.length - 1];
  }

  // Create the next generation
  nextGeneration() {
    this.evaluatePopulation();

    const newPopulation: NeuralNetwork[] = [];

    // Elitism: keep the absolute best from all time
    if (this.bestNetwork) {
      const elite = new NeuralNetwork([...this.bestNetwork.layers]);
      elite.loadWeights(this.bestNetwork.exportWeights());
      newPopulation.push(elite);
    }

    // Fill the rest of the population
    while (newPopulation.length < this.options.populationSize) {
      const parentA = this.selectParent();
      const parentB = this.selectParent();

      const child = parentA.crossover(parentB);
      child.mutate(this.options.mutationRate);

      newPopulation.push(child);
    }

    this.population = newPopulation;
    this.generation++;
  }
}
