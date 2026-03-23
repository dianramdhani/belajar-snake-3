import type { Position } from '../types/game';

export function generateFood(
  gridSize: number,
  snake: Position[]
): Position {
  const snakeSet = new Set(snake.map(p => `${p.x},${p.y}`));
  
  let food: Position;
  let attempts = 0;
  const maxAttempts = gridSize * gridSize;

  do {
    food = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    };
    attempts++;
  } while (snakeSet.has(`${food.x},${food.y}`) && attempts < maxAttempts);

  // If we couldn't find a spot (snake fills the grid), return a default position
  if (attempts >= maxAttempts) {
    // Find any empty cell
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        if (!snakeSet.has(`${x},${y}`)) {
          return { x, y };
        }
      }
    }
    // Grid is completely full (win condition)
    return { x: -1, y: -1 };
  }

  return food!;
}
