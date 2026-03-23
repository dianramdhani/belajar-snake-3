import type { Position } from '../../types/game';
import { manhattanDistance } from '../heuristics';

interface Node {
  position: Position;
  gScore: number;
  fScore: number;
}

export function aStar(
  snake: Position[],
  food: Position,
  gridSize: number,
  obstacles: Position[]
): Position[] | null {
  const start = snake[0];
  const target = food;

  // Use a Map to track parents separately
  const parentMap = new Map<string, Position | null>();
  parentMap.set(`${start.x},${start.y}`, null);

  const openSet: Node[] = [{
    position: start,
    gScore: 0,
    fScore: manhattanDistance(start, target),
  }];

  const closedSet = new Set<string>();
  const gScores = new Map<string, number>();
  gScores.set(`${start.x},${start.y}`, 0);

  while (openSet.length > 0) {
    // Get node with lowest fScore
    openSet.sort((a, b) => a.fScore - b.fScore);
    const current = openSet.shift()!;
    const currentKey = `${current.position.x},${current.position.y}`;

    if (current.position.x === target.x && current.position.y === target.y) {
      // Reconstruct path using parentMap
      const path: Position[] = [];
      let curr: Position | null = current.position;
      while (curr !== null) {
        path.unshift(curr);
        curr = parentMap.get(`${curr.x},${curr.y}`) || null;
      }
      return path;
    }

    closedSet.add(currentKey);

    const neighbors: Position[] = [
      { x: current.position.x, y: current.position.y - 1 },
      { x: current.position.x, y: current.position.y + 1 },
      { x: current.position.x - 1, y: current.position.y },
      { x: current.position.x + 1, y: current.position.y },
    ].filter(p => {
      const isOutOfBounds = p.x < 0 || p.x >= gridSize || p.y < 0 || p.y >= gridSize;
      const isObstacle = obstacles.some(obs => obs.x === p.x && obs.y === p.y);
      const isClosed = closedSet.has(`${p.x},${p.y}`);
      return !isOutOfBounds && !isObstacle && !isClosed;
    });

    for (const neighbor of neighbors) {
      const tentativeGScore = current.gScore + 1;
      const neighborKey = `${neighbor.x},${neighbor.y}`;
      const existingGScore = gScores.get(neighborKey) ?? Infinity;

      if (tentativeGScore < existingGScore) {
        gScores.set(neighborKey, tentativeGScore);
        const fScore = tentativeGScore + manhattanDistance(neighbor, target);

        // Update parent in parentMap
        parentMap.set(neighborKey, current.position);

        const existingNodeIndex = openSet.findIndex(n => n.position.x === neighbor.x && n.position.y === neighbor.y);
        if (existingNodeIndex !== -1) {
          openSet[existingNodeIndex].gScore = tentativeGScore;
          openSet[existingNodeIndex].fScore = fScore;
        } else {
          openSet.push({
            position: neighbor,
            gScore: tentativeGScore,
            fScore,
          });
        }
      }
    }
  }

  return null;
}
