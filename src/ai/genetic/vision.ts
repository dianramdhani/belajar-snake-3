import type { Position, Direction } from '../../types/game';

// Build the 24 inputs (8 directions relative to current heading, 3 checks: dist to food, wall, body)
export function getVision(snake: Position[], food: Position, direction: Direction, gridSize: number): number[] {
  const head = snake[0];
  const vision: number[] = [];

  // Map relative directions based on current heading
  // Order: Forward, Forward-Right, Right, Back-Right, Back, Back-Left, Left, Forward-Left
  let dirs: Position[] = [];

  switch (direction) {
    case 'UP':
      dirs = [
        { x: 0, y: -1 }, { x: 1, y: -1 }, { x: 1, y: 0 }, { x: 1, y: 1 },
        { x: 0, y: 1 }, { x: -1, y: 1 }, { x: -1, y: 0 }, { x: -1, y: -1 }
      ];
      break;
    case 'RIGHT':
      dirs = [
        { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }, { x: -1, y: 1 },
        { x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 }
      ];
      break;
    case 'DOWN':
      dirs = [
        { x: 0, y: 1 }, { x: -1, y: 1 }, { x: -1, y: 0 }, { x: -1, y: -1 },
        { x: 0, y: -1 }, { x: 1, y: -1 }, { x: 1, y: 0 }, { x: 1, y: 1 }
      ];
      break;
    case 'LEFT':
      dirs = [
        { x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 },
        { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }, { x: -1, y: 1 }
      ];
      break;
  }

  for (const dir of dirs) {
    let distWall = 0;
    let distFood = 0;
    let distBody = 0;
    
    let currX = head.x;
    let currY = head.y;
    
    let foundFood = false;
    let foundBody = false;

    let loops = 0;
    while (true) {
      if (loops++ > 100) throw new Error('Infinite loop in getVision');
      currX += dir.x;
      currY += dir.y;
      distWall++; // Increment distance

      // Hit wall
      if (currX < 0 || currX >= gridSize || currY < 0 || currY >= gridSize) {
        break;
      }

      // Check food (only record the first one found in this direction)
      if (!foundFood && currX === food.x && currY === food.y) {
        distFood = distWall;
        foundFood = true;
      }

      // Check body
      if (!foundBody && snake.some(s => s.x === currX && s.y === currY)) {
        distBody = distWall;
        foundBody = true;
      }
    }

    // Normalize values between 0 and 1
    // If found, 1 / dist (closer = higher value). If not found, 0.
    vision.push(
      1 / distWall,
      foundFood ? 1 / distFood : 0,
      foundBody ? 1 / distBody : 0
    );
  }

  return vision;
}
