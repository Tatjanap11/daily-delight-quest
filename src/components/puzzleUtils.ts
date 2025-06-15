
// Helper function to select a puzzle (daily or practice)
import { getDailyPuzzle, getRandomPracticePuzzle } from "./useDailyPuzzle";
import { Puzzle } from "./puzzleData";

export async function selectPuzzle(
  isPractice: boolean,
  userLevel: number,
  practiceCount: number,
  maxPracticePerDay: number
): Promise<Puzzle | null> {
  if (isPractice) {
    if (practiceCount >= maxPracticePerDay) return null;
    const { puzzle } = await getRandomPracticePuzzle(userLevel);
    return puzzle;
  } else {
    return getDailyPuzzle();
  }
}
