import type { Position } from '../../types/game';

function toKey(p: Position): string {
  return `${p.x},${p.y}`;
}

export function bfs(
  snake: Position[],
  food: Position,
  gridSize: number,
  obstacles: Position[]
): Position[] | null {
  const start = snake[0];
  const target = food;
  const queue: Position[] = [start];
  const visited = new Set<string>();
  const parent = new Map<string, Position | null>();

  visited.add(toKey(start));

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.x === target.x && current.y === target.y) {
      // Reconstruct path
      const path: Position[] = [];
      let currNode: Position | null = current;
      while (currNode) {
        path.unshift(currNode);
        currNode = parent.get(toKey(currNode)) || null;
      }
      return path;
    }

    // Neighbors: up, down, left, right
    const neighbors: Position[] = [
      { x: current.x, y: current.y - 1 },
      { x: current.x, y: current.y + 1 },
      { x: current.x - 1, y: current.y },
      { x: current.x + 1, y: current.y },
    ].filter(p => {
      const isOutOfBounds = p.x < 0 || p.x >= gridSize || p.y < 0 || p.y >= gridSize;
      const isObstacle = obstacles.some(obs => obs.x === p.x && obs.y === p.y);
      const isVisited = visited.has(toKey(p));
      return !isOutOfBounds && !isObstacle && !isVisited;
    });

    for (const neighbor of neighbors) {
      const key = toKey(neighbor);
      visited.add(key);
      parent.set(key, current);
      queue.push(neighbor);
    }
  }
  return null;
}
