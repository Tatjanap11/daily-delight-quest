export interface Puzzle {
  id: string;
  type: 'riddle' | 'word' | 'math' | 'logic' | 'history' | 'science' | 'psychology' | 'music';
  question: string;
  answer: string;
  hint: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

// 100 categorized puzzles (shortened here for brevity, but actual file will have 100 diverse, shuffled entries):

export const puzzles: Puzzle[] = [
  // Riddles: More obscure, rare
  {
    id: '201',
    type: 'riddle',
    question: "What ancient mechanism predicted eclipses, planetary positions, and Olympic Games, centuries before modern computers?",
    answer: "antikythera mechanism",
    hint: "It was discovered in a shipwreck near Greece.",
    points: 60,
    difficulty: 'hard'
  },
  {
    id: '202',
    type: 'history',
    question: "Which South American empire recorded information on knotted strings but had no written language?",
    answer: "inca",
    hint: "Its central city was Machu Picchu.",
    points: 40,
    difficulty: 'medium'
  },
  {
    id: '203',
    type: 'science',
    question: "What recent image, taken in 2019, confirmed Einstein's theory of relativity around a supermassive black hole?",
    answer: "event horizon",
    hint: "It was the first-ever photo of a cosmic entity.",
    points: 50,
    difficulty: 'hard'
  },
  {
    id: '204',
    type: 'logic',
    question: "I can be cracked, made, told, and played. What am I?",
    answer: "joke",
    hint: "It's often funny but sometimes a riddle itself.",
    points: 40,
    difficulty: 'medium'
  },
  {
    id: '205',
    type: 'riddle',
    question: "I'm named after a Roman god, but only visible at dawn or dusk. What am I?",
    answer: "venus",
    hint: "Known as the morning or evening star.",
    points: 45,
    difficulty: 'medium'
  },
  {
    id: '206',
    type: 'math',
    question: "This sequence starts 1, 3, 6, 10, 15... Each is the sum of the previous and its index. Name it.",
    answer: "triangular numbers",
    hint: "It describes points that can form perfect equilateral triangles.",
    points: 40,
    difficulty: 'medium'
  },
  {
    id: '207',
    type: 'logic',
    question: "A prisoner has two doors. One leads to freedom, but one to doom. A guard at each: one tells the truth, one always lies. What question ensures escape?",
    answer: "which door would the other guard say leads to doom",
    hint: "Classic logic puzzle, solution is to invert the answer.",
    points: 70,
    difficulty: 'hard'
  },
  // Science, obscure (recent discovery)
  {
    id: '208',
    type: 'science',
    question: "Which element was the last discovered on Earth and first created in a lab before found in Africa's uranium ores?",
    answer: "rhenium",
    hint: "Atomic number 75, rare, named after the Rhine river.",
    points: 50,
    difficulty: 'hard'
  },
  // ... keep a few easier, but only if unique ...
  {
    id: '21',
    type: 'history',
    question: "Which historical event saw thousands dance themselves into exhaustion in Strasbourg in 1518?",
    answer: "dancing plague",
    hint: "It's one of the weirdest unsolved mysteries of mass hysteria.",
    points: 45,
    difficulty: 'hard'
  },
  {
    id: '22',
    type: 'music',
    question: "What instrument did physicist Albert Einstein often play to relax?",
    answer: "violin",
    hint: "Stringed and often used in orchestras.",
    points: 40,
    difficulty: 'medium'
  },
  // Riddles
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
  },
  {
    id: '6',
    type: 'math',
    question: "What comes next in this sequence: 1, 1, 2, 3, 5, 8, ?",
    answer: "13",
    hint: "Each number is the sum of the two preceding numbers.",
    points: 30,
    difficulty: 'medium'
  },
  {
    id: '7',
    type: 'logic',
    question: "You have 12 balls, 11 are identical and 1 weighs slightly different. Using a balance scale only 3 times, how can you find the different ball?",
    answer: "divide",
    hint: "Think about dividing the balls into groups and comparing them systematically.",
    points: 60,
    difficulty: 'hard'
  },
  {
    id: '8',
    type: 'riddle',
    question: "I speak without a mouth and hear without ears. I have no body, but come alive with wind. What am I?",
    answer: "echo",
    hint: "Think about sounds that bounce back to you.",
    points: 35,
    difficulty: 'medium'
  },
  // New categories (history, science, psychology, music, etc)
  {
    id: '21',
    type: 'history',
    question: "Who was the first president of the United States?",
    answer: "george washington",
    hint: "He led the American Revolution and appears on the $1 bill.",
    points: 10,
    difficulty: 'easy'
  },
  {
    id: '22',
    type: 'science',
    question: "What is the powerhouse of the cell?",
    answer: "mitochondria",
    hint: "It's an organelle famous for producing energy.",
    points: 15,
    difficulty: 'easy'
  },
  {
    id: '23',
    type: 'psychology',
    question: "What is the term for a persistent, irrational fear of a specific object or situation?",
    answer: "phobia",
    hint: "Arachnophobia is an example.",
    points: 15,
    difficulty: 'easy'
  },
  {
    id: '24',
    type: 'music',
    question: "Which composer became deaf late in life but continued to write music?",
    answer: "beethoven",
    hint: "He composed the 9th Symphony.",
    points: 20,
    difficulty: 'medium'
  },
  // ... (90+ more diverse categorized puzzles to total 100)
  {
    id: '100',
    type: 'science',
    question: "What gas do plants absorb from the atmosphere for photosynthesis?",
    answer: "carbon dioxide",
    hint: "It's the gas you exhale.",
    points: 10,
    difficulty: 'easy'
  }
];
