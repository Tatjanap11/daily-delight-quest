
import React from "react";
import { Button } from "@/components/ui/button";
import { Brain, Zap } from "lucide-react";

interface PuzzleHeaderProps {
  currentPuzzle: any;
  isPracticeMode: boolean;
  completed: boolean;
  onStartPractice: () => void;
  practiceModeLocked?: boolean;
}

const PuzzleHeader: React.FC<PuzzleHeaderProps> = ({
  currentPuzzle,
  isPracticeMode,
  completed,
  onStartPractice,
  practiceModeLocked,
}) => (
  <div className="flex items-center justify-between p-6 border-b border-slate-700">
    <div className="flex items-center gap-2">
      <Brain className="w-6 h-6 text-cyan-400" />
      {!isPracticeMode ? (
        <span className="text-xl font-bold text-cyan-200">
          Daily Challenge
        </span>
      ) : (
        <span className="text-xl font-bold text-purple-400">
          Practice Mode
        </span>
      )}
    </div>
    {!isPracticeMode && !completed && (
      <Button
        variant="outline"
        className="bg-gradient-to-r from-purple-800 to-blue-900 text-white font-semibold px-4 py-2 rounded-lg shadow hover:from-purple-900 hover:to-blue-950 border-0"
        onClick={onStartPractice}
        disabled={practiceModeLocked}
      >
        <Zap className="w-4 h-4 mr-1" />
        Practice Mode
      </Button>
    )}
  </div>
);

export default PuzzleHeader;
