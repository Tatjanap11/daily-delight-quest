import React, { useState, useEffect, useCallback } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import GameAndBoxPanel from '@/components/GameAndBoxPanel';
import DailyStatsBar from '@/components/DailyStatsBar';
import Leaderboard from '@/components/Leaderboard';
import UserStats from '@/components/UserStats';
import { useToast } from '@/hooks/use-toast';
import { Brain, Star, Trophy } from 'lucide-react';
import MainHeader from "@/components/MainHeader";
import MainTabs from "@/components/MainTabs";
import MainNavbar from "@/components/MainNavbar";

const Index = () => {
  const [currentTab, setCurrentTab] = useState('game');
  const [userStats, setUserStats] = useState({
    level: 1,
    points: 0,
    boxesOpened: 0,
    streak: 0,
    totalCorrectAnswers: 0
  });
  const [todayCompleted, setTodayCompleted] = useState(false);
  const [practiceModeLocked, setPracticeModeLocked] = useState(false);
  const { toast } = useToast();

  const pointsForNextLevel = userStats.level * 100;
  const progressToNextLevel = (userStats.points % pointsForNextLevel) / pointsForNextLevel * 100;
  const canLevelUp = userStats.points >= pointsForNextLevel;

  // Utility to sync boxesOpened from boxHistory
  const syncBoxesOpenedFromStorage = React.useCallback(() => {
    const boxHistory = JSON.parse(localStorage.getItem('boxHistory') || '[]');
    const totalBoxesOpened = boxHistory.length;
    setUserStats((prev) => {
      if (prev.boxesOpened !== totalBoxesOpened) {
        const nextStats = { ...prev, boxesOpened: totalBoxesOpened };
        localStorage.setItem('userStats', JSON.stringify(nextStats));
        return nextStats;
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    // Rehydrate userStats on mount
    const savedStats = localStorage.getItem('userStats');
    let stats = userStats;
    if (savedStats) {
      stats = JSON.parse(savedStats);
      setUserStats(stats);
    }

    syncBoxesOpenedFromStorage();
    // Count boxes opened after rehydration, fallback for legacy
    const boxHistory = JSON.parse(localStorage.getItem('boxHistory') || '[]'); // [{date:string, count:number}]
    const totalBoxesOpened = boxHistory.reduce((sum, d) => sum + (d.count || 1), 0);

    // If userStats.boxesOpened doesn't match history, correct it
    if (totalBoxesOpened !== stats.boxesOpened) {
      setUserStats(prev => ({ ...prev, boxesOpened: totalBoxesOpened }));
      // Also write back to localStorage
      const mergedStats = { ...stats, boxesOpened: totalBoxesOpened };
      localStorage.setItem('userStats', JSON.stringify(mergedStats));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('userStats', JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    // Handle todayCompleted, streak, practiceModeLocked logic
    const today = new Date().toDateString();
    const lastPlayDate = localStorage.getItem('lastPlayDate');
    const completedToday = localStorage.getItem(`completed_${today}`);

    setTodayCompleted(!!completedToday);

    // If a new day, unlock practice mode
    if (localStorage.getItem('practiceModeLockedDate') !== today) {
      setPracticeModeLocked(false);
      localStorage.removeItem('practiceModeLockedDate');
    } else if (localStorage.getItem('practiceModeLockedDate') === today) {
      setPracticeModeLocked(true);
    }

    // Handle streak logic only if puzzle was completed today
    if (completedToday) {
      if (lastPlayDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        setUserStats(prev => {
          const newStreak = lastPlayDate === yesterdayStr ? prev.streak + 1 : 1;
          return { ...prev, streak: newStreak };
        });
        localStorage.setItem('lastPlayDate', today);
      }
    }
  }, []);

  // Always sync boxesOpened when boxHistory changes (across tabs/windows)
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === 'boxHistory') {
        syncBoxesOpenedFromStorage();
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [syncBoxesOpenedFromStorage]);

  // Whenever currentTab becomes "stats", force sync boxesOpened
  useEffect(() => {
    if (currentTab === 'stats') {
      syncBoxesOpenedFromStorage();
    }
  }, [currentTab, syncBoxesOpenedFromStorage]);

  const handlePuzzleComplete = (points: number) => {
    const today = new Date().toDateString();
    const newStats = {
      ...userStats,
      points: userStats.points + points,
      totalCorrectAnswers: userStats.totalCorrectAnswers + 1,
    };

    setUserStats(newStats);
    setTodayCompleted(true);

    // Mark today as completed (only for daily puzzles, not practice)
    if (!localStorage.getItem(`completed_${today}`)) {
      localStorage.setItem(`completed_${today}`, 'true');
    }

    toast({
      title: "🎉 Amazing! You got it! 🌟",
      description: `✨ You earned ${points} magical points! ${points > 10 ? 'The surprise box is sparkling and ready!' : 'Keep practicing to earn more!'} ✨`,
      className: "bg-gradient-to-r from-emerald-800 to-green-800 border-emerald-600 shadow-xl text-emerald-200"
    });
  };

  // Called from SurpriseBox when a box is opened (daily or additional)
  const handleBoxOpened = () => {
    let boxHistory = JSON.parse(localStorage.getItem('boxHistory') || '[]');
    const today = new Date().toDateString();
    boxHistory.push({ date: today, timestamp: Date.now() });
    localStorage.setItem('boxHistory', JSON.stringify(boxHistory));
    // Always recompute boxesOpened from the latest boxHistory
    syncBoxesOpenedFromStorage();
  };

  const handleLevelUp = () => {
    if (canLevelUp) {
      const newStats = {
        ...userStats,
        level: userStats.level + 1,
        points: userStats.points - pointsForNextLevel
      };
      setUserStats(newStats);

      // Lock practice mode for today
      const today = new Date().toDateString();
      setPracticeModeLocked(true);
      localStorage.setItem('practiceModeLockedDate', today);

      toast({
        title: "🎉 Level Up!",
        description: `Congratulations! You've reached level ${newStats.level}! New challenges await!`,
        className: "bg-gradient-to-r from-yellow-800 to-orange-800 border-yellow-600 shadow-xl text-yellow-200"
      });
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <MainNavbar />
          <MainHeader pointsForNextLevel={pointsForNextLevel} />
          <DailyStatsBar
            userStats={userStats}
            pointsForNextLevel={pointsForNextLevel}
            progressToNextLevel={progressToNextLevel}
            canLevelUp={canLevelUp}
            onLevelUp={handleLevelUp}
          />
          <MainTabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
          <div className="space-y-8">
            {currentTab === 'game' && (
              <GameAndBoxPanel
                onPuzzleComplete={handlePuzzleComplete}
                puzzleCompleted={todayCompleted}
                userLevel={userStats.level}
                onBoxOpened={handleBoxOpened}
                practiceModeLocked={practiceModeLocked}
              />
            )}
            {currentTab === 'stats' && (
              <UserStats stats={userStats} />
            )}
            {currentTab === 'leaderboard' && (
              <Leaderboard currentUser={userStats} />
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Index;
