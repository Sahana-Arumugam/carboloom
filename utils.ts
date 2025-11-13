import { LogEntry, Period, DailyHabits, FootprintData, HistoricalDataPoint, TransportMode } from './types';
import { EMISSION_FACTORS, getShoppingFootprint, getElectronicsFootprint, getHomeFootprint, getFoodFootprint } from './constants';

// --- Data Aggregation & Calculation Helpers ---

export const calculateFootprint = (habits: DailyHabits | null, emissionFactor: number): FootprintData | null => {
    if (!habits) return null;
    
    const travelFootprint = habits.travel.reduce((total, trip) => {
      if (typeof trip.emissions === 'number') {
          return total + trip.emissions;
      }
      // Fallback for old data or if emissions weren't calculated
      const factor = EMISSION_FACTORS.travel[trip.mode as TransportMode] || 0;
      return total + (trip.distance * factor);
    }, 0);
    
    const shoppingFootprint = habits.shopping.reduce((total, item) => {
        return total + getShoppingFootprint(item);
    }, 0);

    const electronicsFootprint = habits.electronics.reduce((total, item) => {
        return total + getElectronicsFootprint(item);
    }, 0);

    const homeFootprint = habits.home.reduce((total, item) => {
        return total + getHomeFootprint(item, emissionFactor);
    }, 0);

    const foodFootprint = habits.food.reduce((total, item) => {
        return total + getFoodFootprint(item);
    }, 0);

    const totalFootprint = travelFootprint + shoppingFootprint + electronicsFootprint + homeFootprint + foodFootprint;
    
    return {
      breakdown: {
        travel: parseFloat(travelFootprint.toFixed(2)),
        shopping: parseFloat(shoppingFootprint.toFixed(2)),
        electronics: parseFloat(electronicsFootprint.toFixed(2)),
        home: parseFloat(homeFootprint.toFixed(2)),
        food: parseFloat(foodFootprint.toFixed(2)),
      },
      total: parseFloat(totalFootprint.toFixed(2)),
    };
}

const getStartDateForPeriod = (period: Period, today: Date): Date => {
    const startDate = new Date(today);
    switch (period) {
        case Period.Daily:
            // Handled by filtering for today's date string directly
            return startDate;
        case Period.Weekly:
            startDate.setDate(today.getDate() - 6); // Last 7 days including today
            return startDate;
        case Period.Monthly:
            startDate.setDate(today.getDate() - 29); // Last 30 days including today
            return startDate;
        default:
            return today;
    }
};

export const aggregateHabitsForPeriod = (logEntries: LogEntry[], period: Period): DailyHabits | null => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    
    let filteredEntries: LogEntry[];

    if (period === Period.Daily) {
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        const todayString = `${year}-${month}-${day}`;
        filteredEntries = logEntries.filter(entry => entry.date === todayString);
    } else {
        const startDate = getStartDateForPeriod(period, today);
        filteredEntries = logEntries.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate >= startDate && entryDate <= today;
        });
    }

    if (filteredEntries.length === 0) {
        return null;
    }

    const initialHabits: DailyHabits = {
        travel: [],
        shopping: [],
        electronics: [],
        home: [],
        food: [],
    };

    return filteredEntries.reduce((acc, entry) => {
        acc.travel = acc.travel.concat(entry.habits.travel);
        acc.shopping = acc.shopping.concat(entry.habits.shopping);
        acc.electronics = acc.electronics.concat(entry.habits.electronics);
        acc.home = acc.home.concat(entry.habits.home);
        acc.food = acc.food.concat(entry.habits.food);
        return acc;
    }, initialHabits);
};

export const getWeeklyDaywiseData = (logEntries: LogEntry[], emissionFactor: number): HistoricalDataPoint[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weeklyData: HistoricalDataPoint[] = [];
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        const dayOfWeek = dayLabels[date.getDay()];

        const entryForDay = logEntries.find(entry => entry.date === dateString);
        let totalFootprint = 0;
        if (entryForDay) {
            const footprint = calculateFootprint(entryForDay.habits, emissionFactor);
            if (footprint) {
                totalFootprint = footprint.total;
            }
        }
        
        weeklyData.push({ label: `${dayOfWeek}`, value: totalFootprint });
    }
    return weeklyData;
};

export const getMonthlyWeekwiseData = (logEntries: LogEntry[], emissionFactor: number): HistoricalDataPoint[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weeklyTotals = [0, 0, 0, 0]; // Index 0: 22-28 days ago, ... Index 3: last 7 days

    for (const entry of logEntries) {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        const diffTime = today.getTime() - entryDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays >= 0 && diffDays < 28) {
            const footprint = calculateFootprint(entry.habits, emissionFactor);
            if (footprint) {
                if (diffDays < 7) weeklyTotals[3] += footprint.total;       // Last 7 days
                else if (diffDays < 14) weeklyTotals[2] += footprint.total; // 8-14 days ago
                else if (diffDays < 21) weeklyTotals[1] += footprint.total; // 15-21 days ago
                else weeklyTotals[0] += footprint.total;                    // 22-28 days ago
            }
        }
    }

    const weekLabels = ['Week 1', 'Week 2', 'Week 3', 'This Week'];
    return weekLabels.map((label, index) => ({
        label,
        value: parseFloat(weeklyTotals[index].toFixed(2)),
    }));
};

export const daysBetween = (dateStr1: string, dateStr2: string): number => {
    const d1 = new Date(dateStr1);
    const d2 = new Date(dateStr2);
    // Discard time and time-zone information for accurate day difference.
    const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
    const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());

    return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
}