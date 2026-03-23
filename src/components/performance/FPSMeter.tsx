import React from 'react';
import { usePerformanceStore } from '../../store/performanceStore';

export const FPSMeter: React.FC = () => {
  const { fps, frameTime } = usePerformanceStore();

  // Determine color based on FPS
  const getColor = () => {
    if (fps >= 55) return 'text-green-500';
    if (fps >= 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="flex items-center gap-4">
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">FPS</p>
        <p className={`text-lg font-bold ${getColor()}`}>{fps}</p>
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">Frame Time</p>
        <p className="text-lg font-semibold text-gray-300">{frameTime.toFixed(1)}ms</p>
      </div>
    </div>
  );
};
