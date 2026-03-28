import { useState, useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../../store/gameStore';
import { GeneticAlgorithm } from '../../ai/genetic/GeneticAlgorithm';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { downloadModel, loadModelFromPublic, saveModelToLocalStorage, checkModelExists } from '../../ai/genetic/modelManager';

export const TrainingDashboard = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [bestFitness, setBestFitness] = useState(-1);
  const [modelExists, setModelExists] = useState(false);
  const { gridSize, setAlgorithm, setBestWeights } = useGameStore();

  const gaRef = useRef<GeneticAlgorithm | null>(null);
  const requestRef = useRef<number>(0);
  const autoSaveIntervalRef = useRef<number>(0);

  // Check if model exists in public folder on mount
  useEffect(() => {
    checkModelExists().then(setModelExists);
  }, []);

  // Auto-save model periodically during training
  useEffect(() => {
    if (isTraining && gaRef.current && gaRef.current.bestNetwork) {
      autoSaveIntervalRef.current = window.setInterval(() => {
        const weights = gaRef.current!.bestNetwork!.exportWeights();
        saveModelToLocalStorage(weights, {
          generation: gaRef.current!.generation,
          fitness: gaRef.current!.bestFitness,
          gridSize,
          layers: [24, 16, 16, 3],
        });
        console.log(`Auto-saved model at generation ${gaRef.current!.generation}`);
      }, 30000); // Auto-save every 30 seconds
    }
    
    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [isTraining, gridSize]);

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

  const handleDownloadModel = () => {
    if (gaRef.current && gaRef.current.bestNetwork) {
      const weights = gaRef.current.bestNetwork.exportWeights();
      downloadModel(weights, {
        generation: gaRef.current.generation,
        fitness: gaRef.current.bestFitness,
        gridSize,
        layers: [24, 16, 16, 3],
      });
      alert('Model downloaded! Save the file to public/ga.json to persist it.');
    } else {
      alert('No model has been trained yet.');
    }
  };

  const handleLoadModel = async () => {
    const modelData = await loadModelFromPublic();
    if (modelData) {
      setBestWeights(modelData.weights);
      setAlgorithm('genetic');
      alert(`Model loaded successfully!\nGeneration: ${modelData.metadata.generation}\nFitness: ${modelData.metadata.fitness.toFixed(2)}`);
    } else {
      alert('No model file found in public/ga.json. Please download a model first and place it in the public folder.');
    }
  };

  const saveModel = () => {
    if (gaRef.current && gaRef.current.bestNetwork) {
      const weights = gaRef.current.bestNetwork.exportWeights();
      useGameStore.setState({ bestWeights: weights });
      setAlgorithm('genetic');
      // Also save to localStorage for persistence
      saveModelToLocalStorage(weights, {
        generation: gaRef.current.generation,
        fitness: gaRef.current.bestFitness,
        gridSize,
        layers: [24, 16, 16, 3],
      });
      alert('Model Saved to localStorage! You can now watch it play in the main UI.');
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

        {modelExists && (
          <div className="p-2 bg-green-900/30 border border-green-700 rounded text-xs text-green-400">
            ✓ Model file found in public folder
          </div>
        )}

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
            Save to Local
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={handleDownloadModel}
            className="flex-1"
            disabled={isTraining || bestFitness === -1}
          >
            ⬇ Download Model
          </Button>

          <Button
            variant="secondary"
            onClick={handleLoadModel}
            className="flex-1"
            disabled={isTraining}
          >
            ⬆ Load from Public
          </Button>
        </div>

        <div className="text-xs text-gray-500 space-y-1 mt-2">
          <p>• <strong>Save to Local:</strong> Save to browser localStorage (persists across reloads)</p>
          <p>• <strong>Download:</strong> Download JSON file, then place in <code className="bg-gray-800 px-1 rounded">public/ga.json</code></p>
          <p>• <strong>Load from Public:</strong> Load model from <code className="bg-gray-800 px-1 rounded">public/ga.json</code></p>
          <p>• Auto-save to localStorage every 30s during training</p>
        </div>
      </div>
    </Card>
  );
};
