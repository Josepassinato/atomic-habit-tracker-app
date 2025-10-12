import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/i18n';

interface LevelProgressProps {
  currentLevel: number;
  currentXP: number;
  xpForNextLevel: number;
  totalXP: number;
}

export const LevelProgress: React.FC<LevelProgressProps> = ({
  currentLevel,
  currentXP,
  xpForNextLevel,
  totalXP
}) => {
  const { t } = useLanguage();
  const progressPercentage = (currentXP / xpForNextLevel) * 100;

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="h-5 w-5 text-primary" />
          {t('level')} {currentLevel}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold text-primary">{currentXP}</p>
            <p className="text-sm text-muted-foreground">
              {t('of')} {xpForNextLevel} XP
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="font-semibold">{Math.round(progressPercentage)}%</span>
            </div>
            <p className="text-xs text-muted-foreground">{t('toNextLevel')}</p>
          </div>
        </div>

        <Progress value={progressPercentage} className="h-3" />

        <div className="pt-2 border-t">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">{t('totalXP')}</span>
            <span className="font-bold text-primary">{totalXP.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
