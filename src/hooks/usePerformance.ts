import { useEffect, useRef, useCallback } from 'react';
import { usePerformanceStore } from '../store/performanceStore';

export function usePerformance() {
  const updateFPS = usePerformanceStore((state) => state.updateFPS);
  const updateMemoryUsage = usePerformanceStore((state) => state.updateMemoryUsage);
  const updateFrameTime = usePerformanceStore((state) => state.updateFrameTime);

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const fpsRef = useRef(0);

  const measureFrame = useCallback(() => {
    const now = performance.now();
    frameCountRef.current++;

    const delta = now - lastTimeRef.current;

    // Update FPS every second
    if (delta >= 1000) {
      fpsRef.current = Math.round((frameCountRef.current * 1000) / delta);
      updateFPS(fpsRef.current);
      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }

    updateFrameTime(delta / frameCountRef.current);
    updateMemoryUsage();
  }, [updateFPS, updateFrameTime, updateMemoryUsage]);

  useEffect(() => {
    const interval = setInterval(() => {
      measureFrame();
    }, 100);

    return () => clearInterval(interval);
  }, [measureFrame]);

  return {
    measureFrame,
  };
}
