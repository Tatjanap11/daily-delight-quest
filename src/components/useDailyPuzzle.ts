
import { Puzzle, puzzles } from './puzzleData';

// --- FIXED: Remove userLevel from the daily puzzle selection (it only depends on day now) ---
export function getDailyPuzzle(): Puzzle {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const puzzleIndex = dayOfYear % puzzles.length;
  return puzzles[puzzleIndex];
}

// Practice Mode: still uses user's level for difficulty gating
export function getRandomPracticePuzzle(userLevel: number): Puzzle {
  const maxDifficultyForLevel = Math.min(Math.floor(userLevel / 2) + 1, 3);
  const suitablePuzzles = puzzles.filter(p => {
    const difficultyNum = p.difficulty === 'easy' ? 1 : p.difficulty === 'medium' ? 2 : 3;
    return difficultyNum <= maxDifficultyForLevel;
  });
  const randomIndex = Math.floor(Math.random() * suitablePuzzles.length);
  return suitablePuzzles[randomIndex];
}

