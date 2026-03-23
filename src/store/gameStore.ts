import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { GameState, Position, Direction, AIAlgorithm } from '../types/game';

const getInitialState = (gridSize: number = 20): GameState => ({
  snake: [{ x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2) }],
  direction: 'RIGHT',
  food: { x: Math.floor(gridSize * 0.75), y: Math.floor(gridSize * 0.75) },
  score: 0,
  highScore: 0,
  isRunning: false,
  isPaused: false,
  gameOver: false,
  speed: 100,
  gridSize,
  algorithm: 'bfs',
  currentPath: null,
});

export const useGameStore = create<GameState & {
  start: () => void;
  pause: () => void;
  resume: () => void;
  restart: () => void;
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
        ...getInitialState(),
        start: () => set({ isRunning: true, isPaused: false, gameOver: false }),
        pause: () => set({ isPaused: true }),
        resume: () => set({ isPaused: false }),
        restart: () => {
          const currentGridSize = get().gridSize;
          set({
            ...getInitialState(currentGridSize),
            isRunning: true,
            isPaused: false,
            gameOver: false,
            highScore: get().highScore, // Keep high score
          });
        },
        reset: () => set({ ...getInitialState(get().gridSize) }),
        setDirection: (direction) => set({ direction }),
        setSpeed: (speed) => set({ speed }),
        setGridSize: (gridSize) => set({
          ...getInitialState(gridSize),
          highScore: get().highScore, // Keep high score
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
