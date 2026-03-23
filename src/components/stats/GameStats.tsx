import React from 'react';
import { useStatsStore } from '../../store/statsStore';
import { Card } from '../common/Card';

export const GameStats: React.FC = () => {
  const { totalGames, bestScore, avgScore, gamesPlayed } = useStatsStore();

  return (
    <Card title="Statistics">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Games Played</p>
          <p className="text-xl font-semibold text-white">{gamesPlayed}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total Games</p>
          <p className="text-xl font-semibold text-white">{totalGames}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Best Score</p>
          <p className="text-xl font-semibold text-yellow-500">{bestScore}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Avg Score</p>
          <p className="text-xl font-semibold text-purple-400">{Math.round(avgScore)}</p>
        </div>
      </div>
    </Card>
  );
};
