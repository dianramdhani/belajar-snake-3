import React from 'react';
import { Card } from '../common/Card';
import { ScoreDisplay } from './ScoreDisplay';
import { GameStats } from './GameStats';

export const StatsPanel: React.FC = () => {
  return (
    <div className="space-y-4">
      <Card>
        <ScoreDisplay />
      </Card>
      <GameStats />
    </div>
  );
};
