import { useCallback } from 'react';
import type { Position, AIAlgorithm } from '../types/game';
import { findPath, getNextDirection } from '../ai/pathfinding';
import { getObstacles } from '../game/grid-utils';
import { usePerformanceStore } from '../store/performanceStore';

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

  const getNextMove = useCallback(() => {
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

    return getNextDirection(snake, result.path);
  }, [algorithm, snake, food, gridSize, updateAIComputeTime]);

  // Get current path for visualization
  const currentPath = useCallback((): Position[] | null => {
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
