import { create } from 'zustand';
import type { PerformanceState } from '../types/game';

const initialPerformanceState: PerformanceState = {
  fps: 0,
  aiComputeTime: 0,
  memoryUsage: 0,
  frameTime: 0,
};

export const usePerformanceStore = create<PerformanceState & {
  updateFPS: (fps: number) => void;
  updateAIComputeTime: (time: number) => void;
  updateMemoryUsage: () => void;
  updateFrameTime: (time: number) => void;
  resetPerformance: () => void;
}>()(
  (set) => ({
    ...initialPerformanceState,
    updateFPS: (fps) => set({ fps }),
    updateAIComputeTime: (aiComputeTime) => set({ aiComputeTime }),
    updateMemoryUsage: () => {
      // @ts-expect-error - performance.memory is Chrome-specific
      if (typeof performance !== 'undefined' && performance.memory) {
        // @ts-expect-error - performance.memory is Chrome-specific
        set({ memoryUsage: performance.memory.usedJSHeapSize / 1048576 });
      }
    },
    updateFrameTime: (frameTime) => set({ frameTime }),
    resetPerformance: () => set({ ...initialPerformanceState }),
  })
);
