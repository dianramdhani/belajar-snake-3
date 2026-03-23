import React from 'react';
import { Slider } from '../common/Slider';
import { MIN_GRID_SIZE, MAX_GRID_SIZE } from '../../game/constants';

interface GridSizeControlProps {
  gridSize: number;
  onChange: (size: number) => void;
  disabled?: boolean;
}

export const GridSizeControl: React.FC<GridSizeControlProps> = ({
  gridSize,
  onChange,
  disabled = false,
}) => {
  return (
    <Slider
      label="Grid Size"
      value={gridSize}
      min={MIN_GRID_SIZE}
      max={MAX_GRID_SIZE}
      step={2}
      onChange={onChange}
      disabled={disabled}
    />
  );
};
