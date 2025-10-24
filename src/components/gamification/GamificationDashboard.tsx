import React from 'react';
import { LevelProgress } from './LevelProgress';
import { AchievementBadges } from './AchievementBadges';
import { TeamLeaderboard } from './TeamLeaderboard';
import { useLanguage } from '@/i18n';

const mockAchievements: any[] = [];
const mockTeamMembers: any[] = [
  {
    id: '1',
    name: 'Ana Silva',
    xp: 2850,
    level: 8,
    habitsCompleted: 145,
    rank: 1,
    rankChange: 2,
  },
  {
    id: '2',
    name: 'Carlos Mendes',
    xp: 2720,
    level: 7,
    habitsCompleted: 138,
    rank: 2,
    rankChange: -1,
  },
  {
    id: 'current',
    name: 'You',
    xp: 2680,
    level: 7,
    habitsCompleted: 132,
    rank: 3,
    rankChange: 1,
  },
  {
    id: '4',
    name: 'Pedro Costa',
    xp: 2450,
    level: 6,
    habitsCompleted: 125,
    rank: 4,
    rankChange: -2,
  },
  {
    id: '5',
    name: 'Maria Santos',
    xp: 2100,
    level: 6,
    habitsCompleted: 98,
    rank: 5,
    rankChange: 0,
  },
];

export const GamificationDashboard: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Level Progress */}
      <LevelProgress
        currentLevel={7}
        currentXP={680}
        xpForNextLevel={1000}
        totalXP={2680}
      />

      {/* Achievements */}
      <AchievementBadges achievements={mockAchievements} />

      {/* Team Leaderboard */}
      <TeamLeaderboard 
        members={mockTeamMembers}
        currentUserId="current"
      />
    </div>
  );
};
