
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, Lock, Sparkles, BookOpen, Brain, Globe, Star } from 'lucide-react';

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
}

interface UserRating {
  factId: string;
  rating: number;
  category: string;
  timestamp: number;
}

const facts: Fact[] = [
  {
    id: '1',
    category: 'science',
    title: 'Octopuses Have Three Hearts',
    content: 'Octopuses have three hearts! Two pump blood to the gills, while the third pumps blood to the rest of the body. Interestingly, the main heart stops beating when they swim, which is why they prefer crawling to avoid exhaustion.',
    funLevel: 9
  },
  {
    id: '2',
    category: 'psychology',
    title: 'The Paradox of Choice',
    content: 'Having too many options can actually make us less happy with our decisions. Psychologist Barry Schwartz found that when faced with 24 varieties of jam, only 3% of customers made a purchase, compared to 30% when offered just 6 varieties.',
    funLevel: 8
  },
  {
    id: '3',
    category: 'culture',
    title: 'The Japanese Art of Forest Bathing',
    content: 'In Japan, "Shinrin-yoku" or forest bathing is a recognized form of therapy. Simply spending mindful time in forests has been scientifically proven to reduce stress hormones, boost immune function, and improve overall well-being.',
    funLevel: 7
  },
  {
    id: '4',
    category: 'history',
    title: 'Cleopatra Lived Closer to Moon Landing',
    content: 'Cleopatra lived closer in time to the Moon landing (1969) than to the construction of the Great Pyramid of Giza. The pyramid was built around 2580-2560 BCE, while Cleopatra lived from 69-30 BCE - a difference of about 2,500 years!',
    funLevel: 10
  },
  {
    id: '5',
    category: 'nature',
    title: 'Trees Can Communicate',
    content: 'Trees in forests communicate through an underground network called the "Wood Wide Web." Through fungal networks connected to their roots, they can share nutrients, warn each other of dangers, and even help nurture their young.',
    funLevel: 9
  },
  {
    id: '6',
    category: 'science',
    title: 'Your Body Glows in the Dark',
    content: 'Humans actually emit a faint visible light through bioluminescence, but it\'s about 1,000 times weaker than what our eyes can detect. The glow is strongest around your mouth and cheeks, and it fluctuates throughout the day.',
    funLevel: 8
  },
  {
    id: '7',
    category: 'psychology',
    title: 'The Reminiscence Bump',
    content: 'People remember events from their teens and twenties more vividly than other periods of their life. This "reminiscence bump" occurs because this is when we form our identity and experience many "firsts" - first love, first job, first independence.',
    funLevel: 7
  }
];

const SurpriseBox: React.FC<SurpriseBoxProps> = ({ canOpen, onBoxOpened, userLevel }) => {
  const [isOpened, setIsOpened] = useState(false);
  const [currentFact, setCurrentFact] = useState<Fact | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hasRated, setHasRated] = useState(false);

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
    
    // If user has no preferences yet, use default selection
    if (Object.keys(preferences).length === 0) {
      const factIndex = (dayOfYear + userLevel * 2) % facts.length;
      return facts[factIndex];
    }

    // Weight facts by user preferences
    const weightedFacts = facts.map(fact => ({
      ...fact,
      weight: preferences[fact.category] || 2.5 // neutral weight for unrated categories
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

  useEffect(() => {
    setCurrentFact(selectFactBasedOnPreferences());

    // Check if today's box was already opened and rated
    const today = new Date().toDateString();
    const todayBoxKey = `box_opened_${today}`;
    const todayRatingKey = `fact_rated_${today}`;
    
    setIsOpened(!!localStorage.getItem(todayBoxKey));
    setHasRated(!!localStorage.getItem(todayRatingKey));
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

  return (
    <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Gift className="w-6 h-6 text-cyan-400" />
          <CardTitle className="text-2xl bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Daily Discovery Box
          </CardTitle>
        </div>
        <p className="text-slate-300">
          {canOpen ? 'Your reward awaits!' : 'Complete today\'s puzzle to unlock'}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {!canOpen ? (
          <div className="text-center space-y-4">
            <div className="w-24 h-24 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto border border-slate-600">
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
              <Badge className={getCategoryColor(currentFact.category)}>
                {React.createElement(getCategoryIcon(currentFact.category), { className: "w-4 h-4 mr-1" })}
                {currentFact.category.toUpperCase()}
              </Badge>
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
            <div className="bg-slate-700/50 rounded-lg p-4 space-y-3">
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
