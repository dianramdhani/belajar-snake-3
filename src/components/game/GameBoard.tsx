import React, { useMemo } from 'react';
import { useGameStore } from '../../store/gameStore';
import { CanvasRenderer } from './CanvasRenderer';
import { GameOverlay } from './GameOverlay';

interface GameBoardProps {
  onStart: () => void;
  onResume: () => void;
  onReset: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  onStart,
  onResume,
  onReset,
}) => {
  const {
    snake,
    food,
    score,
    gridSize,
    isRunning,
    isPaused,
    gameOver,
    currentPath,
  } = useGameStore();

  // Calculate cell size based on container and grid size
  const containerSize = Math.min(600, window.innerWidth - 40);
  const cellSize = useMemo(
    () => Math.floor((containerSize - 40) / gridSize),
    [containerSize, gridSize]
  );

  return (
    <div className="relative inline-block">
      <div className="card p-2">
        <CanvasRenderer
          gridSize={gridSize}
          cellSize={cellSize}
          snake={snake}
          food={food}
          path={currentPath}
        />
      </div>
      <GameOverlay
        gameOver={gameOver}
        isPaused={isPaused}
        isRunning={isRunning}
        score={score}
        onStart={onStart}
        onResume={onResume}
        onReset={onReset}
      />
    </div>
  );
};
