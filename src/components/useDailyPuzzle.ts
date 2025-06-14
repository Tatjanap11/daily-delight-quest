import { Puzzle, puzzles } from './puzzleData';

// Helper to track used puzzle ids in localStorage
function getUsedPracticeIds(): Set<string> {
  try {
    const raw = localStorage.getItem('usedPracticePuzzles');
    if (!raw) return new Set();
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
}
function markPracticeIdUsed(id: string) {
  const used = getUsedPracticeIds();
  used.add(id);
  localStorage.setItem('usedPracticePuzzles', JSON.stringify(Array.from(used)));
}
function resetPracticeIdsIfNeeded() {
  const today = new Date().toDateString();
  const marked = localStorage.getItem('usedPracticeDay');
  if (marked !== today) {
    localStorage.setItem('usedPracticeDay', today);
    localStorage.setItem('usedPracticePuzzles', JSON.stringify([]));
  }
}
resetPracticeIdsIfNeeded();

// --- Daily puzzle stays as before ---
export function getDailyPuzzle(): Puzzle {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const puzzleIndex = dayOfYear % puzzles.length;
  return puzzles[puzzleIndex];
}

// --- Practice: Returns {puzzle, fromAI} ---
export async function getRandomPracticePuzzle(userLevel: number): Promise<{ puzzle: Puzzle; fromAI: boolean }> {
  resetPracticeIdsIfNeeded();
  // Random unused fixed puzzles
  const usedIds = getUsedPracticeIds();
  const filtered = puzzles.filter(p => !usedIds.has(p.id));
  // Determine puzzles allowed for the user level
  const maxDifficultyForLevel = Math.min(Math.floor(userLevel / 2) + 1, 3);
  const suitablePuzzles = filtered.filter(p => {
    const difficultyNum = p.difficulty === 'easy' ? 1 : p.difficulty === 'medium' ? 2 : 3;
    return difficultyNum <= maxDifficultyForLevel;
  });
  if (suitablePuzzles.length) {
    // random pick
    const randomIndex = Math.floor(Math.random() * suitablePuzzles.length);
    const puzzle = suitablePuzzles[randomIndex];
    markPracticeIdUsed(puzzle.id);
    return { puzzle, fromAI: false };
  }
  // Otherwise, generate a new one with AI 
  try {
    const res = await fetch('https://vvpdemhsuufwogokpkzx.functions.supabase.co/generate-puzzle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userLevel }), // For now random category, may send more in future
    });
    const data = await res.json();
    // Expected: { question, answer, hint, category, points, difficulty }
    return {
      puzzle: {
        id: 'ai-' + Date.now(),
        type: data.category,
        question: data.question,
        answer: data.answer,
        hint: data.hint,
        points: data.points,
        difficulty: data.difficulty
      },
      fromAI: true
    };
  } catch (e) {
    // fallback: random from all (may repeat)
    const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    return { puzzle, fromAI: false };
  }
}
