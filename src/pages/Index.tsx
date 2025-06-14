
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Brain, Gift, Zap } from 'lucide-react';
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

  const handlePuzzleComplete = (points: number) => {
    const newStats = {
      ...userStats,
      points: userStats.points + points,
      totalCorrectAnswers: userStats.totalCorrectAnswers + 1,
      streak: userStats.streak + 1
    };

    // Check for level up
    if (newStats.points >= pointsForNextLevel) {
      newStats.level += 1;
      toast({
        title: "🎉 Level Up!",
        description: `Congratulations! You've reached level ${newStats.level}!`,
      });
    }

    setUserStats(newStats);
    setTodayCompleted(true);
  };

  const handleBoxOpened = () => {
    setUserStats(prev => ({
      ...prev,
      boxesOpened: prev.boxesOpened + 1
    }));
  };

  useEffect(() => {
    // Check if today's puzzle was already completed
    const today = new Date().toDateString();
    const completedToday = localStorage.getItem(`completed_${today}`);
    setTodayCompleted(!!completedToday);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Daily Discoveries
          </h1>
          <p className="text-gray-600 text-lg">
            Solve puzzles, unlock fascinating facts, and expand your mind daily!
          </p>
        </div>

        {/* User Stats Bar */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold">Level {userStats.level}</span>
                </div>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  <Star className="w-4 h-4 mr-1" />
                  {userStats.points} points
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  <Zap className="w-4 h-4 mr-1" />
                  {userStats.streak} streak
                </Badge>
              </div>
              <div className="text-sm text-gray-500">
                {userStats.boxesOpened} surprise boxes opened
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to Level {userStats.level + 1}</span>
                <span>{Math.floor(progressToNextLevel)}%</span>
              </div>
              <Progress value={progressToNextLevel} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg">
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
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                      : 'hover:bg-gray-100'
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
  );
};

export default Index;
