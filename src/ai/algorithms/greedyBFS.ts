import type { Position } from '../../types/game';
import { manhattanDistance } from '../heuristics';

function toKey(p: Position): string {
  return `${p.x},${p.y}`;
}

export function greedyBFS(
  snake: Position[],
  food: Position,
  gridSize: number,
  obstacles: Position[]
): Position[] | null {
  const start = snake[0];
  const target = food;

  const queue: { position: Position; parent: Position | null }[] = [{
    position: start,
    parent: null,
  }];

  const visited = new Set<string>();
  const parent = new Map<string, Position | null>();

  visited.add(toKey(start));

  while (queue.length > 0) {
    // Sort by heuristic (greedy - closest to target first)
    queue.sort((a, b) => 
      manhattanDistance(a.position, target) - manhattanDistance(b.position, target)
    );

    const current = queue.shift()!;

    if (current.position.x === target.x && current.position.y === target.y) {
      // Reconstruct path
      const path: Position[] = [];
      let currNode: Position | null = current.position;
      while (currNode) {
        path.unshift(currNode);
        currNode = parent.get(toKey(currNode)) || null;
      }
      return path;
    }

    const neighbors: Position[] = [
      { x: current.position.x, y: current.position.y - 1 },
      { x: current.position.x, y: current.position.y + 1 },
      { x: current.position.x - 1, y: current.position.y },
      { x: current.position.x + 1, y: current.position.y },
    ].filter(p => {
      const isOutOfBounds = p.x < 0 || p.x >= gridSize || p.y < 0 || p.y >= gridSize;
      const isObstacle = obstacles.some(obs => obs.x === p.x && obs.y === p.y);
      const isVisited = visited.has(toKey(p));
      return !isOutOfBounds && !isObstacle && !isVisited;
    });

    for (const neighbor of neighbors) {
      const key = toKey(neighbor);
      visited.add(key);
      parent.set(key, current.position);
      queue.push({
        position: neighbor,
        parent: current.position,
      });
    }
  }

  return null;
}
