import React from 'react';
import { LevelProgress } from './LevelProgress';
import { AchievementBadges } from './AchievementBadges';
import { TeamLeaderboard } from './TeamLeaderboard';
import { useLanguage } from '@/i18n';

// Mock data - will be replaced with real data
const mockAchievements = [
  {
    id: '1',
    name: 'First Steps',
    description: 'Complete your first habit',
    icon: 'star' as const,
    unlocked: true,
    unlockedAt: '2025-01-15',
  },
  {
    id: '2',
    name: 'Week Warrior',
    description: 'Complete habits for 7 days straight',
    icon: 'flame' as const,
    unlocked: true,
    unlockedAt: '2025-01-20',
  },
  {
    id: '3',
    name: 'Target Master',
    description: 'Hit your monthly goal',
    icon: 'target' as const,
    unlocked: false,
    progress: 15,
    total: 30,
  },
  {
    id: '4',
    name: 'Sales Champion',
    description: 'Top seller of the month',
    icon: 'crown' as const,
    unlocked: false,
    progress: 0,
    total: 1,
  },
  {
    id: '5',
    name: 'Speed Demon',
    description: 'Complete all daily habits before noon',
    icon: 'zap' as const,
    unlocked: true,
    unlockedAt: '2025-01-18',
  },
  {
    id: '6',
    name: 'Perfect Month',
    description: 'Complete all habits for 30 days',
    icon: 'medal' as const,
    unlocked: false,
    progress: 12,
    total: 30,
  },
  {
    id: '7',
    name: 'Team Player',
    description: 'Help 5 team members complete their habits',
    icon: 'award' as const,
    unlocked: false,
    progress: 2,
    total: 5,
  },
  {
    id: '8',
    name: 'Rising Star',
    description: 'Reach level 10',
    icon: 'sparkles' as const,
    unlocked: false,
    progress: 3,
    total: 10,
  },
];

const mockTeamMembers = [
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
