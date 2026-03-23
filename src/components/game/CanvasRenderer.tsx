import { useEffect, useRef } from 'react';
import type { Position } from '../../types/game';

interface CanvasRendererProps {
  gridSize: number;
  cellSize: number;
  snake: Position[];
  food: Position;
  path: Position[] | null;
}

export const CanvasRenderer = ({
  gridSize,
  cellSize,
  snake,
  food,
  path,
}: CanvasRendererProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = gridSize * cellSize;
    const height = gridSize * cellSize;
    canvas.width = width;
    canvas.height = height;

    // Clear background
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 1;
    for (let i = 0; i <= gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, height);
      ctx.stroke();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(width, i * cellSize);
      ctx.stroke();
    }

    // Draw path if any
    if (path) {
      ctx.fillStyle = '#facc15';
      for (let i = 0; i < path.length; i++) {
        const p = path[i];
        const isHead = i === 1; // path[0] is current head position
        ctx.fillStyle = isHead ? '#fbbf24' : '#facc15';
        ctx.fillRect(
          p.x * cellSize + 2,
          p.y * cellSize + 2,
          cellSize - 4,
          cellSize - 4
        );
      }
    }

    // Draw food
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize * 0.4,
      0,
      2 * Math.PI
    );
    ctx.fill();

    // Draw snake
    snake.forEach((segment, idx) => {
      const isHead = idx === 0;
      ctx.fillStyle = isHead ? '#22d3ee' : '#3b82f6';
      
      // Draw rounded rectangle for snake segments
      const x = segment.x * cellSize;
      const y = segment.y * cellSize;
      const size = cellSize - 2;
      const radius = isHead ? 8 : 4;

      ctx.beginPath();
      ctx.roundRect(x + 1, y + 1, size, size, radius);
      ctx.fill();

      // Add glow effect to head
      if (isHead) {
        ctx.shadowColor = '#22d3ee';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw eyes
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(
          x + cellSize * 0.35,
          y + cellSize * 0.35,
          cellSize * 0.12,
          0,
          2 * Math.PI
        );
        ctx.arc(
          x + cellSize * 0.65,
          y + cellSize * 0.35,
          cellSize * 0.12,
          0,
          2 * Math.PI
        );
        ctx.fill();

        // Draw pupils
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(
          x + cellSize * 0.35,
          y + cellSize * 0.35,
          cellSize * 0.06,
          0,
          2 * Math.PI
        );
        ctx.arc(
          x + cellSize * 0.65,
          y + cellSize * 0.35,
          cellSize * 0.06,
          0,
          2 * Math.PI
        );
        ctx.fill();
      }
    });
  }, [gridSize, cellSize, snake, food, path]);

  return <canvas ref={canvasRef} className="rounded-lg shadow-2xl" />;
};
