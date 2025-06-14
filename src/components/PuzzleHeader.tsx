
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap } from 'lucide-react';
import { Puzzle } from './puzzleData';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface PuzzleHeaderProps {
  currentPuzzle: Puzzle;
  isPracticeMode: boolean;
  completed: boolean;
  onStartPractice: () => void;
  practiceModeLocked?: boolean; // new prop
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return 'bg-emerald-900/50 text-emerald-300 border-emerald-700';
    case 'medium': return 'bg-amber-900/50 text-amber-300 border-amber-700';
    case 'hard': return 'bg-red-900/50 text-red-300 border-red-700';
    default: return 'bg-slate-700 text-slate-300 border-slate-600';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'riddle': return '🧩';
    case 'word': return '📝';
    case 'math': return '🔢';
    case 'logic': return '🤔';
    default: return '❓';
  }
};

const PuzzleHeader: React.FC<PuzzleHeaderProps> = ({
  currentPuzzle,
  isPracticeMode,
  completed,
  onStartPractice,
  practiceModeLocked
}) => (
  <CardHeader className="text-center">
    <div className="flex items-center justify-center gap-2 mb-2">
      <Brain className="w-6 h-6 text-blue-400" />
      <CardTitle className="text-2xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
        {isPracticeMode ? 'Practice Challenge' : "Today's Challenge"}
      </CardTitle>
    </div>
    <div className="flex justify-center gap-2 mb-2">
      <Badge className={getDifficultyColor(currentPuzzle.difficulty)}>
        {currentPuzzle.difficulty.toUpperCase()}
      </Badge>
      <Badge variant="outline" className="border-slate-600 text-slate-300">
        {getTypeIcon(currentPuzzle.type)} {currentPuzzle.type.toUpperCase()}
      </Badge>
      <Badge variant="secondary" className="bg-blue-900/50 text-blue-300 border-blue-700">
        {isPracticeMode ? Math.floor(currentPuzzle.points * 0.5) : currentPuzzle.points} points
      </Badge>
    </div>
    {!isPracticeMode && (
      <div className="flex justify-center">
        {practiceModeLocked ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="text-xs border-slate-700 text-slate-400 opacity-60 pointer-events-none"
                  style={{ cursor: "not-allowed" }}
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Practice Mode
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent className="bg-slate-800 border-slate-700 text-slate-200 max-w-xs">
              You’ve leveled up! New practice challenges will appear after your next daily challenge.
            </TooltipContent>
          </Tooltip>
        ) : !completed ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onStartPractice}
            className="text-xs border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <Zap className="w-3 h-3 mr-1" />
            Practice Mode
          </Button>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="text-xs border-slate-700 text-slate-400 opacity-60 pointer-events-none"
                  style={{ cursor: "not-allowed" }}
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Practice Mode
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent className="bg-slate-800 border-slate-700 text-slate-200 max-w-xs">
              When you solve the next daily challenge, more practice challenges will appear!
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    )}
  </CardHeader>
);

export default PuzzleHeader;
