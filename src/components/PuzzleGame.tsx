import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import PuzzleHeader from "./PuzzleHeader";
import PuzzleInput from "./PuzzleInput";
import PuzzleCompletion from "./PuzzleCompletion";
import PracticeLimitNotice from "./PracticeLimitNotice";
import { getDailyPuzzle } from "./useDailyPuzzle";
import { usePuzzleGame } from "@/hooks/usePuzzleGame";

interface PuzzleGameProps {
  onComplete: (points: number) => void;
  completed: boolean;
  userLevel: number;
  practiceModeLocked?: boolean;
}

const MAX_PRACTICE_PER_DAY = 3;

const PuzzleGame: React.FC<PuzzleGameProps> = ({
  onComplete,
  completed,
  userLevel,
  practiceModeLocked,
}) => {
  const {
    currentPuzzle,
    userAnswer,
    setUserAnswer,
    showHint,
    setShowHint,
    attempts,
    isCorrect,
    isPracticeMode,
    showPostCompletion,
    loading,
    practiceCount,
    canPractice,
    inputDisabled,
    handleSubmit,
    handleNextPractice,
    handleStartPractice,
    handleExitPractice,
    setShowPostCompletion,
    setIsPracticeMode,
  } = usePuzzleGame({
    userLevel,
    maxPracticePerDay: MAX_PRACTICE_PER_DAY,
    onComplete,
  });

  // Show loading spinner
  if (
    loading ||
    (!currentPuzzle &&
      (!isPracticeMode ||
        (isPracticeMode && practiceCount < MAX_PRACTICE_PER_DAY)))
  ) {
    return (
      <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700 shadow-xl">
        <CardContent>
          <div className="text-center text-blue-300 animate-pulse py-16">
            Generating your challenge...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300">
      <PuzzleHeader
        currentPuzzle={currentPuzzle || getDailyPuzzle()}
        isPracticeMode={isPracticeMode}
        completed={completed}
        onStartPractice={handleStartPractice}
        practiceModeLocked={practiceModeLocked || !canPractice}
      />
      <CardContent className="space-y-6">
        {isPracticeMode && practiceCount >= MAX_PRACTICE_PER_DAY ? (
          <PracticeLimitNotice exitToDaily={handleExitPractice} />
        ) : (completed && !isPracticeMode) || isCorrect ? (
          showPostCompletion && (
            <PuzzleCompletion
              isPracticeMode={isPracticeMode}
              onPracticeMore={handleNextPractice}
              onBackToDaily={() => setShowPostCompletion(false)}
            />
          )
        ) : (
          <>
            <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
              <p className="text-lg text-slate-200 leading-relaxed">
                {currentPuzzle?.question}
              </p>
            </div>
            <PuzzleInput
              userAnswer={userAnswer}
              setUserAnswer={setUserAnswer}
              onSubmit={handleSubmit}
              showHint={showHint}
              setShowHint={setShowHint}
              hint={currentPuzzle?.hint || ""}
              attempts={attempts}
              disabled={inputDisabled || (isPracticeMode && practiceCount >= MAX_PRACTICE_PER_DAY)}
              isPracticeMode={isPracticeMode}
              onExitPractice={handleExitPractice}
            />
            {isPracticeMode && (
              <div className="text-center text-sm mt-3 text-blue-300">
                Practice problems used today: <span className="font-bold">{practiceCount}</span> / {MAX_PRACTICE_PER_DAY}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PuzzleGame;
