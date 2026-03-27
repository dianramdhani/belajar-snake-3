import { useState, useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../../store/gameStore';
import { GeneticAlgorithm } from '../../ai/genetic/GeneticAlgorithm';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

export const TrainingDashboard = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [bestFitness, setBestFitness] = useState(-1);
  const { gridSize, setAlgorithm } = useGameStore();

  const gaRef = useRef<GeneticAlgorithm | null>(null);
  const requestRef = useRef<number>(0);

  // Initialize GA
  useEffect(() => {
    const newGa = new GeneticAlgorithm({
      populationSize: 500,
      mutationRate: 0.1,
      layers: [24, 16, 16, 3],
      gridSize: gridSize,
    });
    gaRef.current = newGa;
    setGeneration(newGa.generation);
    setBestFitness(newGa.bestFitness);
  }, [gridSize]);

  const trainLoop = useCallback(() => {
    if (gaRef.current) {
      gaRef.current.nextGeneration();
      setGeneration(gaRef.current.generation);
      setBestFitness(gaRef.current.bestFitness);
      
      // We don't want to block the UI entirely, so we use requestAnimationFrame
      // which will give breathing room to the browser.
      // But notice: nextGeneration() computes 500 games synchronously.
      // If the UI freezes too much, we could split it using setTimeout/web workers.
      requestRef.current = requestAnimationFrame(trainLoop);
    }
  }, []);

  useEffect(() => {
    if (isTraining) {
      requestRef.current = requestAnimationFrame(trainLoop);
    } else {
      cancelAnimationFrame(requestRef.current);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isTraining, trainLoop]);

  const handleStartStop = () => {
    setIsTraining(!isTraining);
  };

  const saveModel = () => {
    if (gaRef.current && gaRef.current.bestNetwork) {
      const weights = gaRef.current.bestNetwork.exportWeights();
      useGameStore.setState({ bestWeights: weights });
      setAlgorithm('genetic');
      alert('Model Saved! You can now watch it play in the main UI.');
    } else {
      alert('No model has been trained yet.');
    }
  };

  return (
    <Card title="Training Dashboard">
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Generation</span>
          <span className="font-mono font-bold text-cyan-400">{generation}</span>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Best Fitness</span>
          <span className="font-mono font-bold text-green-400">{bestFitness.toFixed(2)}</span>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant={isTraining ? 'danger' : 'success'}
            onClick={handleStartStop}
            className="flex-1"
          >
            {isTraining ? 'Stop Training' : 'Start Training'}
          </Button>
          
          <Button
            variant="primary"
            onClick={saveModel}
            className="flex-1"
            disabled={isTraining || bestFitness === -1}
          >
            Save Model
          </Button>
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          Note: Training runs heavily on the CPU. The UI may become unresponsive during batch evaluation.
        </p>
      </div>
    </Card>
  );
};
