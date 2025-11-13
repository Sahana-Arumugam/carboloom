import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LoginPage } from './LoginPage';
import { authService } from './services/authService';
import { User } from './types';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const AuthWrapper: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(authService.getCurrentUser());

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };
  
  const handleUserUpdate = (updatedFields: Partial<User>) => {
    const updatedUser = authService.updateCurrentUser(updatedFields);
    if (updatedUser) {
        setCurrentUser(updatedUser);
    }
  };


  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <App currentUser={currentUser} onLogout={handleLogout} onUserUpdate={handleUserUpdate} />;
};

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthWrapper />
  </React.StrictMode>
);