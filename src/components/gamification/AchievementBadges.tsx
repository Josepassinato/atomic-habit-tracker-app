import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Award, 
  Flame, 
  Target, 
  Star, 
  Zap,
  Crown,
  Medal,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '@/i18n';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: 'award' | 'flame' | 'target' | 'star' | 'zap' | 'crown' | 'medal' | 'sparkles';
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  total?: number;
}

interface AchievementBadgesProps {
  achievements: Achievement[];
}

const iconMap = {
  award: Award,
  flame: Flame,
  target: Target,
  star: Star,
  zap: Zap,
  crown: Crown,
  medal: Medal,
  sparkles: Sparkles
};

export const AchievementBadges: React.FC<AchievementBadgesProps> = ({ achievements }) => {
  const { t } = useLanguage();
  
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            {t('achievements')}
          </CardTitle>
          <Badge variant="secondary">
            {unlockedCount}/{achievements.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {achievements.map((achievement) => {
            const Icon = iconMap[achievement.icon];
            
            return (
              <div
                key={achievement.id}
                className={`
                  group relative p-4 rounded-lg border-2 transition-all cursor-pointer
                  ${achievement.unlocked 
                    ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 hover:shadow-lg' 
                    : 'border-muted bg-muted/50 opacity-60 hover:opacity-80'
                  }
                `}
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className={`
                    p-3 rounded-full
                    ${achievement.unlocked 
                      ? 'bg-yellow-500 text-white' 
                      : 'bg-muted text-muted-foreground'
                    }
                  `}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-xs leading-tight">
                      {achievement.name}
                    </p>
                    {!achievement.unlocked && achievement.progress !== undefined && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {achievement.progress}/{achievement.total}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                  <div className="bg-popover text-popover-foreground px-3 py-2 rounded-lg shadow-lg border text-xs whitespace-nowrap">
                    {achievement.description}
                    {achievement.unlockedAt && (
                      <div className="text-muted-foreground mt-1">
                        {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
