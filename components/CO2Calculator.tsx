import React, { useState } from 'react';
import { getTravelCo2e } from '../services/geminiService';
import { LeafIcon } from './icons/LeafIcon';

export const CO2Calculator: React.FC = () => {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [result, setResult] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = async () => {
        if (!from || !to) {
            setError('Please enter both a starting point and a destination.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const data = await getTravelCo2e(from, to);
            setResult(data.co2e);
        } catch (e) {
            setError('Sorry, we could not calculate the footprint for this trip. Please try again.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-card p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-text mb-4 text-center">Travel CO₂ Calculator</h3>
            <p className="text-text-secondary text-center mb-6">
                Estimate the round-trip carbon footprint for a standard gasoline car journey.
            </p>
            <div className="space-y-4">
                <div>
                    <label htmlFor="from-location" className="block text-sm font-medium text-text-secondary mb-1">From</label>
                    <input
                        id="from-location"
                        type="text"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        placeholder="e.g., Mumbai"
                        className="w-full p-2 border border-border rounded-md bg-background text-text focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div>
                    <label htmlFor="to-location" className="block text-sm font-medium text-text-secondary mb-1">To</label>
                    <input
                        id="to-location"
                        type="text"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        placeholder="e.g., Delhi"
                        className="w-full p-2 border border-border rounded-md bg-background text-text focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            <div className="mt-6">
                <button
                    onClick={handleCalculate}
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-full transition-transform transform hover:scale-105 duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Calculating...' : 'Calculate Footprint'}
                </button>
            </div>

            {isLoading && (
                <div className="flex justify-center items-center py-6">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-primary"></div>
                </div>
            )}
            
            {error && (
                <div className="mt-6 text-center text-red-600 bg-red-100 p-3 rounded-lg border border-red-200">{error}</div>
            )}

            {result !== null && (
                <div className="mt-8 text-center bg-primary/10 p-6 rounded-lg">
                    <p className="text-text-secondary">Estimated Round-Trip Footprint:</p>
                    <p className="text-5xl font-extrabold text-primary my-2 flex items-center justify-center gap-3">
                        <LeafIcon className="h-10 w-10"/>
                        {result}
                    </p>
                    <p className="font-bold text-primary">kg CO₂e</p>
                </div>
            )}
        </div>
    );
};