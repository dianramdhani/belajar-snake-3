import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { GameState, Position, Direction, AIAlgorithm } from '../types/game';

const initialState: GameState = {
  snake: [{ x: 10, y: 10 }],
  direction: 'RIGHT',
  food: { x: 15, y: 15 },
  score: 0,
  highScore: 0,
  isRunning: false,
  isPaused: false,
  gameOver: false,
  speed: 100,
  gridSize: 20,
  algorithm: 'bfs',
  currentPath: null,
};

export const useGameStore = create<GameState & {
  start: () => void;
  pause: () => void;
  reset: () => void;
  setDirection: (dir: Direction) => void;
  setSpeed: (speed: number) => void;
  setGridSize: (size: number) => void;
  setAlgorithm: (algo: AIAlgorithm) => void;
  updateGame: (newSnake: Position[], newFood: Position, newScore: number, newPath: Position[] | null) => void;
  setGameOver: () => void;
  setHighScore: (score: number) => void;
}>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        start: () => set({ isRunning: true, isPaused: false, gameOver: false }),
        pause: () => set({ isPaused: true }),
        resume: () => set({ isPaused: false }),
        reset: () => set({ ...initialState }),
        setDirection: (direction) => set({ direction }),
        setSpeed: (speed) => set({ speed }),
        setGridSize: (gridSize) => set({ 
          gridSize,
          snake: [{ x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2) }],
          food: { x: Math.floor(gridSize * 0.75), y: Math.floor(gridSize * 0.75) },
          score: 0,
          currentPath: null,
        }),
        setAlgorithm: (algorithm) => set({ algorithm }),
        updateGame: (snake, food, score, currentPath) => set({ snake, food, score, currentPath }),
        setGameOver: () => set({ gameOver: true, isRunning: false }),
        setHighScore: (score) => set({ highScore: Math.max(get().highScore, score) }),
      }),
      { name: 'snake-game-storage' }
    )
  )
);
