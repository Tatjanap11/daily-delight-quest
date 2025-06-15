
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import PuzzleHeader from "./PuzzleHeader";
import PuzzleInput from "./PuzzleInput";
import PuzzleCompletion from "./PuzzleCompletion";
import { Puzzle } from "./puzzleData";
import { getDailyPuzzle } from "./useDailyPuzzle";
import { usePracticeLimit } from "@/hooks/usePracticeLimit";
import PracticeLimitNotice from "./PracticeLimitNotice";
import { selectPuzzle } from "./puzzleUtils";

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
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [showPostCompletion, setShowPostCompletion] = useState(false);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const { practiceCount, setPracticeCount, canPractice } = usePracticeLimit(MAX_PRACTICE_PER_DAY);

  useEffect(() => {
    setShowPostCompletion(false);
  }, [completed]);

  useEffect(() => {
    const fetchPuzzle = async () => {
      setLoading(true);
      const selected = await selectPuzzle(isPracticeMode, userLevel, practiceCount, MAX_PRACTICE_PER_DAY);
      setCurrentPuzzle(selected);
      setUserAnswer("");
      setShowHint(false);
      setAttempts(0);
      setIsCorrect(false);
      setLoading(false);
    };
    fetchPuzzle();
    // eslint-disable-next-line
  }, [userLevel, isPracticeMode, practiceCount]);

  const handleSubmit = () => {
    if (!currentPuzzle) return;
    const normalized = userAnswer.toLowerCase().trim();
    const correct = currentPuzzle.answer.toLowerCase().trim();
    if (normalized === correct) {
      setIsCorrect(true);
      const bonus = Math.max(0, currentPuzzle.points - attempts * 5);
      const multiplier = isPracticeMode ? 0.5 : 1;
      const finalPoints = Math.floor(bonus * multiplier);

      onComplete(finalPoints);

      if (isPracticeMode) {
        setPracticeCount(practiceCount + 1);
      }

      toast({
        title: isPracticeMode
          ? "🎉 Practice Complete! 🌟"
          : "🎉 Amazing! You got it! 🌟",
        description: `✨ You earned ${finalPoints} ${
          isPracticeMode ? "practice " : "magical "
        }points! ${
          !isPracticeMode ? "The surprise box is sparkling and ready!" : ""
        } ✨`,
        className:
          "bg-gradient-to-r from-emerald-800 to-green-800 border-emerald-600 shadow-xl text-emerald-200",
      });
      setShowPostCompletion(true);
    } else {
      setAttempts((prev) => prev + 1);
      toast({
        title: "🤔 Oopsie! Not quite there yet! 💭",
        description:
          "🌈 Don't worry! Every great mind needs time to think. You've got this! 💪",
        className:
          "bg-gradient-to-r from-pink-800 to-purple-800 border-pink-600 shadow-xl text-pink-200",
      });
    }
  };

  const handleNextPractice = () => {
    if (practiceCount >= MAX_PRACTICE_PER_DAY) {
      setIsPracticeMode(false);
      toast({
        title: "🚫 Practice Limit Reached",
        description: "You can only do 3 practice problems per day. Come back tomorrow for more!",
        className: "bg-gradient-to-r from-pink-800 to-purple-800 border-pink-600 shadow-xl text-pink-200"
      });
      return;
    }
    setIsPracticeMode(true);
    setShowPostCompletion(false);
  };

  const handleStartPractice = () => {
    if (practiceCount >= MAX_PRACTICE_PER_DAY) {
      toast({
        title: "🚫 Practice Limit Reached",
        description: "You can only do 3 practice problems per day. Come back tomorrow for more!",
        className: "bg-gradient-to-r from-pink-800 to-purple-800 border-pink-600 shadow-xl text-pink-200"
      });
      return;
    }
    setIsPracticeMode(true);
  };

  const inputDisabled = completed && !isPracticeMode;

  if (loading || (!currentPuzzle && (!isPracticeMode || (isPracticeMode && practiceCount < MAX_PRACTICE_PER_DAY)))) {
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
          <PracticeLimitNotice exitToDaily={() => setIsPracticeMode(false)} />
        ) : ((completed && !isPracticeMode) || isCorrect) && showPostCompletion ? (
          <PuzzleCompletion
            isPracticeMode={isPracticeMode}
            onPracticeMore={handleNextPractice}
            onBackToDaily={() => setShowPostCompletion(false)}
          />
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
              onExitPractice={() => setIsPracticeMode(false)}
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
