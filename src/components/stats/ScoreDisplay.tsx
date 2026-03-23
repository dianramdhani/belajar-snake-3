import React from 'react';
import { useGameStore } from '../../store/gameStore';

export const ScoreDisplay: React.FC = () => {
  const { score, highScore } = useGameStore();

  return (
    <div className="flex justify-between items-center">
      <div className="text-center">
        <p className="text-xs text-gray-500 uppercase tracking-wide">Score</p>
        <p className="text-2xl font-bold text-white">{score}</p>
      </div>
      <div className="text-center">
        <p className="text-xs text-gray-500 uppercase tracking-wide">Best</p>
        <p className="text-2xl font-bold text-yellow-500">{highScore}</p>
      </div>
    </div>
  );
};
