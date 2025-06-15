
export interface Puzzle {
  id: string;
  type: 'riddle' | 'word' | 'math' | 'logic' | 'history' | 'science' | 'psychology' | 'music';
  question: string;
  answer: string;
  hint: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Sophisticated and challenging puzzles
export const puzzles: Puzzle[] = [
  // Advanced Riddles
  {
    id: '1',
    type: 'riddle',
    question: "I am the silence between notes that gives music meaning, the pause between words that creates emphasis, and the space between thoughts that allows understanding. What am I?",
    answer: "rest",
    hint: "Think about what gives structure to time-based art forms.",
    points: 50,
    difficulty: 'hard'
  },
  {
    id: '2',
    type: 'word',
    question: "What English word becomes shorter when you add two letters to it?",
    answer: "short",
    hint: "Think literally about the word's meaning when letters are added.",
    points: 45,
    difficulty: 'medium'
  },
  {
    id: '3',
    type: 'logic',
    question: "In a room of 23 people, what's the probability that at least two share the same birthday?",
    answer: "50%",
    hint: "This famous paradox seems counterintuitive - think about all possible pairs.",
    points: 60,
    difficulty: 'hard'
  },
  {
    id: '4',
    type: 'math',
    question: "What is the only number that is equal to the sum of its digits raised to consecutive powers starting from 1?",
    answer: "135",
    hint: "Try: 1^1 + 3^2 + 5^3",
    points: 55,
    difficulty: 'hard'
  },
  {
    id: '5',
    type: 'history',
    question: "Which Byzantine Emperor's legal code became the foundation for modern European law and is still studied today?",
    answer: "justinian",
    hint: "His code was compiled around 529-534 CE and influenced legal systems for over 1000 years.",
    points: 50,
    difficulty: 'medium'
  },
  {
    id: '6',
    type: 'science',
    question: "What quantum phenomenon allows particles to instantaneously affect each other regardless of distance?",
    answer: "entanglement",
    hint: "Einstein called it 'spooky action at a distance' but it's now proven real.",
    points: 45,
    difficulty: 'medium'
  },
  {
    id: '7',
    type: 'psychology',
    question: "What cognitive bias causes people to overestimate their ability to predict outcomes after they've already occurred?",
    answer: "hindsight bias",
    hint: "Also known as the 'I-knew-it-all-along' effect.",
    points: 40,
    difficulty: 'medium'
  },
  {
    id: '8',
    type: 'music',
    question: "What musical interval, when inverted, creates its complement to reach an octave?",
    answer: "tritone",
    hint: "This 'devil's interval' inverts to itself - 6 semitones up or down.",
    points: 55,
    difficulty: 'hard'
  },
  {
    id: '9',
    type: 'riddle',
    question: "I am not visible, yet I shape everything you see. I have no mass, yet I bend light. I can be curved, folded, and torn. What am I?",
    answer: "spacetime",
    hint: "Einstein showed that this fabric of reality can be manipulated by mass and energy.",
    points: 65,
    difficulty: 'hard'
  },
  {
    id: '10',
    type: 'history',
    question: "What ancient trading network connected civilizations from Rome to China, but was never actually a single road?",
    answer: "silk road",
    hint: "Named by a 19th-century German geographer, this was actually multiple routes.",
    points: 35,
    difficulty: 'medium'
  },
  {
    id: '11',
    type: 'science',
    question: "What recently discovered state of matter occurs when atoms are cooled to near absolute zero and begin to behave as a single quantum entity?",
    answer: "bose-einstein condensate",
    hint: "Predicted in 1924-25, first created in 1995, earning a Nobel Prize in 2001.",
    points: 60,
    difficulty: 'hard'
  },
  {
    id: '12',
    type: 'logic',
    question: "In the Monty Hall problem, should you switch doors after the host opens a losing door?",
    answer: "yes",
    hint: "Your chance doubles from 1/3 to 2/3 if you switch.",
    points: 40,
    difficulty: 'medium'
  },
  {
    id: '13',
    type: 'word',
    question: "What word can be a noun meaning 'a small stream' and a verb meaning 'to tolerate'?",
    answer: "brook",
    hint: "One meaning involves water, the other involves patience.",
    points: 35,
    difficulty: 'medium'
  },
  {
    id: '14',
    type: 'math',
    question: "What is the name for a number that equals the sum of its proper divisors?",
    answer: "perfect",
    hint: "The first few are 6, 28, 496... they're quite rare.",
    points: 45,
    difficulty: 'medium'
  },
  {
    id: '15',
    type: 'psychology',
    question: "What phenomenon explains why people in groups tend to make more extreme decisions than individuals?",
    answer: "polarization",
    hint: "Groups amplify the initial tendencies of their members.",
    points: 45,
    difficulty: 'medium'
  },
  {
    id: '16',
    type: 'history',
    question: "Which lost civilization built the massive stone heads on Easter Island using a 'walking' technique?",
    answer: "rapa nui",
    hint: "Recent experiments proved the statues could be 'walked' upright using ropes.",
    points: 50,
    difficulty: 'medium'
  },
  {
    id: '17',
    type: 'science',
    question: "What type of stellar remnant is so dense that a teaspoon would weigh as much as Mount Everest?",
    answer: "neutron star",
    hint: "These form when massive stars collapse, creating matter made entirely of neutrons.",
    points: 45,
    difficulty: 'medium'
  },
  {
    id: '18',
    type: 'riddle',
    question: "I exist only in potential until observed, I can be in multiple states simultaneously, yet measurement forces me to choose. What am I?",
    answer: "quantum superposition",
    hint: "Schrödinger's famous thought experiment illustrates this principle.",
    points: 70,
    difficulty: 'hard'
  },
  {
    id: '19',
    type: 'music',
    question: "What tuning system divides the octave into 12 equal parts, allowing music to be played in any key?",
    answer: "equal temperament",
    hint: "This compromise system replaced pure mathematical ratios for practical flexibility.",
    points: 50,
    difficulty: 'medium'
  },
  {
    id: '20',
    type: 'logic',
    question: "What paradox demonstrates that a set of all sets that do not contain themselves creates a logical contradiction?",
    answer: "russell's paradox",
    hint: "If such a set contains itself, it shouldn't; if it doesn't, it should.",
    points: 65,
    difficulty: 'hard'
  }
];
