import { Challenge } from '../types';

const CUSTOM_CHALLENGES_KEY = 'carboLoomCustomChallenges';

// Data structure: Record<userId, Challenge[]>
const getAllCustomChallenges = (): Record<string, Challenge[]> => {
    const data = localStorage.getItem(CUSTOM_CHALLENGES_KEY);
    return data ? JSON.parse(data) : {};
};

const saveAllCustomChallenges = (data: Record<string, Challenge[]>) => {
    localStorage.setItem(CUSTOM_CHALLENGES_KEY, JSON.stringify(data));
};

export const customChallengeService = {
    getChallengesForUser: (userId: string): Challenge[] => {
        const allChallenges = getAllCustomChallenges();
        return allChallenges[userId] || [];
    },

    addChallengeForUser: (userId: string, challengeData: Omit<Challenge, 'id' | 'isCustom'>): Challenge => {
        const allChallenges = getAllCustomChallenges();
        const userChallenges = allChallenges[userId] || [];
        
        const newChallenge: Challenge = {
            ...challengeData,
            id: `custom_${new Date().getTime()}`,
            isCustom: true,
        };

        allChallenges[userId] = [...userChallenges, newChallenge];
        saveAllCustomChallenges(allChallenges);
        return newChallenge;
    },

    updateChallengeForUser: (userId: string, updatedChallenge: Challenge): Challenge => {
        const allChallenges = getAllCustomChallenges();
        let userChallenges = allChallenges[userId] || [];
        
        userChallenges = userChallenges.map(c => c.id === updatedChallenge.id ? updatedChallenge : c);

        allChallenges[userId] = userChallenges;
        saveAllCustomChallenges(allChallenges);
        return updatedChallenge;
    },
    
    deleteChallengeForUser: (userId: string, challengeId: string): void => {
        const allChallenges = getAllCustomChallenges();
        let userChallenges = allChallenges[userId] || [];
        
        allChallenges[userId] = userChallenges.filter(c => c.id !== challengeId);
        saveAllCustomChallenges(allChallenges);
    },
};