import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, Lock, Sparkles, BookOpen, Brain, Globe, Star, Bell, BellOff } from 'lucide-react';

interface SurpriseBoxProps {
  canOpen: boolean;
  onBoxOpened: () => void;
  userLevel: number;
}

interface Fact {
  id: string;
  category: 'science' | 'psychology' | 'culture' | 'history' | 'nature';
  title: string;
  content: string;
  funLevel: number;
  difficultyLevel: number; // 1-5 scale
}

interface UserRating {
  factId: string;
  rating: number;
  category: string;
  timestamp: number;
}

const facts: Fact[] = [
  // Advanced Science Facts
  {
    id: '1',
    category: 'science',
    title: 'Quantum Biology in Bird Navigation',
    content: 'European robins use quantum entanglement in their eyes to navigate. Cryptochrome proteins create entangled electron pairs that respond to Earth\'s magnetic field, allowing birds to literally see magnetic fields overlaid on their vision - a biological compass that operates on quantum mechanics.',
    funLevel: 10,
    difficultyLevel: 4
  },
  {
    id: '2',
    category: 'psychology',
    title: 'The Tetris Effect on Memory',
    content: 'Playing Tetris within 6 hours of a traumatic event can reduce intrusive memories by up to 62%. The visual-spatial processing required by the game interferes with the brain\'s ability to consolidate traumatic visual memories, essentially "overwriting" the trauma pathway.',
    funLevel: 9,
    difficultyLevel: 3
  },
  {
    id: '3',
    category: 'history',
    title: 'The Antikythera Mechanism\'s Lost Purpose',
    content: 'The 2,100-year-old Antikythera mechanism wasn\'t just an astronomical calculator - recent analysis reveals it could predict the exact color of lunar eclipses and track the 8-year Venus cycle. It represents technology that wouldn\'t be seen again for 1,400 years.',
    funLevel: 10,
    difficultyLevel: 4
  },
  {
    id: '4',
    category: 'science',
    title: 'Tardigrades\' Cryptobiotic Time Travel',
    content: 'Tardigrades can enter cryptobiosis, reducing their metabolism to 0.01% of normal and essentially stopping time for themselves. They produce unique proteins that form glass-like structures, turning their cells into biological time capsules that can survive for millennia.',
    funLevel: 10,
    difficultyLevel: 4
  },
  {
    id: '5',
    category: 'culture',
    title: 'The Pirahã Language and Mathematical Impossibility',
    content: 'The Pirahã people of the Amazon lack words for exact numbers and their language structure makes it neurologically difficult to conceptualize mathematical recursion. This suggests language doesn\'t just describe reality but fundamentally shapes the cognitive architectures we can develop.',
    funLevel: 10,
    difficultyLevel: 5
  },
  {
    id: '6',
    category: 'science',
    title: 'Mycorrhizal Networks as Forest Internet',
    content: 'Forest fungal networks operate complex "carbon markets" where trees pay premium rates for nutrients during stress, mother trees give "loans" to offspring with future carbon "interest," and fungi act as resource brokers charging transaction fees - a biological economy predating human civilization.',
    funLevel: 10,
    difficultyLevel: 4
  },
  {
    id: '7',
    category: 'psychology',
    title: 'Collective Metacognition Paradox',
    content: 'Groups can exhibit "collective metacognition" - knowing what they know as a group. However, the more aware a group becomes of its collective knowledge, the less efficient individuals become at accessing their own expertise, creating "cognitive offloading paralysis."',
    funLevel: 9,
    difficultyLevel: 5
  },
  {
    id: '8',
    category: 'history',
    title: 'The Voynich Manuscript\'s Statistical Impossibility',
    content: 'The Voynich Manuscript displays statistical properties consistent with natural language but follows no known linguistic rules. Its word frequency distribution matches living languages, yet it contains no decipherable meaning - a 600-year-old cryptographic impossibility.',
    funLevel: 10,
    difficultyLevel: 4
  },
  {
    id: '9',
    category: 'science',
    title: 'Time Crystals Breaking Physics',
    content: 'Time crystals are a new state of matter that repeat in time rather than space, effectively creating perpetual motion without energy input. Discovered in 2016, they violate our understanding of equilibrium physics and could revolutionize quantum computing.',
    funLevel: 10,
    difficultyLevel: 5
  },
  {
    id: '10',
    category: 'nature',
    title: 'Slime Molds as Living Computers',
    content: 'Physarum polycephalum, a brainless slime mold, can solve complex optimization problems like finding the shortest path between multiple points - recreating efficient subway systems and trade networks. It processes information through cytoplasmic streaming, creating a biological computer.',
    funLevel: 10,
    difficultyLevel: 3
  },
  {
    id: '11',
    category: 'psychology',
    title: 'The Baader-Meinhof Phenomenon Cascade',
    content: 'The frequency illusion (Baader-Meinhof phenomenon) doesn\'t just make you notice things more - it can cascade into false pattern recognition, where your brain starts creating connections between unrelated coincidences, potentially contributing to conspiracy thinking and paranormal beliefs.',
    funLevel: 9,
    difficultyLevel: 3
  },
  {
    id: '12',
    category: 'history',
    title: 'The Bronze Age Collapse\'s Mysterious Catalyst',
    content: 'Around 1200 BCE, advanced Bronze Age civilizations across the Mediterranean simultaneously collapsed within decades. The mysterious "Sea Peoples" mentioned in Egyptian records may have been climate refugees, but recent evidence suggests a cascading system failure triggered by drought, trade disruption, and social unrest.',
    funLevel: 10,
    difficultyLevel: 4
  },
  {
    id: '13',
    category: 'science',
    title: 'Dark Energy\'s Accelerating Mystery',
    content: 'Dark energy, comprising 68% of the universe, is causing space itself to expand at an accelerating rate. If this acceleration continues, in 100 billion years, galaxies beyond our local group will be invisible to future astronomers - essentially erasing evidence of the Big Bang.',
    funLevel: 10,
    difficultyLevel: 4
  },
  {
    id: '14',
    category: 'culture',
    title: 'The Sapir-Whorf Hypothesis in Color Perception',
    content: 'The Himba tribe of Namibia, who have different color categories than English speakers, can instantly spot green squares among blue ones but struggle to distinguish blue from green when they\'re linguistically categorized together. Language literally changes what we see.',
    funLevel: 9,
    difficultyLevel: 3
  },
  {
    id: '15',
    category: 'science',
    title: 'Quantum Coherence in Photosynthesis',
    content: 'Plants use quantum coherence to achieve near-perfect energy transfer efficiency in photosynthesis. Chlorophyll molecules exist in quantum superposition, allowing energy to "sample" all possible paths simultaneously and choose the most efficient route - quantum computing in every leaf.',
    funLevel: 10,
    difficultyLevel: 5
  }
];

const SurpriseBox: React.FC<SurpriseBoxProps> = ({ canOpen, onBoxOpened, userLevel }) => {
  const [isOpened, setIsOpened] = useState(false);
  const [currentFact, setCurrentFact] = useState<Fact | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hasRated, setHasRated] = useState(false);
  const [dailyReminders, setDailyReminders] = useState(false);

  const getUserPreferences = (): Record<string, number> => {
    const ratings = JSON.parse(localStorage.getItem('user_fact_ratings') || '[]') as UserRating[];
    const categoryScores: Record<string, { total: number; count: number }> = {};
    
    ratings.forEach(rating => {
      if (!categoryScores[rating.category]) {
        categoryScores[rating.category] = { total: 0, count: 0 };
      }
      categoryScores[rating.category].total += rating.rating;
      categoryScores[rating.category].count += 1;
    });

    const preferences: Record<string, number> = {};
    Object.keys(categoryScores).forEach(category => {
      preferences[category] = categoryScores[category].total / categoryScores[category].count;
    });

    return preferences;
  };

  const selectFactBasedOnPreferences = (): Fact => {
    const preferences = getUserPreferences();
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    
    // Filter facts based on user level (difficulty scaling)
    const maxDifficultyForLevel = Math.min(Math.floor(userLevel / 2) + 1, 5);
    const suitableFacts = facts.filter(fact => fact.difficultyLevel <= maxDifficultyForLevel);
    
    // If user has no preferences yet, use difficulty-appropriate selection
    if (Object.keys(preferences).length === 0) {
      const factIndex = (dayOfYear + userLevel * 2) % suitableFacts.length;
      return suitableFacts[factIndex];
    }

    // Weight facts by user preferences and difficulty
    const weightedFacts = suitableFacts.map(fact => ({
      ...fact,
      weight: (preferences[fact.category] || 2.5) + (fact.difficultyLevel * 0.1) // slight preference for higher difficulty
    }));

    // Sort by preference and use day/level as tiebreaker
    weightedFacts.sort((a, b) => {
      if (b.weight !== a.weight) return b.weight - a.weight;
      return (dayOfYear + userLevel) % 2 === 0 ? 1 : -1;
    });

    // Return top preferred fact with some randomness
    const topFacts = weightedFacts.slice(0, 3);
    return topFacts[(dayOfYear + userLevel) % topFacts.length];
  };

  const toggleDailyReminders = () => {
    const newReminderState = !dailyReminders;
    setDailyReminders(newReminderState);
    localStorage.setItem('daily_reminders', JSON.stringify(newReminderState));
    
    if (newReminderState && 'Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          // Schedule daily reminder (this would typically be done with a service worker in production)
          scheduleNextReminder();
        }
      });
    }
  };

  const scheduleNextReminder = () => {
    // Simple reminder scheduling (in production, use service workers or backend scheduling)
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0); // 9 AM reminder
    
    const timeUntilReminder = tomorrow.getTime() - now.getTime();
    
    setTimeout(() => {
      if (Notification.permission === 'granted') {
        new Notification('Daily WonderBox Challenge!', {
          body: 'Time for your daily brain teaser! Solve today\'s puzzle to unlock a fascinating discovery.',
          icon: '/favicon.ico'
        });
      }
      scheduleNextReminder(); // Schedule next day's reminder
    }, timeUntilReminder);
  };

  useEffect(() => {
    setCurrentFact(selectFactBasedOnPreferences());

    // Check if today's box was already opened and rated
    const today = new Date().toDateString();
    const todayBoxKey = `box_opened_${today}`;
    const todayRatingKey = `fact_rated_${today}`;
    
    setIsOpened(!!localStorage.getItem(todayBoxKey));
    setHasRated(!!localStorage.getItem(todayRatingKey));

    // Load reminder preference
    const reminderPref = JSON.parse(localStorage.getItem('daily_reminders') || 'false');
    setDailyReminders(reminderPref);
  }, [userLevel]);

  const handleRating = (rating: number) => {
    if (!currentFact || hasRated) return;

    setUserRating(rating);
    setHasRated(true);

    // Save rating to localStorage
    const ratings = JSON.parse(localStorage.getItem('user_fact_ratings') || '[]') as UserRating[];
    const newRating: UserRating = {
      factId: currentFact.id,
      rating,
      category: currentFact.category,
      timestamp: Date.now()
    };
    
    ratings.push(newRating);
    localStorage.setItem('user_fact_ratings', JSON.stringify(ratings));

    // Mark today as rated
    const today = new Date().toDateString();
    localStorage.setItem(`fact_rated_${today}`, 'true');
  };

  const handleOpenBox = () => {
    if (!canOpen || isOpened || !currentFact) return;

    setIsAnimating(true);
    
    setTimeout(() => {
      setIsOpened(true);
      setIsAnimating(false);
      onBoxOpened();
      
      // Save that today's box was opened
      const today = new Date().toDateString();
      localStorage.setItem(`box_opened_${today}`, 'true');
    }, 1000);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'science': return Brain;
      case 'psychology': return BookOpen;
      case 'culture': return Globe;
      case 'history': return BookOpen;
      case 'nature': return Globe;
      default: return Sparkles;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'science': return 'bg-blue-900/80 text-blue-200 border-blue-700';
      case 'psychology': return 'bg-purple-900/80 text-purple-200 border-purple-700';
      case 'culture': return 'bg-emerald-900/80 text-emerald-200 border-emerald-700';
      case 'history': return 'bg-indigo-900/80 text-indigo-200 border-indigo-700';
      case 'nature': return 'bg-teal-900/80 text-teal-200 border-teal-700';
      default: return 'bg-slate-900/80 text-slate-200 border-slate-700';
    }
  };

  const getDifficultyBadge = (difficulty: number) => {
    const difficultyNames = ['', 'Beginner', 'Easy', 'Intermediate', 'Advanced', 'Expert'];
    const difficultyColors = ['', 'bg-green-900/80 text-green-200', 'bg-blue-900/80 text-blue-200', 'bg-yellow-900/80 text-yellow-200', 'bg-orange-900/80 text-orange-200', 'bg-red-900/80 text-red-200'];
    
    return (
      <Badge className={`${difficultyColors[difficulty]} border-opacity-50`}>
        {difficultyNames[difficulty]}
      </Badge>
    );
  };

  return (
    <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Gift className="w-6 h-6 text-cyan-400" />
          <CardTitle className="text-2xl bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Daily Discovery Box
          </CardTitle>
        </div>
        <div className="flex items-center justify-center gap-4">
          <p className="text-slate-300">
            {canOpen ? 'Your reward awaits!' : 'Complete today\'s puzzle to unlock'}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDailyReminders}
            className="text-slate-400 hover:text-slate-200"
          >
            {dailyReminders ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {!canOpen ? (
          <div className="text-center space-y-4">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-full flex items-center justify-center mx-auto border border-slate-600">
              <Lock className="w-12 h-12 text-slate-400" />
            </div>
            <p className="text-slate-400">
              Solve today's puzzle to unlock this surprise box and discover something amazing!
            </p>
          </div>
        ) : isOpened && currentFact ? (
          <div className="space-y-4 animate-fade-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500">
                <Sparkles className="w-8 h-8 text-cyan-200" />
              </div>
              <div className="flex justify-center gap-2 mb-2">
                <Badge className={getCategoryColor(currentFact.category)}>
                  {React.createElement(getCategoryIcon(currentFact.category), { className: "w-4 h-4 mr-1" })}
                  {currentFact.category.toUpperCase()}
                </Badge>
                {getDifficultyBadge(currentFact.difficultyLevel)}
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-600">
              <h3 className="text-xl font-bold text-slate-200 mb-3">
                {currentFact.title}
              </h3>
              <p className="text-slate-300 leading-relaxed">
                {currentFact.content}
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Sparkles
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(currentFact.funLevel / 2) 
                        ? 'text-cyan-400 fill-current' 
                        : 'text-slate-500'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-slate-400">
                Mind-blowing level: {currentFact.funLevel}/10
              </p>
            </div>

            {/* Rating System */}
            <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-lg p-4 space-y-3 border border-slate-600">
              <h4 className="text-center text-slate-300 font-medium">
                {hasRated ? 'Thanks for rating!' : 'How interesting was this fact?'}
              </h4>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    variant={hasRated && userRating === rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleRating(rating)}
                    disabled={hasRated}
                    className={`w-10 h-10 rounded-full transition-all duration-200 ${
                      hasRated 
                        ? userRating === rating
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                          : 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-slate-600 border-slate-500 text-slate-300'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${
                      hasRated && userRating && rating <= userRating ? 'fill-current' : ''
                    }`} />
                  </Button>
                ))}
              </div>
              {!hasRated && (
                <p className="text-xs text-slate-400 text-center">
                  Your rating helps us show you more facts you'll love!
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div 
              className={`w-24 h-24 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center mx-auto transition-all duration-1000 border border-cyan-500 ${
                isAnimating ? 'animate-bounce scale-110' : 'hover:scale-105'
              }`}
            >
              <Gift className={`w-12 h-12 text-cyan-200 transition-all duration-500 ${
                isAnimating ? 'animate-spin' : ''
              }`} />
            </div>
            
            <Button
              onClick={handleOpenBox}
              disabled={isAnimating}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isAnimating ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Opening...
                </>
              ) : (
                <>
                  <Gift className="w-4 h-4 mr-2" />
                  Open Surprise Box
                </>
              )}
            </Button>
            
            <p className="text-sm text-slate-400">
              Click to reveal today's fascinating discovery!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SurpriseBox;
