export type Position = { x: number; y: number };
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type AIAlgorithm = 'bfs' | 'aStar' | 'greedyBFS' | 'greedyAStar' | 'genetic';

export interface NeuralNetworkWeights {
  layers: number[][][]; // Array of hidden/output layers, containing array of neurons, containing array of weights
  biases: number[][];   // Array of hidden/output layers, containing array of biases
}

export interface GameState {
  snake: Position[];
  direction: Direction;
  food: Position;
  score: number;
  highScore: number;
  isRunning: boolean;
  isPaused: boolean;
  gameOver: boolean;
  speed: number; // ms per tick
  gridSize: number; // e.g. 20x20
  algorithm: AIAlgorithm;
  currentPath: Position[] | null;
  bestWeights: NeuralNetworkWeights | null;
}

export interface StatsState {
  totalGames: number;
  bestScore: number;
  totalScore: number;
  avgScore: number;
  gamesPlayed: number;
  bestWeights: NeuralNetworkWeights | null;
}

export interface PerformanceState {
  fps: number;
  aiComputeTime: number;
  memoryUsage: number;
  frameTime: number;
}
