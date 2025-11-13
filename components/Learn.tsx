import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { ContentCategory, Quiz, GamificationData, UserQuizState, QuizQuestion, QuizProgress, User, GroundedResponse } from '../types';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { LightBulbIcon } from './icons/LightBulbIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { getLatestSustainabilityNews } from '../services/geminiService';
import { RefreshIcon } from './icons/RefreshIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { LinkIcon } from './icons/LinkIcon';
import { EcoResources } from './EcoResources';
import { SuccessAnimation } from './SuccessAnimation';


interface LearnProps {
  currentUser: User;
  quizzes: Quiz[];
  gamificationData: GamificationData;
  onQuizComplete: (quiz: Quiz, score: number) => void;
  onSaveQuizProgress: (quizId: string, progress: QuizProgress) => void;
  onClearQuizProgressAndRestart: (quizId: string) => void;
}

// Helper function for shuffling arrays using the Fisher-Yates algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

interface QuizTakerProps {
  quiz: Quiz;
  initialState?: UserQuizState;
  onComplete: (score: number) => void;
  onSaveProgress: (progress: QuizProgress) => void;
  onClose: () => void;
}


const QuizTaker: React.FC<QuizTakerProps> = ({ quiz, initialState, onComplete, onSaveProgress, onClose }) => {
    const isCompletedRef = useRef(false);
    
    const [processedQuestions, setProcessedQuestions] = useState<QuizQuestion[]>(() => {
        if (initialState?.progress?.shuffledQuestions) {
            return initialState.progress.shuffledQuestions;
        }
        const questions = shuffleArray(quiz.questions);
        // FIX: Explicitly type 'question' as QuizQuestion to fix properties not being found on 'unknown' type.
        return questions.map((question: QuizQuestion) => {
            const correctAnswerValue = question.options[question.correctAnswerIndex];
            const shuffledOptions = shuffleArray(question.options);
            const newCorrectAnswerIndex = shuffledOptions.indexOf(correctAnswerValue);
            return { ...question, options: shuffledOptions, correctAnswerIndex: newCorrectAnswerIndex };
        });
    });
    
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => initialState?.progress?.currentQuestionIndex || 0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>(() => initialState?.progress?.selectedAnswers || {});
    const [showResults, setShowResults] = useState(false);
    const [revealAnswer, setRevealAnswer] = useState(false);

    const progressStateRef = useRef<QuizProgress | undefined>(undefined);

    useEffect(() => {
        progressStateRef.current = {
            currentQuestionIndex,
            selectedAnswers,
            shuffledQuestions: processedQuestions,
        };
    });

    useEffect(() => {
        return () => {
            if (!isCompletedRef.current && progressStateRef.current) {
                onSaveProgress(progressStateRef.current);
            }
        };
    }, [onSaveProgress]);


    if (processedQuestions.length === 0) return null;
    
    const currentQuestion = processedQuestions[currentQuestionIndex];
    const userSelection = selectedAnswers[currentQuestion.id];

    const handleAnswerSelect = (optionIndex: number) => {
        if (revealAnswer) return;
        setSelectedAnswers(prev => ({ ...prev, [currentQuestion.id]: optionIndex }));
        setRevealAnswer(true);
    };

    const handleNext = () => {
        setRevealAnswer(false);
        if (currentQuestionIndex < processedQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            isCompletedRef.current = true;
            let score = 0;
            processedQuestions.forEach(q => {
                if(selectedAnswers[q.id] === q.correctAnswerIndex) {
                    score++;
                }
            });
            onComplete(score);
            setShowResults(true);
        }
    };
    
    if (showResults) {
        const score = Object.keys(selectedAnswers).reduce((correctCount, qId) => {
            const question = processedQuestions.find(q => q.id === qId);
            if (question && selectedAnswers[qId] === question.correctAnswerIndex) {
                return correctCount + 1;
            }
            return correctCount;
        }, 0);
        const totalQuestions = processedQuestions.length;
        
        return (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
                <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl text-center p-8">
                    <h2 className="text-3xl font-bold text-text mb-2">Quiz Complete!</h2>
                    <p className="text-lg text-text-secondary mb-4">You scored</p>
                    <p className="text-6xl font-bold text-primary mb-4">{score} / {totalQuestions}</p>
                    <div className="space-y-4 max-h-60 overflow-y-auto p-4 bg-background rounded-lg text-left">
                        {processedQuestions.map(q => {
                             const isCorrect = selectedAnswers[q.id] === q.correctAnswerIndex;
                             const userAnswer = q.options[selectedAnswers[q.id]];
                             const correctAnswer = q.options[q.correctAnswerIndex];
                             return (
                                <div key={q.id} className="border-b pb-3 mb-3 border-border last:border-b-0 last:pb-0 last:mb-0">
                                    <p className="font-semibold mb-2">{q.question}</p>
                                    <div className={`flex items-center p-2 rounded-md text-sm ${
                                        isCorrect 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                        {isCorrect ? <CheckCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" /> : <XCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />}
                                        <span>Your answer: {userAnswer}</span>
                                    </div>
                                    {!isCorrect && (
                                        <div className="flex items-center p-2 mt-1 rounded-md text-sm bg-green-100 text-green-800">
                                            <CheckCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                                            <span>Correct answer: {correctAnswer}</span>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                    <button onClick={onClose} className="mt-6 w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-full transition-transform transform hover:scale-105 duration-300">
                        Back to Learn Hub
                    </button>
                </div>
            </div>
        );
    }
    
    const progressPercentage = ((currentQuestionIndex + (revealAnswer ? 1 : 0)) / processedQuestions.length) * 100;

    return (
         <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-border">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-2xl font-bold text-text">{quiz.title}</h2>
                        <p className="text-sm font-semibold text-text-secondary">{currentQuestionIndex + 1} / {processedQuestions.length}</p>
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                </div>
                
                <div className="p-6 overflow-y-auto flex-grow">
                    <h3 className="text-xl font-semibold mb-6">{currentQuestion.question}</h3>
                    <div className="space-y-3">
                        {currentQuestion.options.map((option, index) => {
                            let buttonClass = 'border-border hover:bg-border';
                            const isSelected = userSelection === index;
                            const isCorrect = currentQuestion.correctAnswerIndex === index;

                            if (revealAnswer) {
                                if (isCorrect) {
                                    buttonClass = 'border-green-500 bg-green-100 text-green-800';
                                } else if (isSelected && !isCorrect) {
                                    buttonClass = 'border-red-500 bg-red-100 text-red-800';
                                } else {
                                    buttonClass = 'border-border opacity-60';
                                }
                            } else if (isSelected) {
                                buttonClass = 'border-primary bg-primary/10';
                            }
                            
                            return (
                                <button
                                    key={index}
                                    onClick={() => handleAnswerSelect(index)}
                                    disabled={revealAnswer}
                                    className={`w-full text-left p-4 border-2 rounded-lg font-semibold transition-colors duration-200 flex justify-between items-center ${buttonClass}`}
                                >
                                    <span>{option}</span>
                                     {revealAnswer && isCorrect && <CheckCircleIcon className="h-6 w-6 text-green-600" />}
                                     {revealAnswer && isSelected && !isCorrect && <XCircleIcon className="h-6 w-6 text-red-600" />}
                                </button>
                            );
                        })}
                    </div>
                     {revealAnswer && (
                        <div className="mt-4 p-3 bg-border rounded-lg">
                            <p className="text-sm font-semibold">Explanation:</p>
                            <p className="text-sm text-text-secondary">{currentQuestion.explanation}</p>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-border bg-background flex items-center justify-end">
                     <button 
                        onClick={handleNext}
                        disabled={!revealAnswer}
                        className="py-2 px-6 font-bold text-white bg-primary rounded-full hover:bg-primary-dark disabled:bg-border disabled:cursor-not-allowed transition-all transform hover:scale-105"
                    >
                        {currentQuestionIndex < processedQuestions.length - 1 ? 'Next' : 'Finish Quiz'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const QuizCard: React.FC<{ quiz: Quiz; onStart: () => void; onRestart: () => void; userState?: UserQuizState }> = ({ quiz, onStart, onRestart, userState }) => {
    const hasProgress = !!userState?.progress;
    const hasBeenAttempted = userState && userState.attempts > 0;

    let buttonText = "Start Quiz";
    let buttonAction = onStart;

    if (hasProgress) {
        buttonText = "Resume Quiz";
        buttonAction = onStart;
    } else if (hasBeenAttempted) {
        buttonText = "Try Again";
        buttonAction = onRestart;
    }

    return (
        <div className="bg-card rounded-lg shadow-lg overflow-hidden flex flex-col group transition-transform transform hover:-translate-y-1 p-6">
            <span className="text-sm font-semibold text-primary mb-1">{quiz.category}</span>
            <h3 className="text-lg font-bold text-text mb-2 flex-grow">{quiz.title}</h3>
            <p className="text-text-secondary text-sm mb-4">{quiz.description}</p>
            
            {hasBeenAttempted && !hasProgress ? (
                <div className="mt-auto text-center">
                    <div className="font-semibold text-green-600 p-2 rounded-md bg-green-50 mb-2">
                        <p>Highest Score: {userState.highestScore}/{userState.totalQuestions}</p>
                        <p className="text-xs text-text-secondary">({userState.attempts} attempt{userState.attempts > 1 ? 's' : ''})</p>
                    </div>
                    <button onClick={buttonAction} className="w-full bg-primary-light hover:bg-primary text-white font-semibold py-2 px-4 rounded-full transition duration-300">
                        {buttonText}
                    </button>
                </div>
            ) : (
                <button onClick={buttonAction} className="mt-auto w-full bg-primary-light hover:bg-primary text-white font-semibold py-2 px-4 rounded-full transition duration-300">
                    {buttonText}
                </button>
            )}
        </div>
    );
};


const CATEGORIES: ContentCategory[] = ['Food', 'Travel', 'Home', 'Shopping', 'Waste'];

export const Learn: React.FC<LearnProps> = ({ currentUser, quizzes, gamificationData, onQuizComplete, onSaveQuizProgress, onClearQuizProgressAndRestart }) => {
    const [learnMode, setLearnMode] = useState<'content' | 'quizzes' | 'resources'>('content');
    const [selectedCategory, setSelectedCategory] = useState<ContentCategory | 'All'>('All');
    const [newsData, setNewsData] = useState<GroundedResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
    const initialFetchPerformed = useRef(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const successTimeoutRef = useRef<number | null>(null);

    const fetchNews = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getLatestSustainabilityNews();
            setNewsData(data);
        } catch (e) {
            setError("Sorry, we couldn't fetch the latest news. Please try again later.");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (learnMode === 'content' && !initialFetchPerformed.current) {
            initialFetchPerformed.current = true;
            fetchNews();
        }
    }, [learnMode, fetchNews]);

    const triggerSuccess = () => {
        if (successTimeoutRef.current) {
            clearTimeout(successTimeoutRef.current);
        }
        setShowSuccess(true);
        successTimeoutRef.current = window.setTimeout(() => {
            setShowSuccess(false);
        }, 1500);
    };

    const handleQuizComplete = (score: number) => {
        if (activeQuiz) {
            onQuizComplete(activeQuiz, score);
            triggerSuccess();
        }
    };

    const handleCloseQuiz = () => {
        setActiveQuiz(null);
    };
    
    const handleQuizRestart = (quiz: Quiz) => {
        onClearQuizProgressAndRestart(quiz.id);
        setActiveQuiz(quiz);
    };
    
    const filteredQuizzes = useMemo(() => {
        if (selectedCategory === 'All') return quizzes;
        return quizzes.filter(q => q.category === selectedCategory);
    }, [quizzes, selectedCategory]);
    
    
    const renderContent = () => {
        if (learnMode === 'content') {
            if (isLoading) {
                 return (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
                    </div>
                );
            }
            if (error) {
                 return <div className="text-center p-8 bg-card rounded-lg shadow-lg text-red-600">{error}</div>;
            }
            if (!newsData || (!newsData.summary && newsData.sources.length === 0)) {
                return (
                    <div className="text-center p-8 bg-card rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold text-text">No News Found.</h3>
                        <p className="text-text-secondary mt-2">Try refreshing or check your connection.</p>
                    </div>
                );
            }
            return (
              <div className="bg-card p-6 rounded-lg shadow-lg">
                {newsData.summary && (
                    <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none mb-8">
                        <p className="whitespace-pre-wrap font-sans">{newsData.summary}</p>
                    </div>
                )}
                {newsData.sources.length > 0 && (
                    <div>
                        <h4 className="text-lg font-bold text-text mb-4 border-t border-border pt-4">Sources</h4>
                        <ul className="list-disc list-inside space-y-2">
                            {newsData.sources.map((source, index) => (
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
        }
        
        if (learnMode === 'quizzes') {
            return filteredQuizzes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredQuizzes.map(quiz => (
                        <QuizCard 
                            key={quiz.id} 
                            quiz={quiz} 
                            onStart={() => setActiveQuiz(quiz)}
                            onRestart={() => handleQuizRestart(quiz)}
                            userState={gamificationData.quizStates[quiz.id]}
                        />
                    ))}
                </div>
            ) : (
                 <div className="text-center p-8 bg-card rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-text">No quizzes found for "{selectedCategory}"</h3>
                </div>
            );
        }
        
        if (learnMode === 'resources') {
            return <EcoResources />;
        }

        return null;
    };

    return (
        <div className="max-w-7xl mx-auto">
             <SuccessAnimation show={showSuccess} />
             {activeQuiz && (
                <QuizTaker 
                    quiz={activeQuiz} 
                    initialState={gamificationData.quizStates[activeQuiz.id]}
                    onComplete={handleQuizComplete} 
                    onSaveProgress={(progress) => onSaveQuizProgress(activeQuiz.id, progress)}
                    onClose={handleCloseQuiz}
                />
            )}

             <div className="text-center mb-8 bg-card p-6 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-text mb-2">Learn & Grow</h2>
                 {learnMode === 'content' && (
                     <>
                        <p className="text-text-secondary mb-4">Discover the latest India-centric news and stories on sustainability.</p>
                        <button
                          onClick={() => fetchNews()}
                          disabled={isLoading}
                          className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-full transition-transform transform hover:scale-105 duration-300 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex items-center gap-2"
                        >
                          <RefreshIcon className="h-5 w-5" /> {isLoading ? 'Refreshing...' : 'Refresh News'}
                        </button>
                    </>
                 )}
                 {learnMode === 'quizzes' && (
                    <p className="text-text-secondary">Test your knowledge with quizzes on different sustainability topics.</p>
                 )}
                 {learnMode === 'resources' && (
                    <p className="text-text-secondary">Explore these curated web resources to learn more about climate change and sustainability.</p>
                 )}
             </div>

             <div className="mb-8 flex justify-center border-b-2 border-border">
                <button
                    onClick={() => setLearnMode('content')}
                    className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors duration-300 ${learnMode === 'content' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary hover:text-primary-dark'}`}
                >
                    <BookOpenIcon className="h-5 w-5" />
                    <span>Eco News</span>
                </button>
                 <button
                    onClick={() => setLearnMode('resources')}
                    className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors duration-300 ${learnMode === 'resources' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary hover:text-primary-dark'}`}
                >
                    <LinkIcon className="h-5 w-5" />
                    <span>Resources</span>
                </button>
                 <button
                    onClick={() => setLearnMode('quizzes')}
                    className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors duration-300 ${learnMode === 'quizzes' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary hover:text-primary-dark'}`}
                >
                    <LightBulbIcon className="h-5 w-5" />
                    <span>Quizzes</span>
                </button>
             </div>
             
             {learnMode === 'quizzes' && (
                <div className="mb-8 flex justify-center flex-wrap gap-2 bg-card rounded-full shadow-md p-2">
                    <button
                        onClick={() => setSelectedCategory('All')}
                        className={`px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-semibold transition-colors duration-300 ${selectedCategory === 'All' ? 'bg-primary text-white' : 'text-text-secondary hover:bg-primary-light/20'}`}
                    >
                        All
                    </button>
                    {CATEGORIES.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-semibold transition-colors duration-300 ${selectedCategory === category ? 'bg-primary text-white' : 'text-text-secondary hover:bg-primary-light/20'}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            )}

            {renderContent()}
        </div>
    );
};