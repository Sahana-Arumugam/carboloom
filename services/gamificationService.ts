import { GamificationData, LogEntry, Badge, TransportMode, UserChallengeState, Quiz, UserQuizState, QuizProgress, Challenge } from '../types';
// FIX: Added INDIA_GRID_EMISSION_FACTOR to the import to resolve calculation errors.
import { BADGE_DEFINITIONS, CHALLENGE_DEFINITIONS, INDIA_GRID_EMISSION_FACTOR } from '../constants';
import { calculateFootprint, daysBetween } from '../utils';

const GAMIFICATION_KEY = 'carboLoomGamification';

const getAllGamificationData = (): Record<string, GamificationData> => {
    const data = localStorage.getItem(GAMIFICATION_KEY);
    return data ? JSON.parse(data) : {};
};

const saveAllGamificationData = (data: Record<string, GamificationData>) => {
    localStorage.setItem(GAMIFICATION_KEY, JSON.stringify(data));
};

const checkAllBadgeAchievements = (allLogs: LogEntry[]): Badge[] => {
    const earnedBadges: Badge[] = [];

    if (allLogs.length > 0) {
        earnedBadges.push(BADGE_DEFINITIONS.first_log);
    }
    
    if (allLogs.length >= 7) {
        earnedBadges.push(BADGE_DEFINITIONS.consistent_logger_7);
    }

    const publicTransportDistance = allLogs.reduce((total, log) => {
        return total + log.habits.travel
            .filter(t => t.mode === TransportMode.Bus || t.mode === TransportMode.Train)
            .reduce((subTotal, t) => subTotal + t.distance, 0);
    }, 0);
    if (publicTransportDistance > 50) {
        earnedBadges.push(BADGE_DEFINITIONS.commuter_hero);
    }

    const cycleDistance = allLogs.reduce((total, log) => {
        return total + log.habits.travel
            .filter(t => t.mode === TransportMode.Bicycle)
            .reduce((subTotal, t) => subTotal + t.distance, 0);
    }, 0);
    if (cycleDistance > 20) {
        earnedBadges.push(BADGE_DEFINITIONS.pedal_power);
    }

    const sustainableItemsCount = allLogs.reduce((total, log) => {
        return total + log.habits.shopping
            .filter(s => s.material.toLowerCase().includes('organic') || s.material.toLowerCase().includes('recycled'))
            .length;
    }, 0);
    if (sustainableItemsCount >= 5) {
        earnedBadges.push(BADGE_DEFINITIONS.eco_shopper);
    }
    
    const lowCarbonDays = allLogs.filter(log => {
        // FIX: Added the missing emissionFactor argument to the calculateFootprint call.
        const footprint = calculateFootprint(log.habits, INDIA_GRID_EMISSION_FACTOR);
        return footprint && footprint.total < 5;
    }).length;
    if (lowCarbonDays >= 1) {
        earnedBadges.push(BADGE_DEFINITIONS.low_carbon_day);
    }
    
    return earnedBadges;
};

const updateChallenges = (currentStates: Record<string, UserChallengeState>, newLog: LogEntry, allLogs: LogEntry[]): { updatedStates: Record<string, UserChallengeState>, points: number, badges: Badge[] } => {
    let pointsAwarded = 0;
    const badgesAwarded: Badge[] = [];
    const today = newLog.date;
    const yesterday = new Date(new Date(today).getTime() - (24 * 60 * 60 * 1000)).toISOString().split('T')[0];
    
    const newStates = JSON.parse(JSON.stringify(currentStates)); // Deep copy to avoid mutation

    for (const challenge of Object.values(CHALLENGE_DEFINITIONS)) {
        const state: UserChallengeState = newStates[challenge.id] || { progress: 0, lastUpdated: '', rewardedGoal: 0 };
        
        if (state.progress >= challenge.goal && state.rewardedGoal >= challenge.goal) {
            continue;
        }

        let progressMadeToday = false;
        let newProgress = state.progress;

        if (challenge.type === 'streak') {
            const daysSinceUpdate = state.lastUpdated ? daysBetween(state.lastUpdated, today) : -1;

            let meetsCondition = false;
            switch(challenge.id) {
                case 'logging_streak_5':
                    meetsCondition = true;
                    break;
                case 'low_carbon_day_streak_3':
                    // FIX: Added the missing emissionFactor argument to the calculateFootprint call.
                    const footprint = calculateFootprint(newLog.habits, INDIA_GRID_EMISSION_FACTOR);
                    meetsCondition = !!footprint && footprint.total < 5;
                    break;
                case 'green_commute_streak_3':
                    meetsCondition = newLog.habits.travel.some(t => t.mode === TransportMode.Walking || t.mode === TransportMode.Bicycle);
                    break;
            }
            
            if (meetsCondition) {
                if (state.lastUpdated === today) {
                    // Already updated today, do nothing.
                } else if (state.lastUpdated === yesterday || daysSinceUpdate === 1 || state.progress === 0) {
                    newProgress++; // Continue streak
                } else {
                    newProgress = 1; // Reset streak
                }
                progressMadeToday = true;
            } else {
                 if (state.lastUpdated !== today) {
                    newProgress = 0; // Reset streak if condition not met on a new day
                }
            }

        } else if (challenge.type === 'daily') {
            if (state.lastUpdated !== today) {
                 newProgress = 0; 
            }
            
            switch (challenge.id) {
                case 'green_commute_10':
                    const greenDistance = newLog.habits.travel
                        .filter(t => t.mode === TransportMode.Walking || t.mode === TransportMode.Bicycle)
                        .reduce((sum, t) => sum + t.distance, 0);
                    newProgress += greenDistance;
                    break;
            }
            progressMadeToday = true;
        }
        
        if (progressMadeToday) {
             state.lastUpdated = today;
        }
        state.progress = newProgress;
        
        if (state.progress >= challenge.goal && state.rewardedGoal < challenge.goal) {
            pointsAwarded += challenge.reward;
            state.rewardedGoal = challenge.goal;
            if (challenge.id === 'logging_streak_5') {
                badgesAwarded.push(BADGE_DEFINITIONS.streak_master_5);
            }
        }
        
        newStates[challenge.id] = state;
    }

    return { updatedStates: newStates, points: pointsAwarded, badges: badgesAwarded };
}


export const gamificationService = {
    initializeForUser: (userId: string): void => {
        const allData = getAllGamificationData();
        if (!allData[userId]) {
            allData[userId] = {
                points: 0,
                badges: [],
                challengeStates: {},
                quizStates: {},
            };
            saveAllGamificationData(allData);
        }
    },

    getGamificationDataForUser: (userId: string): GamificationData => {
        const allData = getAllGamificationData();
        const userData = allData[userId] || {
            points: 0,
            badges: [],
            challengeStates: {},
            quizStates: {},
        };
        if (!userData.quizStates) {
            userData.quizStates = {};
        }
        return userData;
    },
    
    processLogAndAward: (userId: string, newLog: LogEntry, allLogs: LogEntry[]): GamificationData => {
        const allData = getAllGamificationData();
        const currentData = gamificationService.getGamificationDataForUser(userId);

        let pointsAwarded = 10; // Base points

        const earnedBadges = checkAllBadgeAchievements(allLogs);
        
        const challengeResult = updateChallenges(currentData.challengeStates, newLog, allLogs);
        pointsAwarded += challengeResult.points;
        const newChallengeBadges = challengeResult.badges;

        const updatedPoints = currentData.points + pointsAwarded;
        
        const allNewBadges = [...earnedBadges, ...newChallengeBadges];
        const currentBadgeIds = new Set(currentData.badges.map(b => b.id));
        const uniqueNewBadges = allNewBadges.filter(b => !currentBadgeIds.has(b.id));
        
        const updatedBadges = [...currentData.badges, ...uniqueNewBadges];

        const newData: GamificationData = {
            points: updatedPoints,
            badges: updatedBadges,
            challengeStates: challengeResult.updatedStates,
            quizStates: currentData.quizStates,
        };
        
        allData[userId] = newData;
        saveAllGamificationData(allData);
        
        return newData;
    },

    processCustomChallengeUpdate: (userId: string, challenge: Challenge, today: string, value: number): GamificationData => {
        const allData = getAllGamificationData();
        const currentData = gamificationService.getGamificationDataForUser(userId);
        const newStates = JSON.parse(JSON.stringify(currentData.challengeStates));
        const state: UserChallengeState = newStates[challenge.id] || { progress: 0, lastUpdated: '', rewardedGoal: 0 };
        let pointsAwarded = 0;
        // FIX: Defined 'yesterday' to resolve reference error. This is needed for streak logic.
        const yesterday = new Date(new Date(today).getTime() - (24 * 60 * 60 * 1000)).toISOString().split('T')[0];
    
        if (state.progress >= challenge.goal && state.rewardedGoal >= challenge.goal) {
            return currentData; // Already completed and rewarded
        }
    
        if (challenge.type === 'streak') {
            const daysSinceUpdate = state.lastUpdated ? daysBetween(state.lastUpdated, today) : -1;
            if (value > 0) { // A value > 0 means the user confirmed they met the streak condition for today
                if (state.lastUpdated === today) {
                    // Already logged for today, do nothing.
                } else if (state.lastUpdated === yesterday || daysSinceUpdate === 1 || state.progress === 0) {
                    state.progress++; // Continue streak
                } else {
                    state.progress = 1; // Reset and start new streak
                }
            } else { // A value of 0 implies the condition was not met
                if (state.lastUpdated !== today) {
                    state.progress = 0; // Reset streak if condition not met on a new day
                }
            }
        } else { // 'daily' type
            if (state.lastUpdated !== today) {
                state.progress = 0; // Reset daily progress if it's a new day
            }
            state.progress += value;
        }
        
        state.lastUpdated = today;
    
        if (state.progress >= challenge.goal && state.rewardedGoal < challenge.goal) {
            pointsAwarded += challenge.reward;
            state.rewardedGoal = challenge.goal;
        }
    
        newStates[challenge.id] = state;
    
        const newData: GamificationData = {
            ...currentData,
            points: currentData.points + pointsAwarded,
            challengeStates: newStates,
        };
        
        allData[userId] = newData;
        saveAllGamificationData(allData);
        
        return newData;
    },

    processQuizCompletion: (userId: string, quiz: Quiz, score: number): GamificationData => {
        const allData = getAllGamificationData();
        const currentData = gamificationService.getGamificationDataForUser(userId);
        
        const today = new Date().toISOString().split('T')[0];
        const existingState = currentData.quizStates[quiz.id];

        const isFirstCompletion = !existingState || existingState.attempts === 0;

        if (isFirstCompletion) {
            // Award points and badges only on first completion
            currentData.points += quiz.reward.points;
            if (quiz.reward.badgeId) {
                const badge = BADGE_DEFINITIONS[quiz.reward.badgeId];
                if (badge && !currentData.badges.some(b => b.id === badge.id)) {
                    currentData.badges.push(badge);
                }
            }
        }
        
        // Update or create the quiz state
        const updatedState: UserQuizState = {
            attempts: (existingState?.attempts || 0) + 1,
            highestScore: Math.max(existingState?.highestScore || 0, score),
            totalQuestions: quiz.questions.length,
            lastAttempted: today,
            // `progress` is intentionally omitted to clear it upon completion.
        };

        currentData.quizStates[quiz.id] = updatedState;
        
        allData[userId] = currentData;
        saveAllGamificationData(allData);
        return currentData;
    },

    saveQuizProgress: (userId: string, quizId: string, progress: QuizProgress): GamificationData => {
        const allData = getAllGamificationData();
        const currentData = gamificationService.getGamificationDataForUser(userId);
        const quizState = currentData.quizStates[quizId] || {
            attempts: 0,
            highestScore: 0,
            totalQuestions: progress.shuffledQuestions.length,
            lastAttempted: '',
        };
        
        quizState.progress = progress;
        currentData.quizStates[quizId] = quizState;
        
        allData[userId] = currentData;
        saveAllGamificationData(allData);
        return currentData;
    },

    clearQuizProgressAndRestart: (userId: string, quizId: string): GamificationData => {
        const allData = getAllGamificationData();
        const currentData = gamificationService.getGamificationDataForUser(userId);
        const quizState = currentData.quizStates[quizId];

        if (quizState && quizState.progress) {
            delete quizState.progress;
            currentData.quizStates[quizId] = quizState;
            allData[userId] = currentData;
            saveAllGamificationData(allData);
        }
        
        return currentData;
    },
};