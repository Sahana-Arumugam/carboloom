import React, { useState, useEffect } from 'react';
import { getPlantBasedSwapSuggestion, PlantBasedSwap } from '../services/geminiService';
import { DailyHabits } from '../types';
import { MeatIcon } from './icons/MeatIcon';
import { PlantIcon } from './icons/PlantIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

interface FoodCoachProps {
    weeklyHabits: DailyHabits | null;
}

export const FoodCoach: React.FC<FoodCoachProps> = ({ weeklyHabits }) => {
    const [result, setResult] = useState<PlantBasedSwap | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [redMeatServings, setRedMeatServings] = useState(0);

    useEffect(() => {
        if (!weeklyHabits || !weeklyHabits.food) {
            setRedMeatServings(0);
            return;
        }

        const totalServings = weeklyHabits.food
            .filter(item => item.category === 'Red Meat')
            .reduce((sum, item) => sum + item.servings, 0);

        setRedMeatServings(totalServings);
    }, [weeklyHabits]);

    useEffect(() => {
        const getSuggestion = async () => {
            if (redMeatServings > 0) {
                setIsLoading(true);
                setError(null);
                setResult(null);
                try {
                    const data = await getPlantBasedSwapSuggestion(redMeatServings);
                    setResult(data.swap);
                } catch (e) {
                    setError('Sorry, we could not get a suggestion at this time. Please try again.');
                    console.error(e);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setResult(null);
                setError(null);
                setIsLoading(false);
            }
        };

        getSuggestion();

    }, [redMeatServings]);
    
    // Don't render the component if there are no habits logged yet for the week.
    if (!weeklyHabits) {
        return null;
    }

    return (
        <div className="bg-card p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-text text-center">Personalized Food Coach</h3>
            
            {isLoading && (
                <div className="flex flex-col justify-center items-center py-6 text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-primary"></div>
                    <p className="mt-4 text-sm font-semibold text-text-secondary">Analyzing your diet for a smart swap...</p>
                </div>
            )}
            
            {!isLoading && error && (
                <div className="mt-6 text-center text-red-600 bg-red-100 p-3 rounded-lg border border-red-200">{error}</div>
            )}
            
            {!isLoading && !error && result && (
                <>
                    <p className="text-text-secondary text-center mt-2 mb-6">
                        Based on your {redMeatServings} serving(s) of red meat this week, here's an impactful swap:
                    </p>
                    <div className="text-center bg-background p-6 rounded-lg border border-border">
                        <h4 className="text-lg font-bold text-primary-dark">{result.title}</h4>
                        <div className="flex items-center justify-center gap-4 sm:gap-8 my-4">
                            <div className="flex flex-col items-center gap-2">
                                <MeatIcon className="h-10 w-10 text-red-500" />
                                <span className="text-sm font-semibold text-text-secondary">Red Meat</span>
                            </div>
                            <ArrowRightIcon className="h-8 w-8 text-text-secondary flex-shrink-0" />
                            <div className="flex flex-col items-center gap-2">
                                <PlantIcon className="h-10 w-10 text-green-500" />
                                <span className="text-sm font-semibold text-text-secondary">Plant-Based</span>
                            </div>
                        </div>
                        <p className="text-text-secondary mb-4">{result.description}</p>
                        <div className="bg-primary/10 p-4 rounded-lg">
                            <p className="text-text-secondary text-sm">Approximate CO₂e Reduction:</p>
                            <p className="text-4xl font-extrabold text-primary">
                            {result.reductionPercentage}%
                            </p>
                        </div>
                    </div>
                </>
            )}

             {!isLoading && !error && !result && (
                <div className="text-center mt-6">
                    <div className="inline-block p-4 bg-green-100 rounded-full">
                         <PlantIcon className="h-10 w-10 text-green-600" />
                    </div>
                    <p className="text-text-secondary font-semibold mt-4">
                        Great work! No red meat logged in the past week.
                    </p>
                </div>
            )}
        </div>
    );
};