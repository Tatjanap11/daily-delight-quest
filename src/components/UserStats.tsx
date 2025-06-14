
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Gift, Brain, Zap, Target } from 'lucide-react';

interface UserStatsProps {
  stats: {
    level: number;
    points: number;
    boxesOpened: number;
    streak: number;
    totalCorrectAnswers: number;
  };
}

const UserStats: React.FC<UserStatsProps> = ({ stats }) => {
  const pointsForNextLevel = stats.level * 100;
  const progressToNextLevel = (stats.points % 100) / 100 * 100;
  
  const achievements = [
    {
      title: 'First Steps',
      description: 'Complete your first puzzle',
      achieved: stats.totalCorrectAnswers >= 1,
      icon: Brain,
      color: 'text-blue-500'
    },
    {
      title: 'Streak Master',
      description: 'Maintain a 7-day streak',
      achieved: stats.streak >= 7,
      icon: Zap,
      color: 'text-yellow-500'
    },
    {
      title: 'Treasure Hunter',
      description: 'Open 10 surprise boxes',
      achieved: stats.boxesOpened >= 10,
      icon: Gift,
      color: 'text-purple-500'
    },
    {
      title: 'Knowledge Seeker',
      description: 'Reach level 5',
      achieved: stats.level >= 5,
      icon: Trophy,
      color: 'text-gold-500'
    },
    {
      title: 'Perfect Score',
      description: 'Answer 25 puzzles correctly',
      achieved: stats.totalCorrectAnswers >= 25,
      icon: Target,
      color: 'text-green-500'
    }
  ];

  const statCards = [
    {
      title: 'Current Level',
      value: stats.level,
      icon: Trophy,
      color: 'from-yellow-400 to-orange-500',
      description: `${Math.floor(progressToNextLevel)}% to next level`
    },
    {
      title: 'Total Points',
      value: stats.points,
      icon: Star,
      color: 'from-purple-400 to-pink-500',
      description: 'Points earned'
    },
    {
      title: 'Boxes Opened',
      value: stats.boxesOpened,
      icon: Gift,
      color: 'from-blue-400 to-cyan-500',
      description: 'Discoveries unlocked'
    },
    {
      title: 'Current Streak',
      value: stats.streak,
      icon: Zap,
      color: 'from-green-400 to-emerald-500',
      description: 'Days in a row'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Level Progress */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Level Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold">Level {stats.level}</span>
            <Badge variant="secondary">{stats.points} points</Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress to Level {stats.level + 1}</span>
              <span>{Math.floor(progressToNextLevel)}%</span>
            </div>
            <Progress value={progressToNextLevel} className="h-3" />
          </div>
          <p className="text-sm text-gray-500">
            Need {pointsForNextLevel - (stats.points % 100)} more points to level up!
          </p>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6 text-center">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-sm font-medium text-gray-600">{stat.title}</div>
                <div className="text-xs text-gray-500">{stat.description}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Achievements */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-purple-500" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {achievements.map((achievement) => (
              <div
                key={achievement.title}
                className={`flex items-center gap-3 p-4 rounded-lg border transition-all duration-200 ${
                  achievement.achieved
                    ? 'bg-green-50 border-green-200 shadow-sm'
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  achievement.achieved ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <achievement.icon className={`w-5 h-5 ${
                    achievement.achieved ? 'text-green-600' : 'text-gray-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className={`font-medium ${
                    achievement.achieved ? 'text-green-800' : 'text-gray-500'
                  }`}>
                    {achievement.title}
                  </div>
                  <div className={`text-sm ${
                    achievement.achieved ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {achievement.description}
                  </div>
                </div>
                {achievement.achieved && (
                  <Badge className="bg-green-100 text-green-700">
                    ✓ Unlocked
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserStats;
