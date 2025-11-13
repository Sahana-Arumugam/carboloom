import React, { useState } from 'react';
import { User } from '../types';
import { TargetIcon } from './icons/TargetIcon';
import { EditIcon } from './icons/EditIcon';

interface GoalProgressCardProps {
    currentUser: User;
    monthlyFootprint: number;
    onGoalUpdate: (goal: number) => void;
}

const GoalSetterModal: React.FC<{ currentGoal?: number; onSave: (goal: number) => void; onClose: () => void; }> = ({ currentGoal, onSave, onClose }) => {
    const [goal, setGoal] = useState(currentGoal || 50);

    const handleSave = () => {
        if (goal > 0) {
            onSave(goal);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-card rounded-lg shadow-xl p-6 w-full max-w-sm">
                <h3 className="text-xl font-bold text-text mb-4">Set Your Monthly Goal</h3>
                <p className="text-sm text-text-secondary mb-4">Set a target for your total monthly carbon footprint (in kg CO2e). A typical goal for a conscious individual might be 50-100 kg.</p>
                <input
                    type="number"
                    value={goal}
                    onChange={(e) => setGoal(Number(e.target.value))}
                    className="w-full p-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-text"
                    placeholder="e.g., 50"
                    aria-label="Monthly carbon footprint goal in kg"
                />
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="py-2 px-4 font-semibold text-text-secondary rounded-md hover:bg-border transition-colors">Cancel</button>
                    <button onClick={handleSave} className="py-2 px-5 font-bold text-white bg-primary rounded-md hover:bg-primary-dark transition-colors">Save Goal</button>
                </div>
            </div>
        </div>
    );
};


export const GoalProgressCard: React.FC<GoalProgressCardProps> = ({ currentUser, monthlyFootprint, onGoalUpdate }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const goal = currentUser.monthlyGoal;

    const handleSaveGoal = (newGoal: number) => {
        onGoalUpdate(newGoal);
        setIsModalOpen(false);
    }

    if (!goal) {
        return (
            <>
                {isModalOpen && <GoalSetterModal onSave={handleSaveGoal} onClose={() => setIsModalOpen(false)} />}
                <div className="bg-card p-6 rounded-lg shadow-lg text-center">
                    <TargetIcon className="h-10 w-10 mx-auto text-primary mb-3" />
                    <h3 className="text-xl font-bold text-text mb-2">Track Your Progress</h3>
                    <p className="text-text-secondary mb-4">Set a monthly carbon footprint goal to stay motivated on your eco journey.</p>
                    <button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-5 rounded-full transition-transform transform hover:scale-105 duration-300">
                        Set a Goal
                    </button>
                </div>
            </>
        );
    }

    const progressPercentage = Math.min((monthlyFootprint / goal) * 100, 100);
    const isOverBudget = monthlyFootprint > goal;

    return (
        <>
            {isModalOpen && <GoalSetterModal currentGoal={goal} onSave={handleSaveGoal} onClose={() => setIsModalOpen(false)} />}
            <div className="bg-card p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="text-xl font-bold text-text flex items-center"><TargetIcon className="h-6 w-6 mr-2 text-primary" /> Monthly Goal</h3>
                        <p className={`text-sm font-semibold ${isOverBudget ? 'text-red-500' : 'text-text-secondary'}`}>
                            {isOverBudget ? 'You are over your monthly budget!' : `You've used ${progressPercentage.toFixed(0)}% of your budget.`}
                        </p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center text-sm font-semibold text-primary hover:text-primary-dark p-1" aria-label="Edit goal">
                        <EditIcon className="h-4 w-4 mr-1" />
                        Edit
                    </button>
                </div>

                <div className="w-full bg-border rounded-full h-4 mb-2" role="progressbar" aria-valuenow={monthlyFootprint} aria-valuemin={0} aria-valuemax={goal}>
                    <div
                        className={`h-4 rounded-full transition-all duration-500 ${isOverBudget ? 'bg-red-500' : 'bg-primary'}`}
                        style={{ width: `${isOverBudget ? '100' : progressPercentage}%` }}>
                    </div>
                </div>
                <div className="flex justify-between text-sm font-bold">
                    <span className={isOverBudget ? 'text-red-600' : 'text-text'}>{monthlyFootprint.toFixed(1)} kg</span>
                    <span className="text-text-secondary">{goal} kg</span>
                </div>
            </div>
        </>
    );
};