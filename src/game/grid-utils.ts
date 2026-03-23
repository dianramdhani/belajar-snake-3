import type { Position, Direction } from '../types/game';

export function getDirectionFromDelta(delta: Position): Direction | null {
  if (delta.x === 1) return 'RIGHT';
  if (delta.x === -1) return 'LEFT';
  if (delta.y === 1) return 'DOWN';
  if (delta.y === -1) return 'UP';
  return null;
}

export function getOppositeDirection(direction: Direction): Direction {
  switch (direction) {
    case 'UP':
      return 'DOWN';
    case 'DOWN':
      return 'UP';
    case 'LEFT':
      return 'RIGHT';
    case 'RIGHT':
      return 'LEFT';
  }
}

export function isValidDirectionChange(
  current: Direction,
  next: Direction
): boolean {
  return getOppositeDirection(current) !== next;
}

export function moveSnake(
  snake: Position[],
  direction: Direction,
  grow: boolean
): Position[] {
  const head = snake[0];
  let newHead: Position;

  switch (direction) {
    case 'UP':
      newHead = { x: head.x, y: head.y - 1 };
      break;
    case 'DOWN':
      newHead = { x: head.x, y: head.y + 1 };
      break;
    case 'LEFT':
      newHead = { x: head.x - 1, y: head.y };
      break;
    case 'RIGHT':
      newHead = { x: head.x + 1, y: head.y };
      break;
  }

  const newSnake = [newHead, ...snake];
  if (!grow) {
    newSnake.pop();
  }

  return newSnake;
}

export function getObstacles(snake: Position[]): Position[] {
  // All body parts except head are obstacles
  return snake.slice(1);
}
