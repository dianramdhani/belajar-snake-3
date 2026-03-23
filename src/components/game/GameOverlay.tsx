import React from 'react';
import { Button } from '../common/Button';

interface GameOverlayProps {
  gameOver: boolean;
  isPaused: boolean;
  isRunning: boolean;
  score: number;
  onStart: () => void;
  onResume: () => void;
  onReset: () => void;
}

export const GameOverlay: React.FC<GameOverlayProps> = ({
  gameOver,
  isPaused,
  isRunning,
  score,
  onStart,
  onResume,
  onReset,
}) => {
  if (!gameOver && isRunning && !isPaused) {
    return null;
  }

  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center rounded-lg">
      <div className="text-center space-y-4 p-6">
        {gameOver ? (
          <>
            <h2 className="text-3xl font-bold text-red-500">Game Over!</h2>
            <p className="text-xl text-gray-300">Score: {score}</p>
            <div className="flex gap-3 justify-center">
              <Button variant="success" onClick={onStart}>
                Play Again
              </Button>
              <Button variant="secondary" onClick={onReset}>
                Reset
              </Button>
            </div>
          </>
        ) : isPaused ? (
          <>
            <h2 className="text-3xl font-bold text-yellow-500">Paused</h2>
            <p className="text-xl text-gray-300">Score: {score}</p>
            <div className="flex gap-3 justify-center">
              <Button variant="success" onClick={onResume}>
                Resume
              </Button>
              <Button variant="secondary" onClick={onReset}>
                Reset
              </Button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-purple-400">Snake AI</h2>
            <p className="text-gray-400">Watch the AI play Snake!</p>
            <Button variant="success" onClick={onStart}>
              Start Game
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
