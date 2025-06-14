
import { Puzzle, puzzles } from './puzzleData';

export function getDailyPuzzle(userLevel: number): Puzzle {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const puzzleIndex = (dayOfYear + userLevel - 1) % puzzles.length;
  return puzzles[puzzleIndex];
}

export function getRandomPracticePuzzle(userLevel: number): Puzzle {
  const maxDifficultyForLevel = Math.min(Math.floor(userLevel / 2) + 1, 3);
  const suitablePuzzles = puzzles.filter(p => {
    const difficultyNum = p.difficulty === 'easy' ? 1 : p.difficulty === 'medium' ? 2 : 3;
    return difficultyNum <= maxDifficultyForLevel;
  });
  const randomIndex = Math.floor(Math.random() * suitablePuzzles.length);
  return suitablePuzzles[randomIndex];
}
