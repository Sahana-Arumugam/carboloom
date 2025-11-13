import React, { useState, useEffect } from 'react';
import { User, GroundedResponse } from '../types';
import { getStateCarbonReports } from '../services/geminiService';
import { DocumentTextIcon } from './icons/DocumentTextIcon';

interface StateCarbonReportProps {
    currentUser: User;
}

export const StateCarbonReport: React.FC<StateCarbonReportProps> = ({ currentUser }) => {
    const [reportData, setReportData] = useState<GroundedResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReports = async () => {
            if (!currentUser.state) {
                setError("Your state is not set. Please update your profile.");
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);
            try {
                const fetchedData = await getStateCarbonReports(currentUser.state);
                setReportData(fetchedData);
            } catch (e) {
                setError("Sorry, we couldn't fetch reports for your state at this time. Please try again later.");
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReports();
    }, [currentUser.state]);

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center py-20 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
                <p className="mt-4 font-semibold text-text">Searching for reports in {currentUser.state}...</p>
            </div>
        );
    }

    if (error) {
        return <div className="text-center p-8 bg-card rounded-lg shadow-lg text-red-600">{error}</div>;
    }

    if (!reportData || (!reportData.summary && reportData.sources.length === 0)) {
        return (
            <div className="text-center p-8 bg-card rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-text">No Specific Reports Found</h3>
                <p className="text-text-secondary mt-2">We couldn't find a summary or specific reports for {currentUser.state} at this moment.</p>
            </div>
        );
    }

    return (
        <div className="bg-card p-6 rounded-lg shadow-lg">
            {reportData.summary && (
                <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none mb-8">
                    <p className="whitespace-pre-wrap font-sans leading-relaxed">{reportData.summary}</p>
                </div>
            )}
            {reportData.sources.length > 0 && (
                <div>
                    <h4 className="text-lg font-bold text-text mb-4 border-t border-border pt-6 flex items-center">
                        <DocumentTextIcon className="h-5 w-5 mr-2" />
                        Sources
                    </h4>
                    <ul className="list-disc list-inside space-y-2">
                        {reportData.sources.map((source, index) => (
                            <li key={`${source.uri}-${index}`} className="text-text-secondary">
                                <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
                                    {source.title || 'Untitled Source'}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};