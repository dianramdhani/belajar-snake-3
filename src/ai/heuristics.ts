import type { Position } from '../types/game';

export const manhattanDistance = (a: Position, b: Position): number =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

export const euclideanDistance = (a: Position, b: Position): number =>
  Math.hypot(a.x - b.x, a.y - b.y);

export const chebyshevDistance = (a: Position, b: Position): number =>
  Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
