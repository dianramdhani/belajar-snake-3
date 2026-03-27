import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StatsState } from '../types/game';

export const useStatsStore = create<StatsState & {
  addGame: (score: number) => void;
  resetStats: () => void;
}>()(
  persist(
    (set, get) => ({
      totalGames: 0,
      bestScore: 0,
      totalScore: 0,
      avgScore: 0,
      gamesPlayed: 0,
      bestWeights: null,
      addGame: (score) => {
        const totalGames = get().totalGames + 1;
        const totalScore = get().totalScore + score;
        const bestScore = Math.max(get().bestScore, score);
        const avgScore = totalScore / totalGames;
        set({ totalGames, totalScore, bestScore, avgScore, gamesPlayed: totalGames });
      },
      resetStats: () => set({
        totalGames: 0,
        bestScore: 0,
        totalScore: 0,
        avgScore: 0,
        gamesPlayed: 0,
        bestWeights: null,
      }),
    }),
    { name: 'snake-stats-storage' }
  )
);
