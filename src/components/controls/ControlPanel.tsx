import { useGameStore } from '../../store/gameStore';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { AISelector } from './AISelector';
import { SpeedControl } from './SpeedControl';
import { GridSizeControl } from './GridSizeControl';

interface ControlPanelProps {
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export const ControlPanel = ({
  onStart,
  onPause,
  onReset,
}: ControlPanelProps) => {
  const {
    isRunning,
    isPaused,
    algorithm,
    speed,
    gridSize,
    setAlgorithm,
    setSpeed,
    setGridSize,
  } = useGameStore();

  return (
    <Card title="Controls">
      <div className="space-y-4">
        <AISelector
          algorithm={algorithm}
          onChange={setAlgorithm}
          disabled={isRunning && !isPaused}
        />

        <SpeedControl
          speed={speed}
          onChange={setSpeed}
          disabled={false}
        />

        <GridSizeControl
          gridSize={gridSize}
          onChange={setGridSize}
          disabled={isRunning && !isPaused}
        />

        <div className="flex gap-2 pt-2">
          {!isRunning || isPaused ? (
            <Button
              variant="success"
              onClick={isPaused ? onPause : onStart}
              className="flex-1"
            >
              {isPaused ? 'Resume' : 'Start'}
            </Button>
          ) : (
            <Button
              variant="secondary"
              onClick={onPause}
              className="flex-1"
            >
              Pause
            </Button>
          )}
          <Button
            variant="danger"
            onClick={onReset}
            className="flex-1"
          >
            Reset
          </Button>
        </div>
      </div>
    </Card>
  );
};
