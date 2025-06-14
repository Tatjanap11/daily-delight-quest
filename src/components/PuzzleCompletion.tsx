
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, RotateCcw } from "lucide-react";

interface PuzzleCompletionProps {
  isPracticeMode: boolean;
  onPracticeMore: () => void;
  onBackToDaily: () => void;
}

const PuzzleCompletion: React.FC<PuzzleCompletionProps> = ({
  isPracticeMode,
  onPracticeMore,
  onBackToDaily,
}) => (
  <div className="text-center space-y-4">
    <div className="w-16 h-16 bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto border border-emerald-700">
      <CheckCircle className="w-8 h-8 text-emerald-400" />
    </div>
    <div>
      <h3 className="text-xl font-semibold text-emerald-400 mb-2">
        {isPracticeMode ? 'Practice Complete! 🎉' : 'Puzzle Complete! 🎉'}
      </h3>
      <p className="text-slate-300 mb-4">
        {isPracticeMode
          ? 'Great practice! Try another one to earn more points.'
          : "Great job! You can now open today's surprise box to discover something amazing. Want more practice for extra points?"}
      </p>
      <Button
        onClick={onPracticeMore}
        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Practice More Challenges
      </Button>
      {!isPracticeMode && (
        <Button
          variant="ghost"
          onClick={onBackToDaily}
          className="text-xs text-slate-400 hover:text-slate-200 ml-2"
        >
          Back to Today's Challenge
        </Button>
      )}
    </div>
  </div>
);

export default PuzzleCompletion;
