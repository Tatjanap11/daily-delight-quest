
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, Lock, Sparkles, BookOpen, Brain, Globe } from 'lucide-react';

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

  useEffect(() => {
    // Select a fact based on the day and user level
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const factIndex = (dayOfYear + userLevel * 2) % facts.length;
    setCurrentFact(facts[factIndex]);

    // Check if today's box was already opened
    const todayBoxKey = `box_opened_${today.toDateString()}`;
    setIsOpened(!!localStorage.getItem(todayBoxKey));
  }, [userLevel]);

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
      case 'science': return 'bg-blue-100 text-blue-700';
      case 'psychology': return 'bg-purple-100 text-purple-700';
      case 'culture': return 'bg-green-100 text-green-700';
      case 'history': return 'bg-amber-100 text-amber-700';
      case 'nature': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Gift className="w-6 h-6 text-yellow-500" />
          <CardTitle className="text-2xl bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
            Daily Discovery Box
          </CardTitle>
        </div>
        <p className="text-gray-600">
          {canOpen ? 'Your reward awaits!' : 'Complete today\'s puzzle to unlock'}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {!canOpen ? (
          <div className="text-center space-y-4">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <Lock className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-500">
              Solve today's puzzle to unlock this surprise box and discover something amazing!
            </p>
          </div>
        ) : isOpened && currentFact ? (
          <div className="space-y-4 animate-fade-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-yellow-600" />
              </div>
              <Badge className={getCategoryColor(currentFact.category)}>
                {React.createElement(getCategoryIcon(currentFact.category), { className: "w-4 h-4 mr-1" })}
                {currentFact.category.toUpperCase()}
              </Badge>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {currentFact.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">
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
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500">
                Mind-blowing level: {currentFact.funLevel}/10
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div 
              className={`w-24 h-24 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full flex items-center justify-center mx-auto transition-all duration-1000 ${
                isAnimating ? 'animate-bounce scale-110' : 'hover:scale-105'
              }`}
            >
              <Gift className={`w-12 h-12 text-yellow-600 transition-all duration-500 ${
                isAnimating ? 'animate-spin' : ''
              }`} />
            </div>
            
            <Button
              onClick={handleOpenBox}
              disabled={isAnimating}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
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
            
            <p className="text-sm text-gray-500">
              Click to reveal today's fascinating discovery!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SurpriseBox;
