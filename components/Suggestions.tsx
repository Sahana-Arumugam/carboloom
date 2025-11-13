import React, { useState, useEffect } from 'react';
import { getEcoSuggestions, getCarbonSavingsPrediction } from '../services/geminiService';
import { DailyHabits, FootprintData, EcoSuggestion, User } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { RefreshIcon } from './icons/RefreshIcon';
import { FoodCoach } from './FoodCoach';
import { LabIcon } from './icons/LabIcon';
import { HabitDiscovery } from './HabitDiscovery';

interface SuggestionsProps {
  currentUser: User;
  weeklyHabits: DailyHabits | null;
  footprintData: FootprintData | null;
}

const SuggestionCard: React.FC<{ suggestion: EcoSuggestion; onPredict: () => void; prediction: string | null; isPredicting: boolean }> = ({ suggestion, onPredict, prediction, isPredicting }) => (
  <div className="bg-card rounded-lg shadow-md p-6 flex flex-col justify-between">
    <div>
      <h4 className="text-lg font-bold text-text">{suggestion.title}</h4>
      <p className="text-text-secondary mt-2">{suggestion.description}</p>
    </div>
    <div className="mt-4">
      <button 
        onClick={onPredict}
        disabled={isPredicting}
        className="w-full bg-primary-light hover:bg-primary text-white font-semibold py-2 px-4 rounded-full transition duration-300 disabled:bg-gray-300 flex items-center justify-center"
      >
        {isPredicting ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        ) : (
          <>
            <SparklesIcon className="w-5 h-5 mr-2" /> Predict My Savings
          </>
        )}
      </button>
      {prediction && (
        <div className="mt-3 text-center bg-primary/10 p-3 rounded-md">
            <p className="font-semibold text-sm text-primary-dark leading-normal">{prediction}</p>
        </div>
      )}
    </div>
  </div>
);

export const Suggestions: React.FC<SuggestionsProps> = ({ currentUser, weeklyHabits, footprintData }) => {
  const [suggestions, setSuggestions] = useState<EcoSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Record<string, string | null>>({});
  const [predictingIndex, setPredictingIndex] = useState<number | null>(null);

  const handleFetchSuggestions = async () => {
    if (!weeklyHabits) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    setPredictions({});
    try {
      const result = await getEcoSuggestions(weeklyHabits);
      setSuggestions(result);
    } catch (e) {
      setError('Sorry, we couldn\'t fetch suggestions right now. Please try again later.');
      console.error(e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Automatically fetch suggestions whenever the user's habits are available.
    // This effect runs once when the component mounts with habit data.
    if (weeklyHabits) {
        handleFetchSuggestions();
    } else {
        setIsLoading(false);
    }
  }, [weeklyHabits]);


  const handlePredictSavings = async (suggestion: EcoSuggestion, index: number) => {
    if (!footprintData) return;
    setPredictingIndex(index);
    try {
      // Pass the user's monthly goal for a more contextual prediction
      const result = await getCarbonSavingsPrediction(footprintData, suggestion, currentUser.monthlyGoal);
      setPredictions(prev => ({...prev, [suggestion.title]: result}));
    } catch (e) {
      console.error(e);
      setPredictions(prev => ({...prev, [suggestion.title]: 'Could not predict savings at this time.'}));
    }
    setPredictingIndex(null);
  }

  if (!weeklyHabits) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center p-8 bg-card rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-text mb-4">Discover New Weaving Patterns</h2>
            <p className="mb-6 text-text-secondary">
            First, weave your daily threads to get personalized, AI-powered patterns for reducing your impact.
            </p>
        </div>
        <div className="mt-12">
            <div className="text-center bg-card p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-text mb-2 flex items-center justify-center">
                    <LabIcon className="h-6 w-6 mr-3 text-primary"/>
                    Habit Discovery Lab
                </h2>
                <p className="text-text-secondary mb-4">Or, tell us about yourself to discover new, personalized eco-habits powered by AI.</p>
            </div>
            <div className="mt-2">
              <HabitDiscovery currentUser={currentUser} />
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <FoodCoach weeklyHabits={weeklyHabits} />

      <div className="text-center bg-card p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-text mb-2">Weaving Patterns for You</h2>
        <p className="text-text-secondary mb-4">Based on your recent habits, here are some personalized ideas to shrink your footprint.</p>
         <button
              onClick={handleFetchSuggestions}
              disabled={isLoading}
              className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-full transition-transform transform hover:scale-105 duration-300 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {isLoading ? 'Generating...' : <><RefreshIcon className="h-5 w-5" /> Get New Ideas</>}
            </button>
      </div>

      {isLoading && (
         <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
        </div>
      )}

      {error && (
        <div className="text-center text-red-600 bg-red-100 p-3 rounded-lg border border-red-200">{error}</div>
      )}
      
      {!isLoading && !error && suggestions.length === 0 && (
         <div className="text-center p-8 bg-card rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-text">No suggestions generated.</h3>
            <p className="mb-6 text-text-secondary">
                Try logging more habits or click "Get New Ideas" to try again.
            </p>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestions.map((s, index) => (
            <SuggestionCard 
              key={`${s.title}-${index}`}
              suggestion={s}
              onPredict={() => handlePredictSavings(s, index)}
              isPredicting={predictingIndex === index}
              prediction={predictions[s.title] || null}
            />
          ))}
        </div>
      )}
      
      <div className="mt-12">
        <div className="text-center bg-card p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-text mb-2 flex items-center justify-center">
                <LabIcon className="h-6 w-6 mr-3 text-primary"/>
                Habit Discovery Lab
            </h2>
            <p className="text-text-secondary mb-4">Tell us about yourself to discover new, personalized eco-habits powered by AI.</p>
        </div>
        <div className="mt-2">
            <HabitDiscovery currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
};