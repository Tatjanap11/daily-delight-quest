
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lightbulb, AlertCircle } from "lucide-react";
import { Puzzle } from "./puzzleData";

interface PuzzleInputProps {
  userAnswer: string;
  setUserAnswer: (val: string) => void;
  onSubmit: () => void;
  showHint: boolean;
  setShowHint: (b: boolean) => void;
  hint: string;
  attempts: number;
  disabled: boolean;
  isPracticeMode: boolean;
  onExitPractice: () => void;
}

const PuzzleInput: React.FC<PuzzleInputProps> = ({
  userAnswer,
  setUserAnswer,
  onSubmit,
  showHint,
  setShowHint,
  hint,
  attempts,
  disabled,
  isPracticeMode,
  onExitPractice,
}) => (
  <div className="space-y-4">
    <div className="flex gap-2">
      <Input
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="Enter your answer..."
        onKeyPress={(e) => e.key === 'Enter' && onSubmit()}
        className="flex-1 bg-slate-700 border-slate-600 text-slate-200 placeholder:text-slate-400"
        disabled={disabled}
      />
      <Button
        onClick={onSubmit}
        disabled={!userAnswer.trim() || disabled}
        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
      >
        Submit
      </Button>
    </div>
    <div className="flex justify-between items-center">
      <Button
        variant="outline"
        onClick={() => setShowHint(!showHint)}
        className="text-sm border-slate-600 text-slate-300 hover:bg-slate-700"
        disabled={disabled}
      >
        <Lightbulb className="w-4 h-4 mr-2" />
        {showHint ? 'Hide' : 'Show'} Hint
      </Button>
      <div className="flex items-center gap-4">
        {attempts > 0 && (
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <AlertCircle className="w-4 h-4" />
            {attempts} attempt{attempts !== 1 ? 's' : ''}
          </div>
        )}
        {isPracticeMode && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onExitPractice}
            className="text-xs text-slate-400 hover:text-slate-200"
            disabled={disabled}
          >
            Exit Practice
          </Button>
        )}
      </div>
    </div>
    {showHint && (
      <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-5 h-5 text-blue-400 mt-0.5" />
          <div>
            <p className="font-medium text-blue-300 mb-1">Hint:</p>
            <p className="text-blue-200">{hint}</p>
          </div>
        </div>
      </div>
    )}
  </div>
);

export default PuzzleInput;
