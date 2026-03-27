import { useCallback } from 'react';
import { useGameStore } from './store/gameStore';
import { useStatsStore } from './store/statsStore';
import { useGameLoop } from './hooks/useGameLoop';
import { useAI } from './hooks/useAI';
import { usePerformance } from './hooks/usePerformance';
import { GameBoard } from './components/game/GameBoard';
import { ControlPanel } from './components/controls/ControlPanel';
import { StatsPanel } from './components/stats/StatsPanel';
import { PerformancePanel } from './components/performance/PerformancePanel';
import { TrainingDashboard } from './components/training/TrainingDashboard';
import { getDirectionFromDelta, moveSnake, isValidDirectionChange } from './game/grid-utils';
import { checkCollision, checkFoodCollision } from './game/collision';
import { generateFood } from './game/food-generator';
import { SCORE_PER_FOOD } from './game/constants';

function App() {
  const {
    snake,
    direction,
    food,
    score,
    isRunning,
    isPaused,
    gameOver,
    speed,
    gridSize,
    algorithm,
    start,
    pause,
    resume,
    restart,
    reset,
    setDirection,
    updateGame,
    setGameOver,
    setHighScore,
  } = useGameStore();

  const addGame = useStatsStore((state) => state.addGame);
  const { measureFrame } = usePerformance();

  const { getNextMove } = useAI({
    algorithm,
    snake,
    food,
    gridSize,
  });

  // Handle game over
  const handleGameOver = useCallback(() => {
    setGameOver();
    addGame(score);
    setHighScore(score);
  }, [setGameOver, addGame, score, setHighScore]);

  // Game update logic
  const update = useCallback(() => {
    if (!isRunning || isPaused || gameOver) return;

    // Get next move from AI
    const delta = getNextMove();

    if (!delta) {
      handleGameOver();
      return;
    }

    const newDirection = getDirectionFromDelta(delta);
    if (!newDirection) {
      handleGameOver();
      return;
    }

    // Validate direction change (can't reverse)
    if (!isValidDirectionChange(direction, newDirection)) {
      // Try to continue in current direction
      const currentDelta = {
        UP: { x: 0, y: -1 },
        DOWN: { x: 0, y: 1 },
        LEFT: { x: -1, y: 0 },
        RIGHT: { x: 1, y: 0 },
      }[direction];

      const newHead = {
        x: snake[0].x + currentDelta.x,
        y: snake[0].y + currentDelta.y,
      };

      if (checkCollision(newHead, snake, gridSize)) {
        handleGameOver();
        return;
      }

      const willEatFood = checkFoodCollision(newHead, food);
      const newSnake = moveSnake(snake, direction, willEatFood);

      if (willEatFood) {
        const newFood = generateFood(gridSize, newSnake);
        const newScore = score + SCORE_PER_FOOD;
        updateGame(newSnake, newFood, newScore, null);
      } else {
        updateGame(newSnake, food, score, null);
      }

      return;
    }

    setDirection(newDirection);

    // Calculate new head position
    const deltaMove = {
      UP: { x: 0, y: -1 },
      DOWN: { x: 0, y: 1 },
      LEFT: { x: -1, y: 0 },
      RIGHT: { x: 1, y: 0 },
    }[newDirection];

    const newHead = {
      x: snake[0].x + deltaMove.x,
      y: snake[0].y + deltaMove.y,
    };

    // Check collision
    if (checkCollision(newHead, snake, gridSize)) {
      handleGameOver();
      return;
    }

    // Check food collision
    const willEatFood = checkFoodCollision(newHead, food);

    // Move snake
    const newSnake = moveSnake(snake, newDirection, willEatFood);

    if (willEatFood) {
      // Generate new food
      const newFood = generateFood(gridSize, newSnake);
      const newScore = score + SCORE_PER_FOOD;
      updateGame(newSnake, newFood, newScore, null);
    } else {
      updateGame(newSnake, food, score, null);
    }
  }, [
    isRunning,
    isPaused,
    gameOver,
    snake,
    direction,
    food,
    score,
    gridSize,
    getNextMove,
    handleGameOver,
    setDirection,
    updateGame,
  ]);

  // Render callback
  const render = useCallback(() => {
    measureFrame();
  }, [measureFrame]);

  // Setup game loop
  useGameLoop({
    onUpdate: update,
    onRender: render,
    isActive: isRunning && !isPaused && !gameOver,
    tickIntervalMs: speed,
  });

  // Handler functions
  const handleStart = useCallback(() => {
    if (gameOver) {
      restart();
    } else {
      start();
    }
  }, [gameOver, start, restart]);

  const handlePause = useCallback(() => {
    if (isPaused) {
      resume();
    } else {
      pause();
    }
  }, [isPaused, pause, resume]);

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            🐍 Snake AI Auto-Play
          </h1>
          <p className="text-gray-400 mt-2">
            Watch AI algorithms play Snake automatically
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-6 justify-center items-start">
          {/* Game Board */}
          <div className="flex-shrink-0">
            <GameBoard
              onStart={handleStart}
              onResume={handlePause}
              onReset={handleReset}
            />
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 space-y-4">
            <ControlPanel
              onStart={handleStart}
              onPause={handlePause}
              onReset={handleReset}
            />
            {algorithm === 'genetic' && <TrainingDashboard />}
            <StatsPanel />
            <PerformancePanel />
          </div>
        </div>

        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>
            Algorithms: BFS | A* | Greedy BFS | Greedy A*
          </p>
          <p className="mt-1">
            Built with React 19, TypeScript 5.8, Zustand 5, Tailwind CSS 4
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
