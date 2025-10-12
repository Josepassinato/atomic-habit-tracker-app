import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, TrendingUp, TrendingDown } from 'lucide-react';
import { useLanguage } from '@/i18n';

interface TeamMember {
  id: string;
  name: string;
  xp: number;
  level: number;
  habitsCompleted: number;
  rank: number;
  rankChange?: number; // Positive = up, Negative = down
}

interface TeamLeaderboardProps {
  members: TeamMember[];
  currentUserId?: string;
}

export const TeamLeaderboard: React.FC<TeamLeaderboardProps> = ({ 
  members,
  currentUserId 
}) => {
  const { t } = useLanguage();

  const getRankIcon = (rank: number) => {
    switch(rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-yellow-500 text-white';
    if (rank === 2) return 'bg-gray-400 text-white';
    if (rank === 3) return 'bg-amber-600 text-white';
    return 'bg-muted text-muted-foreground';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          {t('teamLeaderboard')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {members.map((member) => {
            const isCurrentUser = member.id === currentUserId;
            const initials = member.name
              .split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);

            return (
              <div
                key={member.id}
                className={`
                  flex items-center gap-3 p-3 rounded-lg border transition-all
                  ${isCurrentUser 
                    ? 'border-primary bg-primary/5 shadow-sm' 
                    : 'border-muted hover:border-primary/50'
                  }
                  ${member.rank <= 3 ? 'ring-2 ring-offset-2 ring-' + (member.rank === 1 ? 'yellow-500' : member.rank === 2 ? 'gray-400' : 'amber-600') : ''}
                `}
              >
                {/* Rank */}
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full
                  ${getRankBadge(member.rank)}
                `}>
                  {getRankIcon(member.rank)}
                </div>

                {/* Avatar */}
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold truncate">
                      {member.name}
                      {isCurrentUser && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          {t('you')}
                        </Badge>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{t('level')} {member.level}</span>
                    <span>•</span>
                    <span>{member.habitsCompleted} {t('habits')}</span>
                  </div>
                </div>

                {/* XP & Rank Change */}
                <div className="text-right">
                  <p className="font-bold text-primary">{member.xp.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">XP</p>
                  {member.rankChange !== undefined && member.rankChange !== 0 && (
                    <div className={`flex items-center gap-1 text-xs mt-1 ${
                      member.rankChange > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {member.rankChange > 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span>{Math.abs(member.rankChange)}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
