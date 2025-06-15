import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lightbulb, AlertCircle } from "lucide-react";
import { Puzzle } from "./puzzleData";
import AttemptsTracker from "./puzzle/AttemptsTracker";
import HintToggle from "./puzzle/HintToggle";

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
      <HintToggle showHint={showHint} setShowHint={setShowHint} disabled={disabled} hint={hint} />
      <div className="flex items-center gap-4">
        <AttemptsTracker attempts={attempts} />
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
  </div>
);

export default PuzzleInput;
