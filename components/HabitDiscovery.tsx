import React, { useState } from 'react';
import { getHabitDiscoverySuggestions } from '../services/geminiService';
import { Habit, User } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';

interface HabitDiscoveryProps {
  currentUser: User;
}

const getCommitmentClass = (commitment: 'Low' | 'Medium' | 'High') => {
  switch (commitment) {
    case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
    case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const HabitCard: React.FC<{ habit: Habit }> = ({ habit }) => (
    <div className="bg-card p-4 rounded-lg border border-border shadow-sm flex flex-col h-full">
        <p className="text-text flex-grow">{habit.description}</p>
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-sm">
            <span 
                className={`px-2 py-1 font-bold rounded-full text-xs ${getCommitmentClass(habit.commitment)}`}
            >
                {habit.commitment} Commitment
            </span>
            <span className="font-semibold text-primary">{habit.co2Reduction} / week</span>
        </div>
    </div>
);

export const HabitDiscovery: React.FC<HabitDiscoveryProps> = ({ currentUser }) => {
    const [interests, setInterests] = useState('');
    const [dailyRoutine, setDailyRoutine] = useState('');
    const [suggestions, setSuggestions] = useState<Habit[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!interests || !dailyRoutine) {
            setError('Please fill out all fields to get the best suggestions.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuggestions([]);
        try {
            const result = await getHabitDiscoverySuggestions(interests, currentUser.ageGroup, dailyRoutine);
            setSuggestions(result);
        } catch (err) {
            setError('Sorry, we couldn\'t generate habits right now. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-card p-6 rounded-lg shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="interests" className="block text-sm font-medium text-text-secondary mb-1">Your Interests & Hobbies</label>
                    <textarea
                        id="interests"
                        value={interests}
                        onChange={(e) => setInterests(e.target.value)}
                        placeholder="e.g., Gaming, hiking, cooking, watching movies..."
                        rows={2}
                        className="w-full p-2 border border-border rounded-md bg-background text-text focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div>
                    <label htmlFor="daily-routine" className="block text-sm font-medium text-text-secondary mb-1">A Typical Day</label>
                    <textarea
                        id="daily-routine"
                        value={dailyRoutine}
                        onChange={(e) => setDailyRoutine(e.target.value)}
                        placeholder="e.g., Student, commute by metro, work 9-5, gym in the evening..."
                        rows={2}
                        className="w-full p-2 border border-border rounded-md bg-background text-text focus:ring-2 focus:ring-primary"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-full transition-transform transform hover:scale-105 duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                >
                    {isLoading ? 'Discovering...' : <><SparklesIcon className="h-5 w-5" /> Discover Habits</>}
                </button>
            </form>

             {isLoading && (
                 <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
                </div>
            )}

            {error && (
                <div className="mt-4 text-center text-red-600 bg-red-100 p-3 rounded-lg border border-red-200">{error}</div>
            )}
            
            {suggestions.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-xl font-bold text-text text-center mb-4">Here are 5 ideas for you!</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {suggestions.map((habit, index) => (
                           <HabitCard key={index} habit={habit} />
                        ))}
                         <div className="bg-primary/10 p-4 rounded-lg border border-primary/20 flex flex-col h-full md:col-span-2 lg:col-span-1">
                            <p className="text-text font-semibold text-center">Ready to commit?</p>
                            <p className="text-text-secondary text-sm mt-2 flex-grow text-center">
                                Try creating a custom challenge on your Tapestry page to track your new habit and earn points!
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};