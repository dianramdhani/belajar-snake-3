export type Position = { x: number; y: number };
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type AIAlgorithm = 'bfs' | 'aStar' | 'greedyBFS' | 'greedyAStar';

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
}

export interface StatsState {
  totalGames: number;
  bestScore: number;
  totalScore: number;
  avgScore: number;
  gamesPlayed: number;
}

export interface PerformanceState {
  fps: number;
  aiComputeTime: number;
  memoryUsage: number;
  frameTime: number;
}
