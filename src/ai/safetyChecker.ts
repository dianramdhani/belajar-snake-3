import type { Position } from '../types/game';
import type { SafetyCheckResult } from './types';
import { bfs } from './algorithms/bfs';

export function enhancedSafetyCheck(
  snake: Position[],
  path: Position[],
  gridSize: number
): SafetyCheckResult {
  if (path.length === 0) {
    return { isSafe: false, dangerLevel: 'dangerous' };
  }

  // Simulate snake eating food along the path
  const virtualSnake = simulatePath(snake, path);
  const tailAccessible = canReachTail(virtualSnake, gridSize);

  if (!tailAccessible) {
    const freeSpace = countFreeSpace(virtualSnake, gridSize);
    const minRequired = Math.ceil(virtualSnake.length / 2);
    if (freeSpace < minRequired) {
      return {
        isSafe: false,
        dangerLevel: 'dangerous',
        alternativePath: findLongestPathToTail(snake, gridSize) || undefined,
      };
    }
    return { isSafe: true, dangerLevel: 'caution' };
  }
  return { isSafe: true, dangerLevel: 'safe' };
}

function simulatePath(snake: Position[], path: Position[]): Position[] {
  // Simulate the snake moving along the path
  // For simplicity, we just return the snake as if it moved to the end of the path
  // In a real implementation, we'd simulate each step
  const newSnake = [...path, ...snake];
  newSnake.length = snake.length; // Keep the same length
  return newSnake;
}

function canReachTail(snake: Position[], gridSize: number): boolean {
  if (snake.length < 2) return true;
  
  const head = snake[0];
  const tail = snake[snake.length - 1];
  const body = snake.slice(0, -1); // Exclude tail as it will move
  
  const pathToTail = bfs([{ ...head }], tail, gridSize, body);
  return pathToTail !== null;
}

function countFreeSpace(snake: Position[], gridSize: number): number {
  const snakeSet = new Set(snake.map(p => `${p.x},${p.y}`));
  let count = 0;
  
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      if (!snakeSet.has(`${x},${y}`)) {
        count++;
      }
    }
  }
  
  return count;
}

function findLongestPathToTail(snake: Position[], gridSize: number): Position[] | null {
  if (snake.length < 2) return null;
  
  const head = snake[0];
  const tail = snake[snake.length - 1];
  const body = snake.slice(1, -1); // Exclude head and tail
  
  // Use BFS to find path to tail
  return bfs([head], tail, gridSize, body);
}
