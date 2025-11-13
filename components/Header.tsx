import React from 'react';
import { LeafIcon } from './icons/LeafIcon';
import { StarIcon } from './icons/StarIcon';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { User, GamificationData } from '../types';

interface HeaderProps {
    user: User;
    onLogout: () => void;
    gamificationData: GamificationData;
    theme: 'light' | 'dark';
    onThemeToggle: () => void;
    onProfileClick: () => void;
    onLogoClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, gamificationData, theme, onThemeToggle, onProfileClick, onLogoClick }) => {
  return (
    <header className="bg-card shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <button 
          onClick={onLogoClick} 
          className="flex items-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
          aria-label="Go to tapestry"
        >
            <LeafIcon className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold text-primary-dark tracking-tight">
            CarboLoom
            </h1>
        </button>
        <div className="flex items-center">
            <button
                onClick={onThemeToggle}
                className="p-2 rounded-full text-text-secondary hover:bg-border transition-colors duration-300 mr-4"
                aria-label="Toggle theme"
            >
                {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
            </button>
            <button
                onClick={onProfileClick}
                className="text-right mr-4 p-2 -m-2 rounded-lg hover:bg-border transition-colors duration-200"
                aria-label={`View profile for ${user.username}`}
            >
                <span className="block text-text-secondary text-sm">Welcome, <span className="font-bold text-text">{user.username}</span>!</span>
                <span className="block text-xs text-text-secondary">{user.country}</span>
                 <div className="flex items-center justify-end text-sm text-yellow-600 font-semibold mt-1">
                    <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                    <span>{gamificationData.points} Points</span>
                </div>
            </button>
            <button
                onClick={onLogout}
                className="bg-primary-light hover:bg-primary text-white font-semibold text-sm py-2 px-4 rounded-full transition-colors duration-300"
            >
                Logout
            </button>
        </div>
      </div>
    </header>
  );
};