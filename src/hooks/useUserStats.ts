
import { useEffect, useCallback, useState } from 'react';
import { checkAndUpgradeStorage } from '../utils/storageVersion';

export interface UserStatsState {
  level: number;
  points: number;
  boxesOpened: number;
  streak: number;
  totalCorrectAnswers: number;
}

export function useUserStats() {
  // Auto-migrate/fix localStorage at startup
  useEffect(() => { checkAndUpgradeStorage(); }, []);

  const [userStats, setUserStats] = useState<UserStatsState>({
    level: 1,
    points: 0,
    boxesOpened: 0,
    streak: 0,
    totalCorrectAnswers: 0,
  });

  // Called on mount and whenever boxes are opened (public function)
  const syncBoxesOpened = useCallback(() => {
    const boxHistory = JSON.parse(localStorage.getItem('boxHistory') || '[]');
    const totalBoxesOpened = boxHistory.length;
    setUserStats(prev => {
      if (prev.boxesOpened === totalBoxesOpened) return prev;
      const updated = { ...prev, boxesOpened: totalBoxesOpened };
      localStorage.setItem('userStats', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Sync stats on mount (rehydrate)
  useEffect(() => {
    const savedStats = localStorage.getItem('userStats');
    if (savedStats) {
      setUserStats(JSON.parse(savedStats));
    }
    syncBoxesOpened();
  }, [syncBoxesOpened]);

  // Keep stats persistent
  useEffect(() => {
    localStorage.setItem('userStats', JSON.stringify(userStats));
  }, [userStats]);

  // Expose helpers for updating stats and manually reloading
  const updateStats = (updater: (prev: UserStatsState) => UserStatsState) => {
    setUserStats(prev => {
      const next = updater(prev);
      localStorage.setItem('userStats', JSON.stringify(next));
      return next;
    });
  };

  // Always keep in sync with boxHistory on request
  const forceSyncBoxesOpened = () => syncBoxesOpened();

  return {
    userStats,
    setUserStats: updateStats,
    forceSyncBoxesOpened,
  };
}
