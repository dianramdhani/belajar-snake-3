import type { Position } from '../types/game';

export interface PathfindingResult {
  path: Position[] | null;
  visited: Position[];
  computeTime: number;
}

export interface PathfindingOptions {
  snake: Position[];
  food: Position;
  gridSize: number;
  obstacles: Position[];
}

export interface SafetyCheckResult {
  isSafe: boolean;
  dangerLevel: 'safe' | 'caution' | 'dangerous';
  alternativePath?: Position[];
}
