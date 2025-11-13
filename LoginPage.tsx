import React, { useState } from 'react';
import { authService } from './services/authService';
// FIX: Import IndianState to use in the registration form.
import { User, AgeGroup, Country, IndianState } from './types';
import { LeafIcon } from './components/icons/LeafIcon';
import { EyeIcon } from './components/icons/EyeIcon';
import { EyeSlashIcon } from './components/icons/EyeSlashIcon';

interface LoginPageProps {
    onLogin: (user: User) => void;
}

type FormMode = 'login' | 'register';

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [mode, setMode] = useState<FormMode>('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [ageGroup, setAgeGroup] = useState<AgeGroup | ''>('');
    // FIX: Add state field for the new state dropdown.
    const [state, setState] = useState<IndianState | ''>('');
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const country = Country.India; // App is now India-only

    const validate = () => {
        const errors: Record<string, string> = {};
        
        if (!username.trim()) {
            errors.username = "Username is required.";
        } else if (mode === 'register' && username.trim().length < 3) {
            errors.username = "Username must be at least 3 characters long.";
        }

        if (!password) errors.password = "Password is required.";

        if (mode === 'register') {
            if (!passwordConfirm) {
                errors.passwordConfirm = "Please confirm your password.";
            } else if (password !== passwordConfirm) {
                errors.passwordConfirm = "Passwords do not match.";
            }
            if (!ageGroup) errors.ageGroup = "Age group is required.";
            // FIX: Add validation for the new state field.
            if (!state) errors.state = "State is required.";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!validate()) return;

        try {
            let user: User;
            if (mode === 'login') {
                user = authService.login(username, password, rememberMe);
            } else {
                // FIX: Pass the selected state to the registration service.
                user = authService.register(username, password, ageGroup as AgeGroup, country, state as IndianState);
            }
            onLogin(user);
        } catch (err: any) {
            setError(err.message);
        }
    };
    
    const resetFormState = (newMode: FormMode) => {
        setMode(newMode);
        setError(null);
        setFormErrors({});
        setPasswordConfirm('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="max-w-md w-full bg-card rounded-2xl shadow-xl p-8 space-y-8">
                <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                        <LeafIcon className="h-12 w-12 text-primary mr-3" />
                        <h1 className="text-4xl font-bold text-primary-dark tracking-tight">
                            CarboLoom
                        </h1>
                    </div>
                    <p className="text-text-secondary">Join the challenge. Track your impact.</p>
                </div>
                
                <div className="flex border-b border-border">
                    <button 
                        onClick={() => resetFormState('login')}
                        className={`w-1/2 py-4 text-center font-semibold text-sm transition-colors duration-300 ${mode === 'login' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary'}`}
                    >
                        LOGIN
                    </button>
                     <button 
                        onClick={() => resetFormState('register')}
                        className={`w-1/2 py-4 text-center font-semibold text-sm transition-colors duration-300 ${mode === 'register' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary'}`}
                    >
                        REGISTER
                    </button>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                    {error && <p className="text-red-500 text-sm text-center bg-red-100 p-2 rounded-md">{error}</p>}
                    
                    <div>
                        <label htmlFor="username" className="sr-only">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={`appearance-none rounded-none relative block w-full px-3 py-3 border placeholder-text-secondary text-text bg-card focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm ${formErrors.username ? 'border-red-500' : 'border-border'} rounded-t-md`}
                            placeholder="Username"
                        />
                        {formErrors.username && <p className="text-red-500 text-xs mt-1">{formErrors.username}</p>}
                    </div>
                    <div>
                        <div className="relative">
                            <label htmlFor="password"className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`appearance-none rounded-none relative block w-full px-3 py-3 border placeholder-text-secondary text-text bg-card focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm ${formErrors.password ? 'border-red-500' : 'border-border'} ${mode === 'login' ? 'rounded-b-md' : ''}`}
                                placeholder="Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700 focus:outline-none"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                            </button>
                        </div>
                         {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
                    </div>
                    
                    {mode === 'register' && (
                        <>
                             <div>
                                <div className="relative">
                                    <label htmlFor="password-confirm" className="sr-only">Confirm Password</label>
                                    <input
                                        id="password-confirm"
                                        name="password-confirm"
                                        type={showPasswordConfirm ? 'text' : 'password'}
                                        value={passwordConfirm}
                                        onChange={(e) => setPasswordConfirm(e.target.value)}
                                        className={`appearance-none rounded-none relative block w-full px-3 py-3 border placeholder-text-secondary text-text bg-card focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm ${formErrors.passwordConfirm ? 'border-red-500' : 'border-border'}`}
                                        placeholder="Confirm Password"
                                    />
                                     <button
                                        type="button"
                                        onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700 focus:outline-none"
                                        aria-label={showPasswordConfirm ? "Hide password" : "Show password"}
                                    >
                                        {showPasswordConfirm ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                    </button>
                                </div>
                                {formErrors.passwordConfirm && <p className="text-red-500 text-xs mt-1">{formErrors.passwordConfirm}</p>}
                            </div>
                            <div>
                                <label htmlFor="ageGroup" className="sr-only">Age Group</label>
                                <select 
                                    id="ageGroup" 
                                    value={ageGroup} 
                                    onChange={e => setAgeGroup(e.target.value as AgeGroup | '')}
                                    className={`appearance-none rounded-none relative block w-full px-3 py-3 border bg-card focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm ${formErrors.ageGroup ? 'border-red-500' : 'border-border'} ${ageGroup ? 'text-text' : 'text-text-secondary'}`}
                                >
                                    <option value="">Select Age Group</option>
                                    {Object.values(AgeGroup).map(age => <option key={age} value={age}>{age}</option>)}
                                </select>
                                {formErrors.ageGroup && <p className="text-red-500 text-xs mt-1">{formErrors.ageGroup}</p>}
                            </div>
                            {/* FIX: Add state selector dropdown for registration. */}
                            <div>
                                <label htmlFor="state" className="sr-only">State</label>
                                <select 
                                    id="state" 
                                    value={state} 
                                    onChange={e => setState(e.target.value as IndianState | '')}
                                    className={`appearance-none rounded-none relative block w-full px-3 py-3 border bg-card focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm rounded-b-md ${formErrors.state ? 'border-red-500' : 'border-border'} ${state ? 'text-text' : 'text-text-secondary'}`}
                                >
                                    <option value="">Select State</option>
                                    {Object.values(IndianState).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                {formErrors.state && <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>}
                            </div>
                        </>
                    )}
                    
                    {mode === 'login' && (
                        <div className="flex items-center">
                             <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 text-primary focus:ring-primary-dark border-border rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-text-secondary">
                                Remember me
                            </label>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark transition-colors duration-300"
                        >
                            {mode === 'login' ? 'Sign in' : 'Create Account'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};