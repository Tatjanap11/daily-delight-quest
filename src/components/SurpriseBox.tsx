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
  // Beginner Facts (Level 1-2)
  {
    id: '1',
    category: 'science',
    title: 'Octopuses Have Three Hearts',
    content: 'Octopuses have three hearts! Two pump blood to the gills, while the third pumps blood to the rest of the body. Interestingly, the main heart stops beating when they swim, which is why they prefer crawling to avoid exhaustion.',
    funLevel: 9,
    difficultyLevel: 1
  },
  {
    id: '2',
    category: 'psychology',
    title: 'The Paradox of Choice',
    content: 'Having too many options can actually make us less happy with our decisions. Psychologist Barry Schwartz found that when faced with 24 varieties of jam, only 3% of customers made a purchase, compared to 30% when offered just 6 varieties.',
    funLevel: 8,
    difficultyLevel: 1
  },
  {
    id: '3',
    category: 'culture',
    title: 'The Japanese Art of Forest Bathing',
    content: 'In Japan, "Shinrin-yoku" or forest bathing is a recognized form of therapy. Simply spending mindful time in forests has been scientifically proven to reduce stress hormones, boost immune function, and improve overall well-being.',
    funLevel: 7,
    difficultyLevel: 1
  },
  
  // Intermediate Facts (Level 3-4)
  {
    id: '4',
    category: 'science',
    title: 'Quantum Entanglement in Bird Navigation',
    content: 'European robins may use quantum entanglement for navigation! Cryptochrome proteins in their eyes create "quantum compasses" where entangled electron pairs respond to Earth\'s magnetic field, allowing them to literally see magnetic fields as overlays on their vision.',
    funLevel: 10,
    difficultyLevel: 3
  },
  {
    id: '5',
    category: 'psychology',
    title: 'The Dunning-Kruger-Dunning Effect',
    content: 'There\'s a meta-cognitive bias where people who are incompetent at recognizing the Dunning-Kruger effect in themselves are often the most confident that others suffer from it. This creates recursive loops of overconfidence about cognitive biases.',
    funLevel: 9,
    difficultyLevel: 3
  },
  {
    id: '6',
    category: 'history',
    title: 'The Antikythera Mechanism\'s Lost Functions',
    content: 'The ancient Greek Antikythera mechanism wasn\'t just an astronomical calculator - recent analysis suggests it could predict the color of lunar eclipses and had a "Venus dial" that tracked the 8-year cycle where Venus returns to the same position relative to Earth.',
    funLevel: 10,
    difficultyLevel: 3
  },
  
  // Advanced Facts (Level 5+)
  {
    id: '7',
    category: 'science',
    title: 'Tardigrades\' Quantum Survival Strategy',
    content: 'Tardigrades don\'t just survive extreme conditions - they enter a state called "cryptobiosis" where their metabolism drops to 0.01% of normal, and they produce unique proteins that form glass-like structures, essentially turning their cells into biological time capsules that can survive for millennia.',
    funLevel: 10,
    difficultyLevel: 5
  },
  {
    id: '8',
    category: 'psychology',
    title: 'Collective Metacognition Paradox',
    content: 'Groups can exhibit "collective metacognition" - knowing what they know as a group - but this creates a paradox: the more aware a group becomes of its collective knowledge, the less efficient individual members become at accessing their own expertise, leading to "cognitive offloading paralysis."',
    funLevel: 9,
    difficultyLevel: 5
  },
  {
    id: '9',
    category: 'nature',
    title: 'Mycorrhizal Network Market Economics',
    content: 'Forest fungal networks don\'t just share resources - they operate complex "carbon markets" where trees pay premium rates for nutrients during stress, mother trees give "loans" to their offspring with "interest" paid in future carbon, and some fungi act as "resource brokers" charging transaction fees.',
    funLevel: 10,
    difficultyLevel: 4
  },
  {
    id: '10',
    category: 'culture',
    title: 'The Linguistic Relativity of Mathematical Concepts',
    content: 'The Pirahã people of the Amazon don\'t just lack words for exact numbers - their language structure makes it neurologically difficult to conceptualize mathematical recursion, suggesting that language doesn\'t just describe reality but fundamentally shapes the cognitive architectures we can develop.',
    funLevel: 10,
    difficultyLevel: 5
  }
];

// Fallback always-available facts, to guarantee a discovery is shown
const fallbackFacts: Fact[] = [
  {
    id: 'f1',
    category: 'science',
    title: 'Honey Never Spoils',
    content: "Archaeologists have found edible honey in ancient Egyptian tombs that is thousands of years old. Honey's chemical makeup makes it nearly impossible for bacteria and microorganisms to grow.",
    funLevel: 8,
    difficultyLevel: 1
  },
  {
    id: 'f2',
    category: 'culture',
    title: 'The Eiffel Tower Can Grow Taller',
    content: "During hot days, the metal of the Eiffel Tower expands, making the tower grow up to 15 centimeters (about 6 inches) taller.",
    funLevel: 6,
    difficultyLevel: 1
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

    // Diagnostics (can remove/disable in production)
    console.log("SurpriseBox selectFactBasedOnPreferences", {
      preferences, userLevel, dayOfYear, maxDifficultyForLevel, suitableFactsLength: suitableFacts.length, factsLength: facts.length
    });

    let fact: Fact | undefined = undefined;

    // If user has no preferences yet, use difficulty-appropriate selection
    if (Object.keys(preferences).length === 0) {
      if (suitableFacts.length > 0) {
        const factIndex = (dayOfYear + userLevel * 2) % suitableFacts.length;
        fact = suitableFacts[factIndex];
        console.log("SurpriseBox picked (no prefs)", { fact, factIndex });
      }
    } else if (suitableFacts.length > 0) {
      // Weight facts by user preferences and difficulty
      const weightedFacts = suitableFacts.map(f => ({
        ...f,
        weight: (preferences[f.category] || 2.5) + (f.difficultyLevel * 0.1)
      }));

      weightedFacts.sort((a, b) => {
        if (b.weight !== a.weight) return b.weight - a.weight;
        return (dayOfYear + userLevel) % 2 === 0 ? 1 : -1;
      });

      const topFacts = weightedFacts.slice(0, 3);
      fact = topFacts[(dayOfYear + userLevel) % topFacts.length];
      console.log("SurpriseBox picked (prefs)", { chosen: fact, topFacts });
    }

    // Fallback if no fact found (additional defensiveness):
    if (!fact) {
      const fallbackPick = fallbackFacts[(dayOfYear + userLevel) % fallbackFacts.length];
      console.log("SurpriseBox fallbackFact used", { fallbackPick });
      return fallbackPick;
    }
    return fact;
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
    const fact = selectFactBasedOnPreferences();
    setCurrentFact(fact);
    console.log("SurpriseBox useEffect set fact", { fact, canOpen, userLevel });

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
    if (!canOpen || isOpened) return;
    setIsAnimating(true);
    setTimeout(() => {
      setIsOpened(true);
      setIsAnimating(false);
      onBoxOpened();
      // Save that today's box was opened
      const today = new Date().toDateString();
      localStorage.setItem(`box_opened_${today}`, 'true');
      // Defensive: if fact is STILL null, re-pick:
      if (!currentFact) {
        const fallbackFact = selectFactBasedOnPreferences();
        setCurrentFact(fallbackFact);
        console.error("SurpriseBox: No fact found at open, forced fallback.", { fallbackFact });
      } else {
        console.log("SurpriseBox: Box opened with currentFact", { currentFact });
      }
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
        ) : isOpened && !currentFact ? (
          <div className="text-center space-y-6 text-red-400">
            <div className="text-2xl font-bold">😅 Oops! Discovery not found.</div>
            <div>
              Something went wrong loading your discovery.<br/>
              <span className="text-slate-400">
                Try refreshing the page.<br/>
                <strong>This should never happen! Please contact support if you keep seeing this.</strong>
              </span>
            </div>
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
