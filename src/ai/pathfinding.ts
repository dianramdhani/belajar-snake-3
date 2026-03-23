import type { Position, AIAlgorithm } from '../types/game';
import type { PathfindingResult, PathfindingOptions } from './types';
import { bfs } from './algorithms/bfs';
import { aStar } from './algorithms/aStar';
import { greedyBFS } from './algorithms/greedyBFS';
import { greedyAStar } from './algorithms/greedyAStar';
import { enhancedSafetyCheck } from './safetyChecker';

export function findPath(
  algorithm: AIAlgorithm,
  options: PathfindingOptions
): PathfindingResult {
  const startTime = performance.now();

  let path: Position[] | null = null;

  switch (algorithm) {
    case 'bfs':
      path = bfs(options.snake, options.food, options.gridSize, options.obstacles);
      break;
    case 'aStar':
      path = aStar(options.snake, options.food, options.gridSize, options.obstacles);
      break;
    case 'greedyBFS':
      path = greedyBFS(options.snake, options.food, options.gridSize, options.obstacles);
      break;
    case 'greedyAStar':
      path = greedyAStar(options.snake, options.food, options.gridSize, options.obstacles);
      break;
    default:
      path = bfs(options.snake, options.food, options.gridSize, options.obstacles);
  }

  const computeTime = performance.now() - startTime;

  // Run safety check on the path
  if (path && path.length > 0) {
    const safetyResult = enhancedSafetyCheck(options.snake, path, options.gridSize);
    if (!safetyResult.isSafe && safetyResult.alternativePath) {
      path = safetyResult.alternativePath;
    }
  }

  return {
    path,
    visited: [], // Could track visited cells for visualization
    computeTime,
  };
}

export function getNextDirection(
  snake: Position[],
  path: Position[] | null
): Position | null {
  if (!path || path.length < 2) return null;

  const head = snake[0];
  const nextPosition = path[1]; // path[0] is current head position

  return {
    x: nextPosition.x - head.x,
    y: nextPosition.y - head.y,
  };
}

export { bfs } from './algorithms/bfs';
export { aStar } from './algorithms/aStar';
export { greedyBFS } from './algorithms/greedyBFS';
export { greedyAStar } from './algorithms/greedyAStar';
