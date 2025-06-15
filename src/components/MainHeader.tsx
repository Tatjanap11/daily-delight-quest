
import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

interface MainHeaderProps {
  pointsForNextLevel: number;
}

const MainHeader: React.FC<MainHeaderProps> = ({ pointsForNextLevel }) => (
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
              <li>• Solve daily puzzles to earn points and unlock surprise boxes</li>
              <li>• Use Practice Mode to solve extra puzzles for more points</li>
              <li>• Rate facts to get personalized content</li>
              <li>• Maintain streaks by playing daily</li>
              <li>• Level up to unlock harder puzzles (need {pointsForNextLevel} points per level)</li>
              <li>• Compete on the leaderboard</li>
            </ul>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
    <p className="text-blue-200 text-lg">
      Solve puzzles, unlock fascinating facts, and expand your mind daily!
    </p>
    <p className="mt-3 text-lg font-semibold text-cyan-300" data-testid="daily-challenge-headline">
      {/* Explicitly brings back "Today's Daily Challenge" text */}
      Today's Daily Challenge
    </p>
  </div>
);

export default MainHeader;
