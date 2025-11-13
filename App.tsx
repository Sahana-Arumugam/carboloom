import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { DataInputForm } from './components/DataInputForm';
import { Suggestions } from './components/Suggestions';
import { Learn } from './components/Learn';
import { DailyHabits, FootprintData, Section, LogEntry, Period, User, CommunityData, HistoricalDataPoint, AgeGroup, GamificationData, EducationalContent, Quiz, QuizProgress, Challenge } from './types';
import { aggregateHabitsForPeriod, calculateFootprint, getWeeklyDaywiseData, getMonthlyWeekwiseData } from './utils';
import { authService } from './services/authService';
import { gamificationService } from './services/gamificationService';
import { contentService } from './services/contentService';
import { stateThemes } from './themes/stateThemes';
import { Profile } from './components/Profile';
import { INDIA_GRID_EMISSION_FACTOR } from './constants';
import { Chatbot } from './components/Chatbot';
import { ChatIcon } from './components/icons/ChatIcon';


interface AppProps {
  currentUser: User;
  onLogout: () => void;
  onUserUpdate: (updatedFields: Partial<User>) => void;
}

const App: React.FC<AppProps> = ({ currentUser, onLogout, onUserUpdate }) => {
  const [activeSection, setActiveSection] = useState<Section>(Section.Tapestry);
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [gamificationData, setGamificationData] = useState<GamificationData>({ points: 0, badges: [], challengeStates: {}, quizStates: {} });
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [period, setPeriod] = useState<Period>(Period.Daily);
  const [filterAgeGroup, setFilterAgeGroup] = useState<AgeGroup | ''>('');
  const emissionFactor = INDIA_GRID_EMISSION_FACTOR;
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
  });

  // Combined effect for all theming (light/dark mode)
  useEffect(() => {
    const root = window.document.documentElement;

    // 1. Handle light/dark class on <html> element
    if (theme === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);

    // 2. Select the default theme config
    const themeConfig = stateThemes['Default'];
    
    // 3. Get the correct color palette (light or dark) from the config
    const currentPalette = themeConfig.colors[theme];

    // 4. Directly apply all color and pattern variables to the root element's style
    for (const [key, value] of Object.entries(currentPalette)) {
        root.style.setProperty(key, value as string);
    }
    root.style.setProperty('--pattern-background', themeConfig.backgroundPattern);

  }, [theme]);


  const handleThemeToggle = () => {
      setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };
  
  useEffect(() => {
    setLogEntries(authService.getLogsForUser(currentUser.id));
    setGamificationData(gamificationService.getGamificationDataForUser(currentUser.id));
    setQuizzes(contentService.getQuizzes());
  }, [currentUser]);

  const aggregatedHabits = useMemo<DailyHabits | null>(() => {
    return aggregateHabitsForPeriod(logEntries, period);
  }, [logEntries, period]);
  
  const weeklyAggregatedHabits = useMemo<DailyHabits | null>(() => {
    return aggregateHabitsForPeriod(logEntries, Period.Weekly);
  }, [logEntries]);

  const userFootprintData = useMemo<FootprintData | null>(() => {
    return calculateFootprint(aggregatedHabits, emissionFactor);
  }, [aggregatedHabits, emissionFactor]);

  const monthlyAggregatedHabits = useMemo<DailyHabits | null>(() => {
    return aggregateHabitsForPeriod(logEntries, Period.Monthly);
  }, [logEntries]);

  const monthlyFootprintData = useMemo<FootprintData | null>(() => {
      return calculateFootprint(monthlyAggregatedHabits, emissionFactor);
  }, [monthlyAggregatedHabits, emissionFactor]);

  const communityData = useMemo<CommunityData | null>(() => {
    const allLogs = authService.getAllLogs();
    const allUsers = authService.getAllUsers();
    
    const filteredUsers = allUsers.filter(user => {
        const ageMatch = !filterAgeGroup || user.ageGroup === filterAgeGroup;
        return ageMatch;
    });

    if (filteredUsers.length === 0) return { average: 0, userCount: 0 };
    
    let totalFootprint = 0;
    let usersWithLogsCount = 0;

    filteredUsers.forEach(user => {
        const userLogs = allLogs[user.id];
        if (userLogs && userLogs.length > 0) {
            const userAggregatedHabits = aggregateHabitsForPeriod(userLogs, period);
            const userFootprint = calculateFootprint(userAggregatedHabits, INDIA_GRID_EMISSION_FACTOR);
            if(userFootprint && userFootprint.total > 0) {
                totalFootprint += userFootprint.total;
                usersWithLogsCount++;
            }
        }
    });

    if (usersWithLogsCount === 0) return { average: 0, userCount: filteredUsers.length };
    
    return {
        average: parseFloat((totalFootprint / usersWithLogsCount).toFixed(2)),
        userCount: filteredUsers.length
    }
  }, [logEntries, period, currentUser.id, filterAgeGroup]);

  const weeklyDaywiseData = useMemo<HistoricalDataPoint[]>(() => {
    return getWeeklyDaywiseData(logEntries, emissionFactor);
  }, [logEntries, emissionFactor]);

  const monthlyWeekwiseData = useMemo<HistoricalDataPoint[]>(() => {
    return getMonthlyWeekwiseData(logEntries, emissionFactor);
  }, [logEntries, emissionFactor]);

  const handleDataSubmit = (newEntry: { date: string, habits: DailyHabits }) => {
    // Phase 1: Update the source of truth (localStorage)
    authService.saveLogForUser(currentUser.id, newEntry);

    // Phase 2: Read from the source of truth to update the application state
    const freshlyLoadedLogs = authService.getLogsForUser(currentUser.id);
    setLogEntries(freshlyLoadedLogs);
    
    const updatedGamificationData = gamificationService.processLogAndAward(currentUser.id, newEntry, freshlyLoadedLogs);
    setGamificationData(updatedGamificationData);

    setActiveSection(Section.Tapestry);
  };
  
  const handleQuizComplete = (quiz: Quiz, score: number) => {
    const updatedGamificationData = gamificationService.processQuizCompletion(currentUser.id, quiz, score);
    setGamificationData(updatedGamificationData);
  };

  const handleSaveQuizProgress = (quizId: string, progress: QuizProgress) => {
    const updatedGamificationData = gamificationService.saveQuizProgress(currentUser.id, quizId, progress);
    setGamificationData(updatedGamificationData);
  };

  const handleClearQuizProgressAndRestart = (quizId: string) => {
      const updatedGamificationData = gamificationService.clearQuizProgressAndRestart(currentUser.id, quizId);
      setGamificationData(updatedGamificationData);
  };

  const handleCustomChallengeUpdate = (challenge: Challenge, value: number) => {
    const today = new Date().toISOString().split('T')[0];
    const updatedGamificationData = gamificationService.processCustomChallengeUpdate(currentUser.id, challenge, today, value);
    setGamificationData(updatedGamificationData);
  };


  const renderSection = () => {
    switch (activeSection) {
      case Section.Tapestry:
        return <Dashboard 
                  currentUser={currentUser}
                  onUserUpdate={onUserUpdate}
                  footprintData={userFootprintData} 
                  monthlyFootprintData={monthlyFootprintData}
                  onLogDataClick={() => setActiveSection(Section.LogThread)}
                  period={period}
                  setPeriod={setPeriod}
                  hasLogs={logEntries.length > 0}
                  communityData={communityData}
                  weeklyDaywiseData={weeklyDaywiseData}
                  monthlyWeekwiseData={monthlyWeekwiseData}
                  filterAgeGroup={filterAgeGroup}
                  setFilterAgeGroup={setFilterAgeGroup}
                  gamificationData={gamificationData}
                  onCustomChallengeUpdate={handleCustomChallengeUpdate}
                />;
      case Section.LogThread:
        return <DataInputForm onSubmit={handleDataSubmit} logEntries={logEntries} />;
      case Section.Patterns:
        return <Suggestions currentUser={currentUser} weeklyHabits={weeklyAggregatedHabits} footprintData={userFootprintData} />;
      case Section.Learn:
        return <Learn 
                  currentUser={currentUser}
                  quizzes={quizzes} 
                  gamificationData={gamificationData} 
                  onQuizComplete={handleQuizComplete}
                  onSaveQuizProgress={handleSaveQuizProgress}
                  onClearQuizProgressAndRestart={handleClearQuizProgressAndRestart}
                />;
      case Section.Profile:
        return <Profile 
                  currentUser={currentUser} 
                  onUserUpdate={onUserUpdate} 
                  gamificationData={gamificationData} 
                />;
      default:
        return <Dashboard 
                  currentUser={currentUser}
                  onUserUpdate={onUserUpdate}
                  footprintData={userFootprintData} 
                  monthlyFootprintData={monthlyFootprintData}
                  onLogDataClick={() => setActiveSection(Section.LogThread)}
                  period={period}
                  setPeriod={setPeriod}
                  hasLogs={logEntries.length > 0}
                  communityData={communityData}
                  weeklyDaywiseData={weeklyDaywiseData}
                  monthlyWeekwiseData={monthlyWeekwiseData}
                  filterAgeGroup={filterAgeGroup}
                  setFilterAgeGroup={setFilterAgeGroup}
                  gamificationData={gamificationData}
                  onCustomChallengeUpdate={handleCustomChallengeUpdate}
                />;
    }
  };

  return (
    <div className={`min-h-screen font-sans text-text bg-background transition-colors duration-300 pb-16 md:pb-0`}>
      <Header 
        user={currentUser} 
        onLogout={onLogout} 
        gamificationData={gamificationData}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        onProfileClick={() => setActiveSection(Section.Profile)}
        onLogoClick={() => setActiveSection(Section.Tapestry)}
      />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {renderSection()}
        </div>
      </main>
      
      {/* Mobile Bottom Nav */}
       <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-sm shadow-[0_-2px_10px_rgba(0,0,0,0.1)] md:hidden z-40">
          <div className="flex justify-around">
            {(Object.keys(Section) as Array<keyof typeof Section>).map(key => (
              <button
                key={key}
                onClick={() => setActiveSection(Section[key])}
                className={`flex-1 py-3 text-sm font-semibold transition-colors duration-200 capitalize ${activeSection === Section[key] ? 'text-primary border-t-2 border-primary' : 'text-text-secondary'}`}
              >
                {Section[key].toLowerCase().replace('_', ' ')}
              </button>
            ))}
          </div>
        </nav>
      
      {/* Desktop Pill Nav */}
      <div className="hidden md:block sticky bottom-0 inset-x-0 pb-4 z-40">
        <nav className="max-w-md mx-auto bg-card/70 backdrop-blur-sm rounded-full shadow-lg p-2">
            <div className="flex justify-around">
                {(Object.keys(Section) as Array<keyof typeof Section>).map(key => (
                    <button
                        key={key}
                        onClick={() => setActiveSection(Section[key])}
                        className={`w-full px-3 py-2 text-sm font-semibold rounded-full transition-colors duration-200 capitalize ${activeSection === Section[key] ? 'bg-primary text-white shadow-md' : 'text-text-secondary hover:bg-border'}`}
                    >
                        {Section[key].toLowerCase().replace('_', ' ')}
                    </button>
                ))}
            </div>
        </nav>
      </div>

      {/* Chatbot and FAB */}
      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-24 right-4 md:bottom-8 md:right-8 bg-primary hover:bg-primary-dark text-white rounded-full p-4 shadow-lg transition-transform transform hover:scale-110 z-40"
          aria-label="Open AI Assistant"
        >
          <ChatIcon className="h-8 w-8" />
        </button>
      )}
    </div>
  );
};

export default App;