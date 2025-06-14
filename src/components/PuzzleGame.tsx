import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import PuzzleHeader from './PuzzleHeader';
import PuzzleInput from './PuzzleInput';
import PuzzleCompletion from './PuzzleCompletion';
import { puzzles, Puzzle } from './puzzleData';
import { getDailyPuzzle, getRandomPracticePuzzle } from './useDailyPuzzle';

interface PuzzleGameProps {
  onComplete: (points: number) => void;
  completed: boolean;
  userLevel: number;
  practiceModeLocked?: boolean; // new prop, optional for backward compatibility
}

const PuzzleGame: React.FC<PuzzleGameProps> = ({ onComplete, completed, userLevel, practiceModeLocked }) => {
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [practiceCount, setPracticeCount] = useState(0);
  const [showPostCompletion, setShowPostCompletion] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    selectPuzzle();
  }, [userLevel, isPracticeMode, practiceCount]);

  useEffect(() => {
    setShowPostCompletion(false);
  }, [completed]);

  const selectPuzzle = () => {
    if (isPracticeMode) {
      setCurrentPuzzle(getRandomPracticePuzzle(userLevel));
    } else {
      setCurrentPuzzle(getDailyPuzzle());
    }
    setUserAnswer('');
    setShowHint(false);
    setAttempts(0);
    setIsCorrect(false);
  };

  const handleSubmit = () => {
    if (!currentPuzzle) return;
    const normalizedAnswer = userAnswer.toLowerCase().trim();
    const correctAnswer = currentPuzzle.answer.toLowerCase().trim();
    if (normalizedAnswer === correctAnswer) {
      setIsCorrect(true);
      const bonusPoints = Math.max(0, currentPuzzle.points - (attempts * 5));
      const practiceMultiplier = isPracticeMode ? 0.5 : 1;
      const finalPoints = Math.floor(bonusPoints * practiceMultiplier);

      onComplete(finalPoints);

      toast({
        title: isPracticeMode ? "🎉 Practice Complete! 🌟" : "🎉 Amazing! You got it! 🌟",
        description: `✨ You earned ${finalPoints} ${isPracticeMode ? 'practice ' : 'magical '}points! ${!isPracticeMode ? 'The surprise box is sparkling and ready!' : ''} ✨`,
        className: "bg-gradient-to-r from-emerald-800 to-green-800 border-emerald-600 shadow-xl text-emerald-200"
      });
      setShowPostCompletion(true);
    } else {
      setAttempts(prev => prev + 1);
      toast({
        title: "🤔 Oopsie! Not quite there yet! 💭",
        description: "🌈 Don't worry! Every great mind needs time to think. You've got this! 💪",
        className: "bg-gradient-to-r from-pink-800 to-purple-800 border-pink-600 shadow-xl text-pink-200"
      });
    }
  };

  const handleNextPractice = () => {
    setIsPracticeMode(true);
    setPracticeCount(prev => prev + 1);
    setShowPostCompletion(false);
  };

  if (!currentPuzzle) return null;

  // For the daily puzzle, after it's completed, disable input/submit.
  const inputDisabled = completed && !isPracticeMode;

  return (
    <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300">
      <PuzzleHeader
        currentPuzzle={currentPuzzle}
        isPracticeMode={isPracticeMode}
        completed={completed}
        onStartPractice={() => setIsPracticeMode(true)}
        practiceModeLocked={practiceModeLocked}
      />
      <CardContent className="space-y-6">
        {((completed && !isPracticeMode) || isCorrect) && showPostCompletion ? (
          <PuzzleCompletion
            isPracticeMode={isPracticeMode}
            onPracticeMore={handleNextPractice}
            onBackToDaily={() => setShowPostCompletion(false)}
          />
        ) : (
          <>
            <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
              <p className="text-lg text-slate-200 leading-relaxed">
                {currentPuzzle.question}
              </p>
            </div>
            <PuzzleInput
              userAnswer={userAnswer}
              setUserAnswer={setUserAnswer}
              onSubmit={handleSubmit}
              showHint={showHint}
              setShowHint={setShowHint}
              hint={currentPuzzle.hint}
              attempts={attempts}
              disabled={inputDisabled}
              isPracticeMode={isPracticeMode}
              onExitPractice={() => setIsPracticeMode(false)}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PuzzleGame;
