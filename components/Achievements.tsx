import React from 'react';
import { GamificationData, Badge } from '../types';
import { BADGE_DEFINITIONS } from '../constants';
import { Tooltip } from './Tooltip';
import { TrophyIcon } from './icons/TrophyIcon';

interface AchievementsProps {
  gamificationData: GamificationData;
}

const BadgeCard: React.FC<{ badge: Badge; isEarned: boolean }> = ({ badge, isEarned }) => (
  <Tooltip text={badge.description}>
    <div className={`p-4 border-2 rounded-lg text-center transition-all duration-300 ${isEarned ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/40 shadow-md' : 'border-border bg-background filter grayscale opacity-60'}`}>
        <div className={`text-4xl mx-auto mb-2 ${isEarned ? '' : 'animate-pulse'}`}>{badge.icon}</div>
        <h4 className={`font-bold text-sm ${isEarned ? 'text-yellow-800 dark:text-yellow-300' : 'text-text-secondary'}`}>{badge.name}</h4>
    </div>
  </Tooltip>
);

export const Achievements: React.FC<AchievementsProps> = ({ gamificationData }) => {
  const earnedBadgeIds = new Set(gamificationData.badges.map(b => b.id));
  const allBadges = Object.values(BADGE_DEFINITIONS);

  return (
    <div className="bg-card p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-text mb-4 text-center flex items-center justify-center">
        <TrophyIcon className="h-6 w-6 mr-2 text-yellow-500" />
        Golden Looms
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {allBadges.map(badge => (
          <BadgeCard key={badge.id} badge={badge} isEarned={earnedBadgeIds.has(badge.id)} />
        ))}
      </div>
    </div>
  );
};