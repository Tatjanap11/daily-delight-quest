import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Brain, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PuzzleGameProps {
  onComplete: (points: number) => void;
  completed: boolean;
  userLevel: number;
}

interface Puzzle {
  id: string;
  type: 'riddle' | 'word' | 'math' | 'logic';
  question: string;
  answer: string;
  hint: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

const puzzles: Puzzle[] = [
  {
    id: '1',
    type: 'riddle',
    question: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?",
    answer: "map",
    hint: "Think about something that represents places but isn't the actual place.",
    points: 25,
    difficulty: 'easy'
  },
  {
    id: '2',
    type: 'word',
    question: "What 8-letter word can have a letter taken away and it still makes a word? Take another letter away and it still makes a word. Keep on doing that until you have one letter left. What is the word?",
    answer: "starting",
    hint: "Think about words that can be shortened progressively: starting → tarting → arting → ting → ing → in → i",
    points: 40,
    difficulty: 'medium'
  },
  {
    id: '3',
    type: 'logic',
    question: "A man lives on the 20th floor of an apartment building. Every morning he takes the elevator down to the ground floor. When he comes home, he takes the elevator to the 10th floor and walks the rest of the way... except on rainy days, when he takes the elevator all the way to the 20th floor. Why?",
    answer: "short",
    hint: "Think about physical limitations and what rain might enable someone to do differently.",
    points: 50,
    difficulty: 'hard'
  },
  {
    id: '4',
    type: 'math',
    question: "If you multiply me by any other number, the answer will always be the same. What number am I?",
    answer: "0",
    hint: "Think about the properties of multiplication with special numbers.",
    points: 20,
    difficulty: 'easy'
  },
  {
    id: '5',
    type: 'riddle',
    question: "The more you take, the more you leave behind. What am I?",
    answer: "footsteps",
    hint: "Think about something you create by moving forward.",
    points: 30,
    difficulty: 'easy'
  }
];

const PuzzleGame: React.FC<PuzzleGameProps> = ({ onComplete, completed, userLevel }) => {
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Select a puzzle based on the day and user level
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const puzzleIndex = (dayOfYear + userLevel - 1) % puzzles.length;
    setCurrentPuzzle(puzzles[puzzleIndex]);
  }, [userLevel]);

  const handleSubmit = () => {
    if (!currentPuzzle || completed) return;

    const normalizedAnswer = userAnswer.toLowerCase().trim();
    const correctAnswer = currentPuzzle.answer.toLowerCase().trim();

    if (normalizedAnswer === correctAnswer) {
      setIsCorrect(true);
      const bonusPoints = Math.max(0, currentPuzzle.points - (attempts * 5));
      onComplete(bonusPoints);
      
      toast({
        title: "🎉 Correct!",
        description: `You earned ${bonusPoints} points! The surprise box is now unlocked.`,
      });

      // Save completion for today
      const today = new Date().toDateString();
      localStorage.setItem(`completed_${today}`, 'true');
    } else {
      setAttempts(prev => prev + 1);
      toast({
        title: "Not quite right",
        description: "Try again! You can do this.",
        variant: "destructive"
      });
    }
  };

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

  if (!currentPuzzle) return null;

  return (
    <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Brain className="w-6 h-6 text-blue-400" />
          <CardTitle className="text-2xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Today's Challenge
          </CardTitle>
        </div>
        <div className="flex justify-center gap-2">
          <Badge className={getDifficultyColor(currentPuzzle.difficulty)}>
            {currentPuzzle.difficulty.toUpperCase()}
          </Badge>
          <Badge variant="outline" className="border-slate-600 text-slate-300">
            {getTypeIcon(currentPuzzle.type)} {currentPuzzle.type.toUpperCase()}
          </Badge>
          <Badge variant="secondary" className="bg-blue-900/50 text-blue-300 border-blue-700">
            {currentPuzzle.points} points
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {completed || isCorrect ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto border border-emerald-700">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-emerald-400 mb-2">
                Puzzle Complete! 🎉
              </h3>
              <p className="text-slate-300">
                Great job! You can now open today's surprise box to discover something amazing.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
              <p className="text-lg text-slate-200 leading-relaxed">
                {currentPuzzle.question}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Enter your answer..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  className="flex-1 bg-slate-700 border-slate-600 text-slate-200 placeholder:text-slate-400"
                />
                <Button 
                  onClick={handleSubmit}
                  disabled={!userAnswer.trim()}
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
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  {showHint ? 'Hide' : 'Show'} Hint
                </Button>
                {attempts > 0 && (
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <AlertCircle className="w-4 h-4" />
                    {attempts} attempt{attempts !== 1 ? 's' : ''}
                  </div>
                )}
              </div>

              {showHint && (
                <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-300 mb-1">Hint:</p>
                      <p className="text-blue-200">{currentPuzzle.hint}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PuzzleGame;
