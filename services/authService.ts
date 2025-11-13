import { User, LogEntry, AgeGroup, Country, IndianState } from '../types';
import { gamificationService } from './gamificationService';

// In-memory simulation of a backend using localStorage.
// This is for demonstration purposes and is not a secure way to handle real user data.

const USERS_KEY = 'carboLoomUsers';
const LOGS_KEY = 'carboLoomLogs';
const SESSION_USER_KEY = 'carboLoomSessionUser';
const PERSISTENT_USER_KEY = 'carboLoomPersistentUser';


// Helper function to get users from localStorage
// FIX: Update type definition to include the optional 'state' property.
const getUsers = (): Record<string, { id: string, username: string, passwordHash: string, ageGroup: AgeGroup, country: Country, state?: IndianState }> => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : {};
};

// Helper function to save users to localStorage
const saveUsers = (users: Record<string, any>) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Simple "hashing" for demonstration. DO NOT USE IN PRODUCTION.
const hashPassword = (password: string, username: string): string => {
    return `${username.split('').reverse().join('')}${password.split('').reverse().join('')}`;
};

export const authService = {
    // FIX: Update register function to accept and store the user's state.
    register: (username: string, password: string, ageGroup: AgeGroup, country: Country, state: IndianState): User => {
        const users = getUsers();
        if (Object.values(users).some(u => u.username.toLowerCase() === username.toLowerCase())) {
            throw new Error('Username already exists.');
        }

        const id = new Date().getTime().toString();
        const newUser = {
            id,
            username,
            passwordHash: hashPassword(password, username),
            ageGroup,
            country,
            state,
        };

        users[id] = newUser;
        saveUsers(users);

        const userForSession: User = { id, username, ageGroup, country, state };
        // Registration creates a session-only login by default
        sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(userForSession));
        
        // Initialize logs for new user
        const allLogs = authService.getAllLogs();
        allLogs[id] = [];
        localStorage.setItem(LOGS_KEY, JSON.stringify(allLogs));

        // Initialize gamification data for new user
        gamificationService.initializeForUser(id);
        
        return userForSession;
    },

    login: (username: string, password: string, rememberMe: boolean): User => {
        const users = getUsers();
        const userRecord = Object.values(users).find(u => u.username.toLowerCase() === username.toLowerCase());

        if (!userRecord || userRecord.passwordHash !== hashPassword(password, username)) {
            throw new Error('Invalid username or password.');
        }

        // FIX: Include the user's state when creating the session object.
        const userForSession: User = { 
            id: userRecord.id, 
            username: userRecord.username,
            ageGroup: userRecord.ageGroup,
            country: userRecord.country,
            state: userRecord.state,
        };
        
        if (rememberMe) {
            localStorage.setItem(PERSISTENT_USER_KEY, JSON.stringify(userForSession));
        } else {
            sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(userForSession));
        }

        return userForSession;
    },

    logout: (): void => {
        localStorage.removeItem(PERSISTENT_USER_KEY);
        sessionStorage.removeItem(SESSION_USER_KEY);
    },

    getCurrentUser: (): User | null => {
        const persistentUser = localStorage.getItem(PERSISTENT_USER_KEY);
        if(persistentUser) return JSON.parse(persistentUser);

        const sessionUser = sessionStorage.getItem(SESSION_USER_KEY);
        if(sessionUser) return JSON.parse(sessionUser);

        return null;
    },
    
    updateCurrentUser: (updatedFields: Partial<User>): User | null => {
        const persistentUserJson = localStorage.getItem(PERSISTENT_USER_KEY);
        const sessionUserJson = sessionStorage.getItem(SESSION_USER_KEY);

        let currentUser: User | null = null;
        let storageKey: 'persistent' | 'session' | null = null;

        if (persistentUserJson) {
            currentUser = JSON.parse(persistentUserJson);
            storageKey = 'persistent';
        } else if (sessionUserJson) {
            currentUser = JSON.parse(sessionUserJson);
            storageKey = 'session';
        }

        if (currentUser && storageKey) {
            const updatedUser = { ...currentUser, ...updatedFields };

            if (storageKey === 'persistent') {
                localStorage.setItem(PERSISTENT_USER_KEY, JSON.stringify(updatedUser));
            } else {
                sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(updatedUser));
            }
            return updatedUser;
        }

        return null;
    },

    getAllUsers: (): User[] => {
        const users = getUsers();
        // FIX: Include the user's state when returning all users.
        return Object.values(users).map((u: any) => ({
            id: u.id,
            username: u.username,
            ageGroup: u.ageGroup,
            country: u.country,
            state: u.state,
        }));
    },

    // --- Log Management ---
    
    getAllLogs: (): Record<string, LogEntry[]> => {
        const logs = localStorage.getItem(LOGS_KEY);
        return logs ? JSON.parse(logs) : {};
    },

    getLogsForUser: (userId: string): LogEntry[] => {
        const allLogs = authService.getAllLogs();
        return allLogs[userId] || [];
    },

    saveLogForUser: (userId: string, newEntry: LogEntry): LogEntry[] => {
        const allLogs = authService.getAllLogs();
        const currentUserLogs = allLogs[userId] || [];
        
        let updatedUserLogs;
        const existingEntryIndex = currentUserLogs.findIndex(e => e.date === newEntry.date);

        if (existingEntryIndex > -1) {
            // Replace the existing entry immutably.
            updatedUserLogs = currentUserLogs.map((log, index) => 
                index === existingEntryIndex ? newEntry : log
            );
        } else {
            // Add the new entry immutably.
            updatedUserLogs = [...currentUserLogs, newEntry];
        }
        
        // Sort the new array in place. Since updatedUserLogs is already a new array, this is safe.
        updatedUserLogs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        // Create a new top-level object for all logs to ensure immutability.
        const newAllLogs = {
            ...allLogs,
            [userId]: updatedUserLogs
        };
        
        localStorage.setItem(LOGS_KEY, JSON.stringify(newAllLogs));
        
        return updatedUserLogs;
    },
};