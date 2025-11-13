import React, { useState, useEffect, useMemo } from 'react';
import { GamificationData, Challenge, UserChallengeState, User } from '../types';
import { CHALLENGE_DEFINITIONS } from '../constants';
import { Tooltip } from './Tooltip';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { BoltIcon } from './icons/BoltIcon';
import { daysBetween } from '../utils';
import { ClockIcon } from './icons/ClockIcon';
import { FlameIcon } from './icons/FlameIcon';
import { customChallengeService } from '../services/customChallengeService';
import { CreateChallengeModal } from './CreateChallengeModal';
import { LogProgressModal } from './LogProgressModal';
import { PlusCircleIcon } from './icons/PlusCircleIcon';
import { EditIcon } from './icons/EditIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ChallengesProps {
  currentUser: User;
  gamificationData: GamificationData;
  onCustomChallengeUpdate: (challenge: Challenge, value: number) => void;
}

interface StatusLineProps {
    isCompleted: boolean;
    hasActiveStreak: boolean;
    progress: number;
    reward: number;
    activeStreakClass?: string;
}

const StatusLine: React.FC<StatusLineProps> = ({ isCompleted, hasActiveStreak, progress, reward, activeStreakClass = 'text-yellow-600 dark:text-yellow-400' }) => {
    if (isCompleted) {
        return (
            <div className="flex items-center text-sm font-semibold text-green-600 dark:text-green-400 mt-1">
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                <span>Completed!</span>
            </div>
        );
    }
    if (hasActiveStreak) {
        return (
            <p className={`text-sm font-semibold flex items-center mt-1 ${activeStreakClass}`}>
                <span>{progress} Day Streak</span>
            </p>
        );
    }
    return (
        <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-500/80 mt-1">+{reward} Points</p>
    );
};


const ChallengeCard: React.FC<{ 
  challenge: Challenge; 
  state: UserChallengeState | undefined;
  onLogProgress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ challenge, state, onLogProgress, onEdit, onDelete }) => {
    const progress = state?.progress || 0;
    const { goal, unit, icon, name, description, reward, isCustom } = challenge;
    
    const progressPercentage = Math.min((progress / goal) * 100, 100);
    const isCompleted = progress >= goal;
    const isStreak = challenge.type === 'streak';
    const hasActiveStreak = isStreak && progress > 0 && !isCompleted;
    const hasActiveDailyChallenge = !isStreak && !isCompleted && progress > 0;
    
    let cueMessage: React.ReactNode | null = null;
    let isStreakInDanger = false;
    let isAlmostThere = false;

    if (hasActiveStreak) {
        const today = new Date().toISOString().split('T')[0];
        const daysSinceLastLog = state?.lastUpdated ? daysBetween(state.lastUpdated, today) : -1;
        const daysRemaining = goal - progress;
        
        if (daysSinceLastLog === 1) {
             isStreakInDanger = true;
        }
        if (daysRemaining === 1) {
            isAlmostThere = true;
        }

        if (isAlmostThere) {
            cueMessage = (
                <div className="flex items-center text-xl text-primary dark:text-primary-light font-extrabold mt-2">
                    <span>Almost there!</span>
                </div>
            );
        } else if (isStreakInDanger) {
            cueMessage = (
                <div className="flex items-center text-sm text-orange-600 dark:text-orange-400 font-extrabold mt-2 animate-pulse">
                    <ClockIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span>Keep your streak alive!</span>
                </div>
            );
        } else if (daysRemaining > 1) {
             cueMessage = (
                <div className="flex items-center text-xs text-text-secondary font-semibold mt-2">
                    <span>{daysRemaining} days to go!</span>
                </div>
            );
        }
    }
    
    let progressBarClass = 'bg-primary-light';
    let activeStreakClass = 'text-yellow-600 dark:text-yellow-400';

    if (isCompleted) {
        progressBarClass = 'bg-primary-dark';
    } else if (isStreakInDanger) {
        progressBarClass = 'bg-orange-500 animate-pulse';
        activeStreakClass = 'text-orange-600 dark:text-orange-400';
    } else if (isAlmostThere) {
        progressBarClass = 'bg-primary';
        activeStreakClass = 'text-primary dark:text-primary-light';
    } else if (hasActiveStreak || hasActiveDailyChallenge) {
        progressBarClass = 'bg-yellow-400';
    }

    return (
        <Tooltip text={description}>
            <div className={`relative p-4 border-2 rounded-lg transition-all duration-300 flex flex-col h-full ${isCompleted ? 'border-green-400 dark:border-green-500/50 bg-green-50 dark:bg-green-900/40 shadow-md' : 'border-border bg-card'}`}>
                 {isCustom && (
                    <div className="absolute top-2 right-2 flex items-center gap-1">
                        <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Custom</span>
                        <button onClick={onEdit} className="p-1 rounded-full text-text-secondary hover:bg-border"><EditIcon className="h-4 w-4"/></button>
                        <button onClick={onDelete} className="p-1 rounded-full text-text-secondary hover:bg-border"><TrashIcon className="h-4 w-4"/></button>
                    </div>
                )}
                <div className="flex-grow">
                    <div className="flex items-start">
                        <div className="text-3xl mr-3">{icon}</div>
                        <div>
                            <h4 className={`font-bold pr-16 flex items-center ${isCompleted ? 'text-green-800 dark:text-green-300' : 'text-text'}`}>
                                <span>{name}</span>
                                {hasActiveStreak && (
                                    <Tooltip text={`Active streak: ${progress} day${progress > 1 ? 's' : ''}!`}>
                                        <FlameIcon className="inline-block h-5 w-5 ml-2 text-orange-500" />
                                    </Tooltip>
                                )}
                            </h4>
                            <StatusLine 
                                isCompleted={isCompleted}
                                hasActiveStreak={hasActiveStreak}
                                progress={progress}
                                reward={reward}
                                activeStreakClass={activeStreakClass}
                            />
                        </div>
                    </div>
                </div>
                <div className="w-full mt-auto pt-2">
                    <div className="flex justify-between items-center text-xs font-semibold mb-1">
                        <span className={isCompleted ? 'text-green-700 dark:text-green-300' : 'text-text-secondary'}>Progress</span>
                        <span className={`font-bold ${isCompleted ? 'text-green-800 dark:text-green-300' : 'text-text'}`}>{progress} / {goal} {unit}</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                        <div
                            className={`h-2 rounded-full transition-all duration-500 ${progressBarClass}`}
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                    {cueMessage}
                </div>
                 {isCustom && !isCompleted && (
                    <button onClick={onLogProgress} className="mt-3 w-full flex items-center justify-center text-sm font-semibold bg-primary-light hover:bg-primary text-white py-1.5 px-3 rounded-full transition-colors">
                        <PlusCircleIcon className="h-5 w-5 mr-1.5" />
                        Log Progress
                    </button>
                )}
            </div>
        </Tooltip>
    );
};

export const Challenges: React.FC<ChallengesProps> = ({ currentUser, gamificationData, onCustomChallengeUpdate }) => {
    const [customChallenges, setCustomChallenges] = useState<Challenge[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isLogProgressModalOpen, setIsLogProgressModalOpen] = useState(false);
    const [challengeToEdit, setChallengeToEdit] = useState<Challenge | null>(null);
    const [challengeToLog, setChallengeToLog] = useState<Challenge | null>(null);

    const loadCustomChallenges = () => {
        setCustomChallenges(customChallengeService.getChallengesForUser(currentUser.id));
    };

    useEffect(() => {
        loadCustomChallenges();
    }, [currentUser.id]);

    const allChallenges = useMemo(() => {
        const predefined = Object.values(CHALLENGE_DEFINITIONS).map(c => ({...c, isCustom: false}));
        return [...predefined, ...customChallenges];
    }, [customChallenges]);

    const handleOpenCreateModal = () => {
        setChallengeToEdit(null);
        setIsCreateModalOpen(true);
    };

    const handleOpenEditModal = (challenge: Challenge) => {
        setChallengeToEdit(challenge);
        setIsCreateModalOpen(true);
    };

    const handleSaveChallenge = (challengeData: Omit<Challenge, 'id'>) => {
        if (challengeToEdit) {
            customChallengeService.updateChallengeForUser(currentUser.id, { ...challengeData, id: challengeToEdit.id });
        } else {
            customChallengeService.addChallengeForUser(currentUser.id, challengeData);
        }
        loadCustomChallenges();
        setIsCreateModalOpen(false);
    };

    const handleDeleteChallenge = (challengeId: string) => {
        if (window.confirm('Are you sure you want to delete this custom challenge?')) {
            customChallengeService.deleteChallengeForUser(currentUser.id, challengeId);
            loadCustomChallenges();
        }
    };

    const handleOpenLogProgress = (challenge: Challenge) => {
        setChallengeToLog(challenge);
        if (challenge.type === 'streak') {
            onCustomChallengeUpdate(challenge, 1);
        } else {
            setIsLogProgressModalOpen(true);
        }
    };

    const handleLogProgress = (value: number) => {
        if (challengeToLog) {
            onCustomChallengeUpdate(challengeToLog, value);
        }
        setIsLogProgressModalOpen(false);
    };

    return (
        <>
            {isCreateModalOpen && (
                <CreateChallengeModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onSave={handleSaveChallenge}
                    challengeToEdit={challengeToEdit}
                />
            )}
            {isLogProgressModalOpen && challengeToLog && (
                <LogProgressModal
                    challenge={challengeToLog}
                    onClose={() => setIsLogProgressModalOpen(false)}
                    onLog={handleLogProgress}
                />
            )}
            <div className="bg-card p-6 rounded-lg shadow-lg">
                <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center mb-4 text-center sm:text-left">
                    <h3 className="text-xl font-bold text-text flex items-center">
                        <BoltIcon className="h-6 w-6 mr-2 text-yellow-500" />
                        Active Challenges
                    </h3>
                    <button 
                        onClick={handleOpenCreateModal}
                        className="mt-3 sm:mt-0 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-full transition-colors duration-300 text-sm inline-flex items-center"
                    >
                        <PlusCircleIcon className="h-5 w-5 mr-2"/>
                        Create Custom Challenge
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {allChallenges.map(challenge => (
                        <ChallengeCard 
                            key={challenge.id} 
                            challenge={challenge} 
                            state={gamificationData.challengeStates[challenge.id]} 
                            onLogProgress={() => handleOpenLogProgress(challenge)}
                            onEdit={() => handleOpenEditModal(challenge)}
                            onDelete={() => handleDeleteChallenge(challenge.id)}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};