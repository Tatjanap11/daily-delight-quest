
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Trophy, Star, Brain, Gift, Zap, HelpCircle, ArrowRight } from 'lucide-react';
import PuzzleGame from '@/components/PuzzleGame';
import SurpriseBox from '@/components/SurpriseBox';
import Leaderboard from '@/components/Leaderboard';
import UserStats from '@/components/UserStats';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const pointsForNextLevel = userStats.level * 100;
  const progressToNextLevel = (userStats.points % 100) / 100 * 100;
  const canLevelUp = userStats.points >= pointsForNextLevel;

  // Load user stats from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('userStats');
    if (savedStats) {
      setUserStats(JSON.parse(savedStats));
    }
  }, []);

  // Save user stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userStats', JSON.stringify(userStats));
  }, [userStats]);

  // Check daily streak
  useEffect(() => {
    const today = new Date().toDateString();
    const lastPlayDate = localStorage.getItem('lastPlayDate');
    const completedToday = localStorage.getItem(`completed_${today}`);
    
    setTodayCompleted(!!completedToday);

    if (completedToday && lastPlayDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastPlayDate === yesterday.toDateString()) {
        // Continue streak
        setUserStats(prev => ({ ...prev, streak: prev.streak + 1 }));
      } else if (lastPlayDate && lastPlayDate !== today) {
        // Reset streak if missed a day
        setUserStats(prev => ({ ...prev, streak: 1 }));
      }
      
      localStorage.setItem('lastPlayDate', today);
    }
  }, []);

  const handlePuzzleComplete = (points: number) => {
    const today = new Date().toDateString();
    const newStats = {
      ...userStats,
      points: userStats.points + points,
      totalCorrectAnswers: userStats.totalCorrectAnswers + 1,
    };

    setUserStats(newStats);
    setTodayCompleted(true);
    localStorage.setItem(`completed_${today}`, 'true');

    toast({
      title: "🎉 Amazing! You got it! 🌟",
      description: `✨ You earned ${points} magical points! The surprise box is sparkling and ready! ✨`,
      className: "bg-gradient-to-r from-emerald-800 to-green-800 border-emerald-600 shadow-xl text-emerald-200"
    });
  };

  const handleBoxOpened = () => {
    setUserStats(prev => ({
      ...prev,
      boxesOpened: prev.boxesOpened + 1
    }));
  };

  const handleLevelUp = () => {
    if (canLevelUp) {
      const newStats = {
        ...userStats,
        level: userStats.level + 1,
        points: userStats.points - pointsForNextLevel
      };
      
      setUserStats(newStats);
      
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
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Daily WonderBox
              </h1>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-400">
                    <HelpCircle className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm p-4 bg-slate-800 border-slate-700 text-slate-200">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-400">How to Play:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Solve daily puzzles to earn points</li>
                      <li>• Open surprise boxes to discover amazing facts</li>
                      <li>• Rate facts to get personalized content</li>
                      <li>• Maintain streaks by playing daily</li>
                      <li>• Level up to unlock harder puzzles</li>
                      <li>• Compete on the leaderboard</li>
                    </ul>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-blue-200 text-lg">
              Solve puzzles, unlock fascinating facts, and expand your mind daily!
            </p>
          </div>

          {/* User Stats Bar */}
          <Card className="mb-8 bg-slate-800/90 backdrop-blur-sm border-slate-700 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <span className="font-semibold text-slate-200">Level {userStats.level}</span>
                  </div>
                  <Badge variant="secondary" className="bg-blue-900/50 text-blue-300 border-blue-700">
                    <Star className="w-4 h-4 mr-1" />
                    {userStats.points} points
                  </Badge>
                  <Badge variant="secondary" className="bg-cyan-900/50 text-cyan-300 border-cyan-700">
                    <Zap className="w-4 h-4 mr-1" />
                    {userStats.streak} streak
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-slate-400">
                    {userStats.boxesOpened} surprise boxes opened
                  </div>
                  {canLevelUp && (
                    <Button 
                      onClick={handleLevelUp}
                      className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold"
                    >
                      Level Up! <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-300">
                  <span>Progress to Level {userStats.level + 1}</span>
                  <span>{Math.floor(progressToNextLevel)}%</span>
                </div>
                <Progress value={progressToNextLevel} className="h-2 bg-slate-700" />
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-slate-800/90 backdrop-blur-sm rounded-full p-2 shadow-lg border border-slate-700">
              <div className="flex gap-2">
                {[
                  { id: 'game', label: 'Today\'s Puzzle', icon: Brain },
                  { id: 'stats', label: 'My Progress', icon: Star },
                  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
                ].map(({ id, label, icon: Icon }) => (
                  <Button
                    key={id}
                    variant={currentTab === id ? "default" : "ghost"}
                    onClick={() => setCurrentTab(id)}
                    className={`rounded-full transition-all duration-200 ${
                      currentTab === id 
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg' 
                        : 'hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {currentTab === 'game' && (
              <div className="grid gap-8 lg:grid-cols-2">
                <PuzzleGame 
                  onComplete={handlePuzzleComplete}
                  completed={todayCompleted}
                  userLevel={userStats.level}
                />
                <SurpriseBox 
                  canOpen={todayCompleted}
                  onBoxOpened={handleBoxOpened}
                  userLevel={userStats.level}
                />
              </div>
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
