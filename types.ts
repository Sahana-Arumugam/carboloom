// FIX: Removed a self-import of 'QuizQuestion' which was causing a conflict. The interface is defined within this file.

export enum Section {
    Tapestry = 'TAPESTRY',
    LogThread = 'LOG THREAD',
    Patterns = 'PATTERNS',
    Learn = 'LEARN',
    Profile = 'PROFILE',
}

export enum Period {
    Daily = 'DAILY',
    Weekly = 'WEEKLY',
    Monthly = 'MONTHLY',
}

export enum TransportMode {
    Walking = 'WALKING',
    Bicycle = 'BICYCLE',
    Bus = 'BUS',
    Metro = 'METRO',
    Train = 'TRAIN',
    Motorcycle = 'MOTORCYCLE',
    AutoRickshaw = 'AUTO_RICKSHAW',
    Cab = 'CAB',
}

export enum AgeGroup {
    '18-24' = '18-24',
    '25-34' = '25-34',
    '35-44' = '35-44',
    '45+' = '45+'
}

export enum Country {
    'India' = 'India',
}

// FIX: Add IndianState enum to support state-specific features.
export enum IndianState {
    'Andaman and Nicobar Islands' = 'Andaman and Nicobar Islands',
    'Andhra Pradesh' = 'Andhra Pradesh',
    'Arunachal Pradesh' = 'Arunachal Pradesh',
    'Assam' = 'Assam',
    'Bihar' = 'Bihar',
    'Chandigarh' = 'Chandigarh',
    'Chhattisgarh' = 'Chhattisgarh',
    'Dadra and Nagar Haveli and Daman and Diu' = 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi' = 'Delhi',
    'Goa' = 'Goa',
    'Gujarat' = 'Gujarat',
    'Haryana' = 'Haryana',
    'Himachal Pradesh' = 'Himachal Pradesh',
    'Jammu and Kashmir' = 'Jammu and Kashmir',
    'Jharkhand' = 'Jharkhand',
    'Karnataka' = 'Karnataka',
    'Kerala' = 'Kerala',
    'Ladakh' = 'Ladakh',
    'Lakshadweep' = 'Lakshadweep',
    'Madhya Pradesh' = 'Madhya Pradesh',
    'Maharashtra' = 'Maharashtra',
    'Manipur' = 'Manipur',
    'Meghalaya' = 'Meghalaya',
    'Mizoram' = 'Mizoram',
    'Nagaland' = 'Nagaland',
    'Odisha' = 'Odisha',
    'Puducherry' = 'Puducherry',
    'Punjab' = 'Punjab',
    'Rajasthan' = 'Rajasthan',
    'Sikkim' = 'Sikkim',
    'Tamil Nadu' = 'Tamil Nadu',
    'Telangana' = 'Telangana',
    'Tripura' = 'Tripura',
    'Uttar Pradesh' = 'Uttar Pradesh',
    'Uttarakhand' = 'Uttarakhand',
    'West Bengal' = 'West Bengal'
}

export interface User {
    id: string;
    username: string;
    ageGroup?: AgeGroup;
    country?: Country;
    // FIX: Add optional state property to User to resolve type error in StateCarbonReport.
    state?: IndianState;
    monthlyGoal?: number;
}

export interface TravelEntry {
    distance: number; // km
    mode: TransportMode;
    emissions?: number; // kg CO2e
}

export interface ShoppingItem {
    category: string;
    type: string;
    item: string;
    material: string;
}

export interface ElectronicsItem {
    category: string;
    item: string;
}

export interface HomeApplianceUsage {
    name: string;
    hours: number;
    quantity: number;
}

export interface FoodEntry {
    category: 'Red Meat' | 'Poultry' | 'Fish' | 'Dairy' | 'Plant-based Protein';
    servings: number;
}

export interface DailyHabits {
    travel: TravelEntry[];
    shopping: ShoppingItem[];
    electronics: ElectronicsItem[];
    home: HomeApplianceUsage[];
    food: FoodEntry[];
}

export interface LogEntry {
    date: string; // YYYY-MM-DD
    habits: DailyHabits;
}

export interface FootprintData {
    breakdown: {
        travel: number;
        shopping: number;
        electronics: number;
        home: number;
        food: number;
    };
    total: number; // in kg CO2e
}

export interface CommunityData {
    average: number;
    userCount: number;
}

export interface EcoSuggestion {
    title: string;
    description: string;
}

export interface HistoricalDataPoint {
    label: string;
    value: number;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string; // emoji or identifier
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  icon: string;
  goal: number;
  unit: string; // 'days', 'km', etc.
  type: 'daily' | 'streak';
  reward: number; // points awarded
  isCustom?: boolean;
}

export interface UserChallengeState {
  progress: number; // e.g., 2 days in a streak, 5km commuted
  lastUpdated: string; // date string 'YYYY-MM-DD'
  rewardedGoal: number; // to track which goal level was last rewarded
}

export interface QuizProgress {
  currentQuestionIndex: number;
  selectedAnswers: Record<string, number>; // questionId -> selectedOptionIndex
  shuffledQuestions: QuizQuestion[]; // Store the shuffled order of questions and answers
}

export interface UserQuizState {
    attempts: number;
    highestScore: number;
    totalQuestions: number;
    lastAttempted: string; // date string 'YYYY-MM-DD'
    progress?: QuizProgress; // For resuming in-progress quizzes
}

export interface GamificationData {
    points: number;
    badges: Badge[];
    challengeStates: Record<string, UserChallengeState>; // Keyed by challenge ID
    quizStates: Record<string, UserQuizState>; // Keyed by quiz ID
}

// Educational Content Types
export type ContentCategory = 'Food' | 'Travel' | 'Home' | 'Shopping' | 'Waste';

export interface EducationalContent {
  id: string;
  category: ContentCategory;
  title: string;
  summary: string;
  imageUrl: string;
  sourceName: string; 
  sourceUrl: string; // Link to the original article
}

// Types for Grounded (Google Search) API responses
export interface GroundedSource {
  title: string;
  uri: string;
}

export interface GroundedResponse {
    summary: string;
    sources: GroundedSource[];
}


// Quiz Types
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string; // Explanation for the correct answer
}

export interface Quiz {
  id:string;
  title: string;
  description: string;
  category: ContentCategory;
  questions: QuizQuestion[];
  reward: {
    points: number;
    badgeId?: string;
  };
}

// Curated Web Resources
export interface EcoResource {
    title: string;
    description: string;
    url: string;
}

// Habit Discovery Types
export interface Habit {
  description: string;
  co2Reduction: string;
  commitment: 'Low' | 'Medium' | 'High';
}

// Chatbot Types
export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}