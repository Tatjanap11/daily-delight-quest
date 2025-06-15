
import { useState, useEffect } from "react";
import { Puzzle } from "@/components/puzzleData";
import { getDailyPuzzle } from "@/components/useDailyPuzzle";
import { selectPuzzle } from "@/components/puzzleUtils";
import { useToast } from "@/hooks/use-toast";
import { usePracticeLimit } from "@/hooks/usePracticeLimit";

export interface UsePuzzleGameProps {
  userLevel: number;
  maxPracticePerDay?: number;
  onComplete: (points: number) => void;
}

export function usePuzzleGame({
  userLevel,
  maxPracticePerDay = 3,
  onComplete,
}: UsePuzzleGameProps) {
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [showPostCompletion, setShowPostCompletion] = useState(false);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const { practiceCount, setPracticeCount, canPractice } =
    usePracticeLimit(maxPracticePerDay);

  useEffect(() => {
    setShowPostCompletion(false);
  }, [isCorrect]);

  useEffect(() => {
    const fetchPuzzle = async () => {
      setLoading(true);
      const selected = await selectPuzzle(
        isPracticeMode,
        userLevel,
        practiceCount,
        maxPracticePerDay
      );
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
    if (practiceCount >= maxPracticePerDay) {
      setIsPracticeMode(false);
      toast({
        title: "🚫 Practice Limit Reached",
        description:
          "You can only do 3 practice problems per day. Come back tomorrow for more!",
        className:
          "bg-gradient-to-r from-pink-800 to-purple-800 border-pink-600 shadow-xl text-pink-200",
      });
      return;
    }
    setIsPracticeMode(true);
    setShowPostCompletion(false);
  };

  const handleStartPractice = () => {
    if (practiceCount >= maxPracticePerDay) {
      toast({
        title: "🚫 Practice Limit Reached",
        description:
          "You can only do 3 practice problems per day. Come back tomorrow for more!",
        className:
          "bg-gradient-to-r from-pink-800 to-purple-800 border-pink-600 shadow-xl text-pink-200",
      });
      return;
    }
    setIsPracticeMode(true);
  };

  const handleExitPractice = () => {
    setIsPracticeMode(false);
    setShowPostCompletion(false);
    setUserAnswer("");
    setShowHint(false);
    setAttempts(0);
    setIsCorrect(false);
  };

  const inputDisabled = isCorrect && !isPracticeMode;

  return {
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
  };
}
