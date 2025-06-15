import React, { useEffect } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import MainHeader from '@/components/MainHeader';
import MainTabs from '@/components/MainTabs';
import MainNavbar from '@/components/MainNavbar';
import GameAndBoxPanelEntry from "@/components/GameAndBoxPanelEntry";
import DailyStatsBar from '@/components/DailyStatsBar';
import Leaderboard from '@/components/Leaderboard';
import UserStats from '@/components/UserStats';
import { useToast } from '@/hooks/use-toast';
import { useUserStats } from '@/hooks/useUserStats';
import { useBoardState } from '@/hooks/useBoardState';

const Index = () => {
  const { userStats, setUserStats, forceSyncBoxesOpened } = useUserStats();
  const {
    currentTab,
    setCurrentTab,
    todayCompleted,
    setTodayCompleted,
    practiceModeLocked,
    setPracticeModeLocked,
    forceRefresh,
  } = useBoardState();
  const { toast } = useToast();

  // Always compute and sync boxesOpened on mount, and when stats tab is visible
  useEffect(() => { forceSyncBoxesOpened(); }, []);
  useEffect(() => {
    if (currentTab === 'stats') {
      forceSyncBoxesOpened();
    }
  }, [currentTab, forceSyncBoxesOpened]);

  // Level/points/daily stats util
  const pointsForNextLevel = userStats.level * 100;
  const progressToNextLevel = ((userStats.points % pointsForNextLevel) / pointsForNextLevel) * 100;
  const canLevelUp = userStats.points >= pointsForNextLevel;

  // When puzzle completed
  const handlePuzzleComplete = (points: number) => {
    const today = new Date().toDateString();
    setUserStats(prev => ({
      ...prev,
      points: prev.points + points,
      totalCorrectAnswers: prev.totalCorrectAnswers + 1,
    }));
    setTodayCompleted(true);
    localStorage.setItem(`completed_${today}`, 'true');
    toast({
      title: "🎉 Amazing! You got it! 🌟",
      description: `✨ You earned ${points} magical points! ${points > 10 ? 'The surprise box is sparkling and ready!' : 'Keep practicing to earn more!'} ✨`,
      className: "bg-gradient-to-r from-emerald-800 to-green-800 border-emerald-600 shadow-xl text-emerald-200"
    });
  };

  // When box opened (always sync latest history)
  const handleBoxOpened = () => {
    let boxHistory = JSON.parse(localStorage.getItem('boxHistory') || '[]');
    const today = new Date().toDateString();
    boxHistory.push({ date: today, timestamp: Date.now() });
    localStorage.setItem('boxHistory', JSON.stringify(boxHistory));
    forceSyncBoxesOpened();
  };

  const handleLevelUp = () => {
    if (canLevelUp) {
      setUserStats(prev => ({
        ...prev,
        level: prev.level + 1,
        points: prev.points - pointsForNextLevel,
      }));
      setPracticeModeLocked(true);
      const today = new Date().toDateString();
      localStorage.setItem('practiceModeLockedDate', today);
      toast({
        title: "🎉 Level Up!",
        description: `Congratulations! You've reached level ${userStats.level + 1}! New challenges await!`,
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
              <GameAndBoxPanelEntry
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
