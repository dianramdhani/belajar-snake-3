import { useEffect, useRef, useCallback } from 'react';

interface UseGameLoopOptions {
  onUpdate: (deltaTime: number) => void;
  onRender: () => void;
  isActive: boolean;
  tickIntervalMs: number;
}

export function useGameLoop({
  onUpdate,
  onRender,
  isActive,
  tickIntervalMs,
}: UseGameLoopOptions) {
  const frameRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);
  const accumulatorRef = useRef<number>(0);
  const lastTickRef = useRef<number>(0);
  const fixedTimestep = 1000 / 60; // 60 FPS

  const gameLoop = useCallback(
    (currentTime: number) => {
      if (!isActive) return;

      if (lastTimeRef.current === 0) {
        lastTimeRef.current = currentTime;
        frameRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      const delta = Math.min(100, currentTime - lastTimeRef.current);
      lastTimeRef.current = currentTime;
      accumulatorRef.current += delta;

      // Update game logic at fixed timestep
      while (accumulatorRef.current >= fixedTimestep) {
        const now = Date.now();
        if (now - lastTickRef.current >= tickIntervalMs) {
          onUpdate(fixedTimestep);
          lastTickRef.current = now;
        }
        accumulatorRef.current -= fixedTimestep;
      }

      // Render at full frame rate
      onRender();

      frameRef.current = requestAnimationFrame(gameLoop);
    },
    [isActive, tickIntervalMs, onUpdate, onRender, fixedTimestep]
  );

  useEffect(() => {
    if (!isActive) {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      lastTimeRef.current = 0;
      accumulatorRef.current = 0;
      return;
    }
    frameRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [isActive, gameLoop]);
}
