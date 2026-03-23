import React from 'react';
import { Card } from '../common/Card';
import { FPSMeter } from './FPSMeter';
import { usePerformanceStore } from '../../store/performanceStore';

export const PerformancePanel: React.FC = () => {
  const { aiComputeTime, memoryUsage } = usePerformanceStore();

  // Determine color based on AI compute time
  const getAIColor = () => {
    if (aiComputeTime < 5) return 'text-green-500';
    if (aiComputeTime < 10) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card title="Performance">
      <div className="space-y-4">
        <FPSMeter />
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">AI Compute Time</p>
          <p className={`text-lg font-bold ${getAIColor()}`}>
            {aiComputeTime.toFixed(2)}ms
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Memory Usage</p>
          <p className="text-lg font-semibold text-gray-300">
            {memoryUsage.toFixed(1)} MB
          </p>
        </div>
      </div>
    </Card>
  );
};
