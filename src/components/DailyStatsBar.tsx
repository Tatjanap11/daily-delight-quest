
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Zap, ArrowRight } from 'lucide-react';

interface DailyStatsBarProps {
  userStats: {
    level: number;
    points: number;
    boxesOpened: number;
    streak: number;
    totalCorrectAnswers: number;
  };
  pointsForNextLevel: number;
  progressToNextLevel: number;
  canLevelUp: boolean;
  onLevelUp: () => void;
}

const DailyStatsBar: React.FC<DailyStatsBarProps> = ({
  userStats,
  pointsForNextLevel,
  progressToNextLevel,
  canLevelUp,
  onLevelUp,
}) => (
  <Card className="mb-8 bg-slate-800/90 backdrop-blur-sm border-slate-700 shadow-lg">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="font-semibold text-slate-200">
              Level {userStats.level}
            </span>
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
          {canLevelUp ? (
            <Button 
              onClick={onLevelUp}
              className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold animate-pulse"
            >
              Level Up! <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <div className="text-sm text-slate-400">
              Need {pointsForNextLevel - userStats.points} more points to level up
            </div>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-slate-300">
          <span>Progress to Level {userStats.level + 1}</span>
          <span>{Math.floor(progressToNextLevel)}% ({userStats.points}/{pointsForNextLevel})</span>
        </div>
        <Progress value={progressToNextLevel} className="h-2 bg-slate-700" />
      </div>
    </CardContent>
  </Card>
);

export default DailyStatsBar;
