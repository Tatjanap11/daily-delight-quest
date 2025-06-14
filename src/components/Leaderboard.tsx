
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Medal, Award, Crown, Star } from 'lucide-react';

interface LeaderboardProps {
  currentUser: {
    level: number;
    points: number;
    boxesOpened: number;
    streak: number;
    totalCorrectAnswers: number;
  };
}

interface LeaderboardEntry {
  id: string;
  name: string;
  level: number;
  points: number;
  streak: number;
  avatar?: string;
  isCurrentUser?: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ currentUser }) => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'allTime'>('allTime');

  useEffect(() => {
    // Generate mock leaderboard data with current user included
    const mockData: LeaderboardEntry[] = [
      {
        id: '1',
        name: 'Sarah Chen',
        level: 12,
        points: 1250,
        streak: 15,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616c4e9b5b0?w=100&h=100&fit=crop&crop=face'
      },
      {
        id: '2',
        name: 'Alex Johnson',
        level: 10,
        points: 980,
        streak: 8,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
      },
      {
        id: '3',
        name: 'Maya Patel',
        level: 9,
        points: 875,
        streak: 12,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
      },
      {
        id: 'current',
        name: 'You',
        level: currentUser.level,
        points: currentUser.points,
        streak: currentUser.streak,
        isCurrentUser: true
      },
      {
        id: '4',
        name: 'David Kim',
        level: 8,
        points: 720,
        streak: 5,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
      },
      {
        id: '5',
        name: 'Emma Wilson',
        level: 7,
        points: 650,
        streak: 7,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'
      },
      {
        id: '6',
        name: 'Michael Brown',
        level: 6,
        points: 580,
        streak: 3,
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face'
      },
      {
        id: '7',
        name: 'Lisa Zhang',
        level: 5,
        points: 475,
        streak: 9,
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face'
      }
    ];

    // Sort by points and assign positions
    const sortedData = mockData.sort((a, b) => b.points - a.points);
    setLeaderboardData(sortedData);
  }, [currentUser]);

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <div className="w-6 h-6 flex items-center justify-center text-lg font-bold text-gray-500">#{position}</div>;
    }
  };

  const getRankBadgeColor = (position: number) => {
    switch (position) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-center justify-center">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Global Leaderboard
          </CardTitle>
          <p className="text-center text-gray-600">
            See how you rank against other puzzle solvers worldwide
          </p>
        </CardHeader>
      </Card>

      {/* Top 3 Podium */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-8">
          <div className="flex justify-center items-end gap-8 mb-8">
            {leaderboardData.slice(0, 3).map((user, index) => {
              const position = index + 1;
              const heights = ['h-24', 'h-32', 'h-20']; // 2nd, 1st, 3rd
              const orders = [1, 0, 2]; // Rearrange for podium effect
              const actualIndex = orders.indexOf(index);
              
              return (
                <div key={user.id} className="flex flex-col items-center">
                  <Avatar className={`w-16 h-16 mb-3 ${user.isCurrentUser ? 'ring-4 ring-blue-500' : ''}`}>
                    {user.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.name} />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white font-bold">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  <div className={`${heights[actualIndex]} w-20 bg-gradient-to-t ${getRankBadgeColor(position)} rounded-t-lg flex flex-col items-center justify-center text-white font-bold shadow-lg`}>
                    {getRankIcon(position)}
                    <div className="text-sm mt-1">#{position}</div>
                  </div>
                  
                  <div className="text-center mt-3">
                    <div className="font-semibold text-gray-800">{user.name}</div>
                    <div className="text-sm text-gray-600">Level {user.level}</div>
                    <Badge variant="secondary" className="mt-1">
                      <Star className="w-3 h-3 mr-1" />
                      {user.points}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Full Leaderboard */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-0">
          <div className="space-y-0">
            {leaderboardData.map((user, index) => {
              const position = index + 1;
              return (
                <div
                  key={user.id}
                  className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${
                    user.isCurrentUser ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  } ${index !== leaderboardData.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <div className="flex items-center justify-center w-8">
                    {position <= 3 ? getRankIcon(position) : (
                      <span className="font-bold text-gray-500">#{position}</span>
                    )}
                  </div>

                  <Avatar className={`w-12 h-12 ${user.isCurrentUser ? 'ring-2 ring-blue-400' : ''}`}>
                    {user.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.name} />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white font-bold">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <div className="flex-1">
                    <div className={`font-semibold ${user.isCurrentUser ? 'text-blue-800' : 'text-gray-800'}`}>
                      {user.name}
                      {user.isCurrentUser && (
                        <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700">
                          You
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">Level {user.level}</div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="font-bold text-lg text-gray-800">{user.points}</div>
                    <div className="text-xs text-gray-500">{user.streak} day streak</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;
