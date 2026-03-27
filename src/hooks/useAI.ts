import { useCallback } from 'react';
import type { Position, AIAlgorithm, Direction } from '../types/game';
import { findPath, getNextDirection } from '../ai/pathfinding';
import { getObstacles } from '../game/grid-utils';
import { usePerformanceStore } from '../store/performanceStore';
import { useGameStore } from '../store/gameStore';
import { NeuralNetwork } from '../ai/genetic/NeuralNetwork';
import { getVision } from '../ai/genetic/vision';

interface UseAIOptions {
  algorithm: AIAlgorithm;
  snake: Position[];
  food: Position;
  gridSize: number;
}

interface UseAIReturn {
  getNextMove: () => Position | null;
  currentPath: Position[] | null;
  computeTime: number;
}

export function useAI({
  algorithm,
  snake,
  food,
  gridSize,
}: UseAIOptions): UseAIReturn {
  const updateAIComputeTime = usePerformanceStore((state) => state.updateAIComputeTime);
  const bestWeights = useGameStore((state) => state.bestWeights);
  const direction = useGameStore((state) => state.direction);

  const getNextMove = useCallback(() => {
    const startTime = performance.now();

    if (algorithm === 'genetic') {
      if (!bestWeights) {
        console.warn('No trained genetic model found. Using fallback survival moves.');
        // Fallback to emergency mode if no weights loaded yet
        return emergencyFallback(snake, gridSize);
      }

      const nn = new NeuralNetwork([24, 16, 16, 3]);
      nn.loadWeights(bestWeights);

      const vision = getVision(snake, food, direction, gridSize);
      const output = nn.predict(vision);

      // Output mapping: [FORWARD, RIGHT, LEFT]
      let maxIdx = 0;
      for (let i = 1; i < output.length; i++) {
        if (output[i] > output[maxIdx]) {
          maxIdx = i;
        }
      }

      let newDir = direction;
      if (maxIdx === 1) { // Turn Right
        const rightTurns: Record<Direction, Direction> = { 'UP': 'RIGHT', 'RIGHT': 'DOWN', 'DOWN': 'LEFT', 'LEFT': 'UP' };
        newDir = rightTurns[direction];
      } else if (maxIdx === 2) { // Turn Left
        const leftTurns: Record<Direction, Direction> = { 'UP': 'LEFT', 'LEFT': 'DOWN', 'DOWN': 'RIGHT', 'RIGHT': 'UP' };
        newDir = leftTurns[direction];
      }

      const delta = {
        'UP': { x: 0, y: -1 },
        'DOWN': { x: 0, y: 1 },
        'LEFT': { x: -1, y: 0 },
        'RIGHT': { x: 1, y: 0 },
      }[newDir];

      updateAIComputeTime(performance.now() - startTime);
      return delta;
    }

    const obstacles = getObstacles(snake);

    const result = findPath(algorithm, {
      snake,
      food,
      gridSize,
      obstacles,
    });

    updateAIComputeTime(result.computeTime);

    if (!result.path || result.path.length === 0) {
      // No path found - try survival mode (find path to tail)
      const tail = snake[snake.length - 1];
      const survivalResult = findPath(algorithm, {
        snake,
        food: tail,
        gridSize,
        obstacles: snake.slice(1, -1),
      });

      if (survivalResult.path && survivalResult.path.length > 1) {
        return getNextDirection(snake, survivalResult.path);
      }

      // Emergency mode - just pick any valid move
      return emergencyFallback(snake, gridSize);
    }

    return getNextDirection(snake, result.path);
  }, [algorithm, snake, food, gridSize, updateAIComputeTime, bestWeights, direction]);

  // Get current path for visualization
  const currentPath = useCallback((): Position[] | null => {
    if (algorithm === 'genetic') return null; // Genetic doesn't produce paths

    const obstacles = getObstacles(snake);
    const result = findPath(algorithm, {
      snake,
      food,
      gridSize,
      obstacles,
    });
    return result.path;
  }, [algorithm, snake, food, gridSize]);

  // Get current compute time
  const computeTime = usePerformanceStore((state) => state.aiComputeTime);

  return {
    getNextMove,
    currentPath: currentPath(),
    computeTime,
  };
}

// Extracted emergency fallback logic
function emergencyFallback(snake: Position[], gridSize: number): Position | null {
  const head = snake[0];
  const moves: Position[] = [
    { x: 0, y: -1 }, // UP
    { x: 0, y: 1 },  // DOWN
    { x: -1, y: 0 }, // LEFT
    { x: 1, y: 0 },  // RIGHT
  ];

  for (const move of moves) {
    const newHead = { x: head.x + move.x, y: head.y + move.y };
    const isValid =
      newHead.x >= 0 &&
      newHead.x < gridSize &&
      newHead.y >= 0 &&
      newHead.y < gridSize &&
      !snake.some((s) => s.x === newHead.x && s.y === newHead.y);

    if (isValid) {
      return move;
    }
  }

  return null;
}
