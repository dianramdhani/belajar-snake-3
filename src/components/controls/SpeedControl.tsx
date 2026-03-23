import React from 'react';
import { Slider } from '../common/Slider';
import { MIN_SPEED, MAX_SPEED } from '../../game/constants';

interface SpeedControlProps {
  speed: number;
  onChange: (speed: number) => void;
  disabled?: boolean;
}

export const SpeedControl: React.FC<SpeedControlProps> = ({
  speed,
  onChange,
  disabled = false,
}) => {
  // Convert speed (ms per tick) to a more intuitive "speed" value
  const displaySpeed = Math.round((1 - (speed - MIN_SPEED) / (MAX_SPEED - MIN_SPEED)) * 100);

  return (
    <Slider
      label="Game Speed"
      value={displaySpeed}
      min={0}
      max={100}
      step={10}
      onChange={(value) => {
        // Convert display speed back to ms per tick
        const ms = MAX_SPEED - (value / 100) * (MAX_SPEED - MIN_SPEED);
        onChange(Math.round(ms));
      }}
      disabled={disabled}
    />
  );
};
