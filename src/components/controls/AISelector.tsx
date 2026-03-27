import type { AIAlgorithm } from '../../types/game';
import { Select } from '../common/Select';

interface AISelectorProps {
  algorithm: AIAlgorithm;
  onChange: (algo: AIAlgorithm) => void;
  disabled?: boolean;
}

export const AISelector = ({
  algorithm,
  onChange,
  disabled = false,
}: AISelectorProps) => {
  const options: { value: AIAlgorithm; label: string }[] = [
    { value: 'bfs', label: '🔍 BFS (Breadth-First Search)' },
    { value: 'aStar', label: '⭐ A* (A-Star)' },
    { value: 'greedyBFS', label: '⚡ Greedy BFS' },
    { value: 'greedyAStar', label: '🚀 Greedy A*' },
    { value: 'genetic', label: '🧠 Genetic Algorithm' },
  ];

  return (
    <Select
      label="AI Algorithm"
      value={algorithm}
      options={options}
      onChange={onChange}
      disabled={disabled}
    />
  );
};
