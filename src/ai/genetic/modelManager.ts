import type { NeuralNetworkWeights } from '../../types/game';

const MODEL_FILENAME = 'ga.json';
const MODEL_PATH = '/ga.json';

export interface ModelMetadata {
  version: string;
  generation: number;
  fitness: number;
  gridSize: number;
  layers: number[];
  savedAt: string;
}

export interface ModelFile {
  metadata: ModelMetadata;
  weights: NeuralNetworkWeights;
}

export interface ModelDataToSave extends Omit<ModelMetadata, 'version' | 'savedAt'> {}

/**
 * Download model weights as JSON file to user's downloads
 * Browser security prevents direct write to public folder
 * User needs to manually place the file in public/ folder
 */
export async function downloadModel(
  weights: NeuralNetworkWeights,
  metadata: ModelDataToSave
): Promise<void> {
  const modelData: ModelFile = {
    metadata: {
      version: '1.0.0',
      savedAt: new Date().toISOString(),
      ...metadata,
    },
    weights,
  };

  const blob = new Blob([JSON.stringify(modelData, null, 2)], {
    type: 'application/json',
  });
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = MODEL_FILENAME;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Load model from public folder
 * The file must be placed in public/snake-ai-model.json
 */
export async function loadModelFromPublic(): Promise<ModelFile | null> {
  try {
    const response = await fetch(MODEL_PATH, {
      cache: 'no-cache',
    });
    
    if (!response.ok) {
      console.warn('No model file found in public folder');
      return null;
    }
    
    const data: ModelFile = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to load model from public folder:', error);
    return null;
  }
}

/**
 * Save model to localStorage as backup
 * This provides persistence across page reloads
 */
export function saveModelToLocalStorage(
  weights: NeuralNetworkWeights,
  metadata: ModelDataToSave
): void {
  const modelData: ModelFile = {
    metadata: {
      version: '1.0.0',
      savedAt: new Date().toISOString(),
      ...metadata,
    },
    weights,
  };
  
  localStorage.setItem('snake-ai-model', JSON.stringify(modelData));
}

/**
 * Load model from localStorage
 */
export function loadModelFromLocalStorage(): ModelFile | null {
  try {
    const data = localStorage.getItem('snake-ai-model');
    if (!data) return null;
    
    return JSON.parse(data) as ModelFile;
  } catch (error) {
    console.error('Failed to load model from localStorage:', error);
    return null;
  }
}

/**
 * Check if a model exists in public folder
 */
export async function checkModelExists(): Promise<boolean> {
  try {
    const response = await fetch(MODEL_PATH, {
      method: 'HEAD',
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get the best model - tries public folder first, then localStorage
 */
export async function getBestModel(): Promise<ModelFile | null> {
  // Try public folder first
  const publicModel = await loadModelFromPublic();
  if (publicModel) {
    console.log('Loaded model from public folder');
    return publicModel;
  }
  
  // Fallback to localStorage
  const localModel = loadModelFromLocalStorage();
  if (localModel) {
    console.log('Loaded model from localStorage');
    return localModel;
  }
  
  return null;
}
