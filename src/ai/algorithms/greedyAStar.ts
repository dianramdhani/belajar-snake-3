import type { Position } from '../../types/game';
import { manhattanDistance } from '../heuristics';

interface Node {
  position: Position;
  gScore: number;
  fScore: number;
  parent: Position | null;
}

export function greedyAStar(
  snake: Position[],
  food: Position,
  gridSize: number,
  obstacles: Position[]
): Position[] | null {
  const start = snake[0];
  const target = food;

  // Greedy A* uses a higher weight on the heuristic
  const heuristicWeight = 2.0;

  const openSet: Node[] = [{
    position: start,
    gScore: 0,
    fScore: manhattanDistance(start, target) * heuristicWeight,
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
      const neighborKey = `${neighbor.x},${neighbor.y}`;
      const existingGScore = gScores.get(neighborKey) ?? Infinity;

      if (tentativeGScore < existingGScore) {
        gScores.set(neighborKey, tentativeGScore);
        const fScore = tentativeGScore + (manhattanDistance(neighbor, target) * heuristicWeight);
        
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
