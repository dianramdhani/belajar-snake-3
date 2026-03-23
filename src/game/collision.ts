import type { Position } from '../types/game';

export function checkCollision(
  head: Position,
  snake: Position[],
  gridSize: number
): boolean {
  // Check wall collision
  if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
    return true;
  }

  // Check self collision (exclude head)
  for (let i = 0; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }

  return false;
}

export function checkFoodCollision(head: Position, food: Position): boolean {
  return head.x === food.x && head.y === food.y;
}
