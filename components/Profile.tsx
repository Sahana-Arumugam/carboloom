import React, { useState, useEffect, useRef } from 'react';
// FIX: Import IndianState to use in the profile editing form.
import { User, GamificationData, AgeGroup, Country, IndianState } from '../types';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { StarIcon } from './icons/StarIcon';
import { TrophyIcon } from './icons/TrophyIcon';
import { EditIcon } from './icons/EditIcon';
import { SuccessAnimation } from './SuccessAnimation';

interface ProfileProps {
    currentUser: User;
    onUserUpdate: (updatedFields: Partial<User>) => void;
    gamificationData: GamificationData;
}

const StatCard: React.FC<{ icon: React.ReactNode; value: string | number; label: string; }> = ({ icon, value, label }) => (
    <div className="flex flex-col items-center justify-center p-4 bg-background rounded-lg shadow-inner text-center">
        <div className="text-primary mb-2">{icon}</div>
        <p className="text-2xl font-bold text-text">{value}</p>
        <p className="text-sm text-text-secondary">{label}</p>
    </div>
);

export const Profile: React.FC<ProfileProps> = ({ currentUser, onUserUpdate, gamificationData }) => {
    const [isEditing, setIsEditing] = useState(false);
    // FIX: Include 'state' in the editable user fields.
    const [editedUser, setEditedUser] = useState<Partial<User>>({
        ageGroup: currentUser.ageGroup,
        state: currentUser.state,
    });
    const [showSuccess, setShowSuccess] = useState(false);
    const successTimeoutRef = useRef<number | null>(null);

    // Reset editedUser state if currentUser changes (e.g., after save)
    useEffect(() => {
        // FIX: Ensure 'state' is also reset when currentUser changes.
        setEditedUser({
            ageGroup: currentUser.ageGroup,
            state: currentUser.state,
        });
    }, [currentUser]);

    const triggerSuccess = () => {
        if (successTimeoutRef.current) {
            clearTimeout(successTimeoutRef.current);
        }
        setShowSuccess(true);
        successTimeoutRef.current = window.setTimeout(() => {
            setShowSuccess(false);
        }, 1500);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onUserUpdate(editedUser);
        setIsEditing(false);
        triggerSuccess();
    };

    const handleCancel = () => {
        // FIX: Ensure 'state' is also reverted on cancel.
        setEditedUser({
            ageGroup: currentUser.ageGroup,
            state: currentUser.state,
        });
        setIsEditing(false);
    };

    return (
        <>
            <SuccessAnimation show={showSuccess} />
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="text-center">
                    <h2 className="text-3xl font-bold text-text mb-2">My Profile</h2>
                    <p className="text-text-secondary">View and manage your personal details and achievements.</p>
                </header>

                <div className="bg-card p-6 sm:p-8 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center gap-6">
                    <UserCircleIcon className="h-24 w-24 text-primary-light flex-shrink-0" />
                    <div className="text-center sm:text-left">
                        <h1 className="text-4xl font-extrabold text-text tracking-tight">{currentUser.username}</h1>
                        <p className="text-lg text-text-secondary mt-1">{currentUser.country}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <StatCard icon={<StarIcon className="h-8 w-8" />} value={gamificationData.points} label="Total Points" />
                    <StatCard icon={<TrophyIcon className="h-8 w-8" />} value={gamificationData.badges.length} label="Badges Earned" />
                </div>

                <div className="bg-card p-6 sm:p-8 rounded-2xl shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-text">User Details</h3>
                        {!isEditing && (
                            <button onClick={() => setIsEditing(true)} className="flex items-center text-sm font-semibold text-primary hover:text-primary-dark p-2 rounded-md transition-colors hover:bg-primary/10">
                                <EditIcon className="h-4 w-4 mr-1.5" />
                                Edit Profile
                            </button>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Username</label>
                            <p className="p-3 bg-background rounded-md text-text font-medium">{currentUser.username}</p>
                        </div>
                        <div>
                            <label htmlFor="ageGroup" className="block text-sm font-medium text-text-secondary mb-1">Age Group</label>
                            {isEditing ? (
                                <select
                                    id="ageGroup"
                                    name="ageGroup"
                                    value={editedUser.ageGroup || ''}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-text"
                                >
                                    {Object.values(AgeGroup).map(age => <option key={age} value={age}>{age}</option>)}
                                </select>
                            ) : (
                                <p className="p-3 bg-background rounded-md text-text font-medium">{currentUser.ageGroup}</p>
                            )}
                        </div>
                        {/* FIX: Add section to view and edit the user's state. */}
                        <div>
                            <label htmlFor="state" className="block text-sm font-medium text-text-secondary mb-1">State</label>
                            {isEditing ? (
                                <select
                                    id="state"
                                    name="state"
                                    value={editedUser.state || ''}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-text"
                                >
                                    <option value="">Select State</option>
                                    {Object.values(IndianState).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            ) : (
                                <p className="p-3 bg-background rounded-md text-text font-medium">{currentUser.state || 'Not set'}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Country</label>
                            <p className="p-3 bg-background rounded-md text-text font-medium">{currentUser.country}</p>
                        </div>
                    </div>

                    {isEditing && (
                        <div className="flex justify-end gap-4 mt-8 border-t border-border pt-6">
                            <button onClick={handleCancel} className="py-2 px-5 font-semibold text-text-secondary rounded-full hover:bg-border transition-colors">Cancel</button>
                            <button onClick={handleSave} className="py-2 px-6 font-bold text-white bg-primary rounded-full hover:bg-primary-dark transition-colors transform hover:scale-105">Save Changes</button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};