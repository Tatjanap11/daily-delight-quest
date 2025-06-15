
import { useEffect, useState } from 'react';

export function useBoardState() {
  const [currentTab, setCurrentTab] = useState('game');
  const [todayCompleted, setTodayCompleted] = useState(false);
  const [practiceModeLocked, setPracticeModeLocked] = useState(false);

  // Sync today completed / practice lock on mount and when needed
  const refreshBoardState = () => {
    const today = new Date().toDateString();
    const completedToday = !!localStorage.getItem(`completed_${today}`);
    setTodayCompleted(completedToday);

    if (localStorage.getItem('practiceModeLockedDate') !== today) {
      setPracticeModeLocked(false);
      localStorage.removeItem('practiceModeLockedDate');
    } else if (localStorage.getItem('practiceModeLockedDate') === today) {
      setPracticeModeLocked(true);
    }
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
