import type { Position } from '../../types/game';
import { manhattanDistance } from '../heuristics';

interface Node {
  position: Position;
  gScore: number;
  fScore: number;
  parent: Position | null;
}

export function aStar(
  snake: Position[],
  food: Position,
  gridSize: number,
  obstacles: Position[]
): Position[] | null {
  const start = snake[0];
  const target = food;

  const openSet: Node[] = [{
    position: start,
    gScore: 0,
    fScore: manhattanDistance(start, target),
    parent: null,
  }];

  const closedSet = new Set<string>();
  const gScores = new Map<string, number>();
  gScores.set(`${start.x},${start.y}`, 0);

  while (openSet.length > 0) {
    // Get node with lowest fScore
    openSet.sort((a, b) => a.fScore - b.fScore);
    const current = openSet.shift()!;

    if (current.position.x === target.x && current.position.y === target.y) {
      // Reconstruct path
      const path: Position[] = [];
      path.unshift(current.position);
      
      // Trace back through parents
      let parent: Position | null = current.parent;
      while (parent) {
        path.unshift(parent);
        const parentNode = openSet.find(n => n.position.x === parent!.x && n.position.y === parent!.y);
        if (parentNode && parentNode.parent) {
          parent = parentNode.parent;
        } else {
          break;
        }
      }
      return path;
    }

    closedSet.add(`${current.position.x},${current.position.y}`);

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
      const nKey = `${neighbor.x},${neighbor.y}`;
      const existingGScore = gScores.get(nKey) ?? Infinity;

      if (tentativeGScore < existingGScore) {
        gScores.set(nKey, tentativeGScore);
        const fScore = tentativeGScore + manhattanDistance(neighbor, target);
        
        const existingNode = openSet.find(n => n.position.x === neighbor.x && n.position.y === neighbor.y);
        if (existingNode) {
          existingNode.gScore = tentativeGScore;
          existingNode.fScore = fScore;
          existingNode.parent = current.position;
        } else {
          openSet.push({
            position: neighbor,
            gScore: tentativeGScore,
            fScore,
            parent: current.position,
          });
        }
      }
    }
  }

  return null;
}
