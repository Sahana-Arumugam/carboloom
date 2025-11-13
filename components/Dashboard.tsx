import React, { useEffect, useState } from 'react';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LineChart, Line, ReferenceLine, Label } from 'recharts';
import { FootprintData, Period, CommunityData, HistoricalDataPoint, AgeGroup, GamificationData, User, Country, Challenge } from '../types';
import { Achievements } from './Achievements';
import { Challenges } from './Challenges';
import { GoalProgressCard } from './GoalProgressCard';

interface DashboardProps {
  currentUser: User;
  onUserUpdate: (updatedFields: Partial<User>) => void;
  footprintData: FootprintData | null;
  monthlyFootprintData: FootprintData | null;
  onLogDataClick: () => void;
  period: Period;
  setPeriod: (period: Period) => void;
  hasLogs: boolean;
  communityData: CommunityData | null;
  weeklyDaywiseData: HistoricalDataPoint[];
  monthlyWeekwiseData: HistoricalDataPoint[];
  filterAgeGroup: AgeGroup | '';
  setFilterAgeGroup: (ageGroup: AgeGroup | '') => void;
  gamificationData: GamificationData;
  onCustomChallengeUpdate: (challenge: Challenge, value: number) => void;
}

// Unified color scheme for better visual consistency
const COLORS = {
  total: 'var(--color-primary)',
  travel: '#2563EB',      // Blue-600
  shopping: '#9333EA',     // Purple-600
  electronics: '#F97316',  // Orange-500
  home: '#F59E0B',         // Amber-500
  food: '#10B981',         // Emerald-500
  peer: '#9CA3AF'         // Gray-400
};

const GOAL_COLOR = '#D32F2F'; // A distinct red for visibility of the goal line


const WelcomeMessage: React.FC<{ onLogDataClick: () => void }> = ({ onLogDataClick }) => (
  <div className="text-center p-8 bg-card rounded-lg shadow-lg">
    <h2 className="text-2xl font-bold text-primary-dark mb-4">Welcome to CarboLoom!</h2>
    <p className="mb-6 text-text-secondary">
      Ready to make a difference? Start by weaving your daily thread to see your impact pattern and join the challenge.
    </p>
    <button
      onClick={onLogDataClick}
      className="bg-primary hover:opacity-90 text-white font-bold py-3 px-6 rounded-full transition-transform transform hover:scale-105 duration-300 shadow-md"
    >
      Weave Your First Thread
    </button>
  </div>
);

const NoDataMessage: React.FC<{ period: Period, onLogDataClick: () => void }> = ({ period, onLogDataClick }) => (
    <div className="text-center p-8 bg-card rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-primary-dark mb-4">No Data For This Period</h2>
        <p className="text-text-secondary mb-6">
            You haven't woven any threads for the selected <span className="font-semibold">{period.toLowerCase()}</span> period. Weave today's thread to see your progress here.
        </p>
        <button
          onClick={onLogDataClick}
          className="bg-primary-light hover:bg-primary text-white font-bold py-2 px-5 rounded-full transition-transform transform hover:scale-105 duration-300"
        >
          Weave Today's Thread
        </button>
    </div>
);


const FootprintCard: React.FC<{ title: string; value: number; unit: string; color: string }> = ({ title, value, unit, color }) => (
    <div className={`p-4 rounded-lg shadow-md bg-card border-l-4`} style={{ borderColor: color }}>
        <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
        <p className="text-2xl font-bold text-text">{value} <span className="text-base font-normal">{unit}</span></p>
    </div>
);

const PeriodSelector: React.FC<{ selectedPeriod: Period; onSelect: (period: Period) => void }> = ({ selectedPeriod, onSelect }) => (
    <div className="flex justify-center bg-background rounded-full p-1 mb-6">
        {(Object.keys(Period) as Array<keyof typeof Period>).map((key) => (
            <button
                key={key}
                onClick={() => onSelect(Period[key])}
                className={`w-full px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${selectedPeriod === Period[key] ? 'bg-primary text-white shadow' : 'text-text-secondary hover:bg-border'}`}
            >
                {Period[key].charAt(0) + Period[key].slice(1).toLowerCase()}
            </button>
        ))}
    </div>
);

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  // No label for zero-percent slices
  if (percent === 0) {
    return null;
  }
  // Special case for 100% to center it
  if (percent === 1) {
    return (
      <text x={cx} y={cy} fill="white" textAnchor="middle" dominantBaseline="central" className="font-bold text-lg">
        100%
      </text>
    );
  }

  const isSmallSlice = percent < 0.15; // Define threshold for small slices

  // Position for the label text
  const labelRadius = isSmallSlice 
    ? outerRadius + 20 // Place label outside for small slices
    : innerRadius + (outerRadius - innerRadius) * 0.5; // Place label inside for larger slices

  const x = cx + labelRadius * Math.cos(-midAngle * RADIAN);
  const y = cy + labelRadius * Math.sin(-midAngle * RADIAN);

  if (isSmallSlice) {
      const textAnchor = x > cx ? 'start' : 'end';
      const lineStartX = cx + outerRadius * Math.cos(-midAngle * RADIAN);
      const lineStartY = cy + outerRadius * Math.sin(-midAngle * RADIAN);
      return (
          <g>
              <path 
                  d={`M${lineStartX},${lineStartY}L${x},${y}`} 
                  stroke={'var(--color-text-secondary)'}
                  fill="none" 
              />
              <text
                  x={x}
                  y={y}
                  fill={'var(--color-text)'}
                  textAnchor={textAnchor}
                  dominantBaseline="central"
                  className="font-bold text-sm"
              >
                  {`${(percent * 100).toFixed(0)}%`}
              </text>
          </g>
      );
  }

  return (
    <text
        x={x}
        y={y}
        fill={'white'}
        textAnchor={'middle'}
        dominantBaseline="central"
        className="font-bold text-sm"
    >
        {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


// Dedicated component for community filter controls for better organization and state management.
const CommunityFilters: React.FC<{
  filterAgeGroup: AgeGroup | '';
  setFilterAgeGroup: (ageGroup: AgeGroup | '') => void;
}> = ({
  filterAgeGroup, setFilterAgeGroup,
}) => {
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 mb-4">
      {/* Age Group Selector */}
      <select 
          value={filterAgeGroup} 
          onChange={(e) => setFilterAgeGroup(e.target.value as AgeGroup | '')} 
          className="w-full sm:w-auto text-sm px-3 py-2 border rounded-md bg-background border-border focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Filter by age group"
      >
          <option value="">All Ages</option>
          {Object.values(AgeGroup).map(age => <option key={age} value={age}>{age}</option>)}
      </select>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const value = payload[0].value;
        
        return (
          <div className="bg-card p-2.5 border border-border rounded-md shadow-lg text-text">
            <p className="font-bold">{`${label}`}</p>
            <p className="text-sm">{`Impact: ${Number(value).toFixed(2)} kg CO2e`}</p>
            {data.name === 'Community Average' && data.userCount > 0 && (
              <p className="text-xs text-text-secondary mt-1">{`Based on ${data.userCount} user(s)`}</p>
            )}
          </div>
        );
    }
    return null;
};


export const Dashboard: React.FC<DashboardProps> = ({ currentUser, onUserUpdate, footprintData, monthlyFootprintData, onLogDataClick, period, setPeriod, hasLogs, communityData, weeklyDaywiseData, monthlyWeekwiseData, filterAgeGroup, setFilterAgeGroup, gamificationData, onCustomChallengeUpdate }) => {

  if (!hasLogs) {
    return <WelcomeMessage onLogDataClick={onLogDataClick} />;
  }
  
  const handleGoalUpdate = (goal: number) => {
    onUserUpdate({ monthlyGoal: goal });
  };

  const renderDashboardContent = () => {
    if (!footprintData) {
        return <NoDataMessage period={period} onLogDataClick={onLogDataClick} />;
    }

    const breakdownData = [
        { name: 'Travel', value: footprintData.breakdown.travel, color: COLORS.travel },
        { name: 'Shopping', value: footprintData.breakdown.shopping, color: COLORS.shopping },
        { name: 'Electronics', value: footprintData.breakdown.electronics, color: COLORS.electronics },
        { name: 'Home & Energy', value: footprintData.breakdown.home, color: COLORS.home },
        { name: 'Food & Diet', value: footprintData.breakdown.food, color: COLORS.food },
    ].filter(d => d.value > 0);

    const comparisonData = [
        { name: 'Your Impact', value: footprintData.total, color: COLORS.total },
        { name: 'Community Average', value: communityData ? communityData.average : 0, color: COLORS.peer, userCount: communityData?.userCount || 0 },
    ];

    const getComparisonSubtitle = () => {
        let text = `Based on ${communityData?.userCount || 0} user(s) in India`;
        if (filterAgeGroup) {
            text += ` in the ${filterAgeGroup} age group`;
        }
        return text;
    };

    const goal = currentUser.monthlyGoal;
    let periodGoal: number | undefined = undefined;

    // Calculate the equivalent goal for the selected period (Daily, Weekly, Monthly)
    if (goal) {
        switch (period) {
            case Period.Daily:
                periodGoal = goal / 30;
                break;
            case Period.Weekly:
                periodGoal = goal / (30 / 7);
                break;
            case Period.Monthly:
                periodGoal = goal;
                break;
        }
    }


    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <FootprintCard title={`Total ${period} Impact`} value={footprintData.total} unit="kg CO2e" color={COLORS.total} />
                <FootprintCard title="Travel" value={footprintData.breakdown.travel} unit="kg CO2e" color={COLORS.travel} />
                <FootprintCard title="Shopping" value={footprintData.breakdown.shopping} unit="kg CO2e" color={COLORS.shopping} />
                <FootprintCard title="Electronics" value={footprintData.breakdown.electronics} unit="kg CO2e" color={COLORS.electronics} />
                <FootprintCard title="Home & Energy" value={footprintData.breakdown.home} unit="kg CO2e" color={COLORS.home} />
                <FootprintCard title="Food & Diet" value={footprintData.breakdown.food} unit="kg CO2e" color={COLORS.food} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-card p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-text mb-4 text-center">Impact Breakdown</h3>
                {breakdownData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={breakdownData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                innerRadius={80}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                            >
                                {breakdownData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip 
                                formatter={(value: number) => `${value.toFixed(2)} kg CO2e`}
                                contentStyle={{ 
                                  backgroundColor: 'var(--color-card)', 
                                  border: '1px solid var(--color-border)',
                                  color: 'var(--color-text)'
                                }}
                            />
                            <Legend wrapperStyle={{ color: 'var(--color-text-secondary)' }} />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-[300px] text-text-secondary">
                        <p>Log activities in this period to see your breakdown.</p>
                    </div>
                )}
                </div>
                
                <div className="bg-card p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-text mb-4 text-center">The Shared Fabric</h3>
                    <CommunityFilters
                        filterAgeGroup={filterAgeGroup}
                        setFilterAgeGroup={setFilterAgeGroup}
                    />
                    <p className="text-center text-xs text-text-secondary mb-2">{getComparisonSubtitle()}</p>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={comparisonData} margin={{ top: 20, right: 30, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={'var(--color-border)'} />
                        <XAxis dataKey="name" tick={{ fill: 'var(--color-text-secondary)' }} />
                        <YAxis tick={{ fill: 'var(--color-text-secondary)' }} />
                        <Tooltip 
                            content={<CustomTooltip />} 
                            cursor={{fill: 'rgba(128, 128, 128, 0.1)'}}
                        />
                        <Bar dataKey="value" name="kg CO2e">
                            {comparisonData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                         {periodGoal !== undefined && (
                            <ReferenceLine y={periodGoal} stroke={GOAL_COLOR} strokeDasharray="3 3">
                                <Label value="Your Goal" position="insideTopRight" fill={GOAL_COLOR} />
                            </ReferenceLine>
                        )}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-text mb-4 text-center">
                    Weekly Trend (Last 7 Days)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weeklyDaywiseData} margin={{ top: 5, right: 20, bottom: 5, left: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={'var(--color-border)'} />
                        <XAxis dataKey="label" tick={{ fill: 'var(--color-text-secondary)' }} />
                        <YAxis tick={{ fill: 'var(--color-text-secondary)' }} tickFormatter={(value) => `${value}kg`} />
                        <Tooltip 
                            formatter={(value: number) => `${value.toFixed(2)} kg CO2e`} 
                            contentStyle={{ 
                              backgroundColor: 'var(--color-card)', 
                              border: '1px solid var(--color-border)',
                              color: 'var(--color-text)'
                            }}
                        />
                        <Legend wrapperStyle={{ color: 'var(--color-text-secondary)' }} />
                        <Line type="monotone" dataKey="value" name="Impact" stroke={COLORS.total} strokeWidth={2} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {monthlyWeekwiseData.length > 0 && (
              <div className="bg-card p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-bold text-text mb-4 text-center">
                      Monthly Trend (Last 4 Weeks)
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={monthlyWeekwiseData} margin={{ top: 5, right: 20, bottom: 5, left: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke={'var(--color-border)'} />
                          <XAxis dataKey="label" tick={{ fill: 'var(--color-text-secondary)' }} />
                          <YAxis tick={{ fill: 'var(--color-text-secondary)' }} tickFormatter={(value) => `${value}kg`}/>
                          <Tooltip 
                              formatter={(value: number) => `${value.toFixed(2)} kg CO2e`} 
                              contentStyle={{ 
                                backgroundColor: 'var(--color-card)', 
                                border: '1px solid var(--color-border)',
                                color: 'var(--color-text)'
                              }}
                          />
                          <Legend wrapperStyle={{ color: 'var(--color-text-secondary)' }} />
                          <Line type="monotone" dataKey="value" name="Impact" stroke={COLORS.total} strokeWidth={2} activeDot={{ r: 8 }} />
                      </LineChart>
                  </ResponsiveContainer>
              </div>
            )}
        </div>
    );
  };


  return (
    <div className="space-y-8">
      <PeriodSelector selectedPeriod={period} onSelect={setPeriod} />
      <GoalProgressCard 
        currentUser={currentUser}
        monthlyFootprint={monthlyFootprintData?.total || 0}
        onGoalUpdate={handleGoalUpdate}
      />
      {renderDashboardContent()}
      <Challenges 
        gamificationData={gamificationData} 
        currentUser={currentUser}
        onCustomChallengeUpdate={onCustomChallengeUpdate}
      />
      <Achievements gamificationData={gamificationData} />
    </div>
  );
};
