import React from 'react';

interface SuccessAnimationProps {
  show: boolean;
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ show }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="success-animation-overlay">
      <div className="success-animation-container">
        <svg className="success-animation-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
          <circle className="success-animation-circle" cx="26" cy="26" r="25" fill="none" />
          <path className="success-animation-checkmark" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
      </div>
    </div>
  );
};
