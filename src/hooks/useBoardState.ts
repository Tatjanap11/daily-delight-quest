
import { useEffect, useState } from 'react';
import { checkAndUpgradeStorage } from '../utils/storageVersion';

export function useBoardState() {
  useEffect(() => { 
    const didUpgrade = checkAndUpgradeStorage();
    if (didUpgrade) {
      console.log("[BoardState] Storage migrated/upgraded on mount, clearing state.");
    }
  }, []);

  const [currentTab, setCurrentTab] = useState('game');
  const [todayCompleted, setTodayCompleted] = useState(false);
  const [practiceModeLocked, setPracticeModeLocked] = useState(false);

  // Sync today completed / practice lock on mount and when needed
  const refreshBoardState = () => {
    const today = new Date().toDateString();
    const completedToday = !!localStorage.getItem(`completed_${today}`);
    setTodayCompleted(completedToday);

    let lockFlag = false;

    if (localStorage.getItem('practiceModeLockedDate') !== today) {
      setPracticeModeLocked(false);
      localStorage.removeItem('practiceModeLockedDate');
      lockFlag = false;
    } else if (localStorage.getItem('practiceModeLockedDate') === today) {
      setPracticeModeLocked(true);
      lockFlag = true;
    }

    // Diagnostic logging
    console.log("[BoardState] Refresh: today =", today,
      "completedToday =", completedToday,
      "practiceModeLocked =", lockFlag,
      "localStorage keys", { 
        completed: localStorage.getItem(`completed_${today}`),
        practiceModeLockedDate: localStorage.getItem('practiceModeLockedDate')
      }
    );
  };

  useEffect(() => {
    refreshBoardState();
    // Optionally, subscribe to focus events for more robustness
    const onFocus = () => refreshBoardState();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  // Expose a way to manually re-check
  const forceRefresh = refreshBoardState;

  return {
    currentTab,
    setCurrentTab,
    todayCompleted,
    setTodayCompleted,
    practiceModeLocked,
    setPracticeModeLocked,
    forceRefresh,
  };
}
