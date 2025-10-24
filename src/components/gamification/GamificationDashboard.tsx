import React from 'react';
import { LevelProgress } from './LevelProgress';
import { AchievementBadges } from './AchievementBadges';
import { TeamLeaderboard } from './TeamLeaderboard';
import { useLanguage } from '@/i18n';

const mockAchievements: any[] = [];
const mockTeamMembers: any[] = [];

export const GamificationDashboard: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Level Progress */}
      <LevelProgress
        currentLevel={0}
        currentXP={0}
        xpForNextLevel={1000}
        totalXP={0}
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
