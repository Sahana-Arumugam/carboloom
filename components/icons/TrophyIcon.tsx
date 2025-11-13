import React from 'react';

export const TrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M16.5 18.75V15m-6 3.75V15m6 0v-2.25A4.5 4.5 0 0012 8.25V6.75A4.5 4.5 0 007.5 2.25H6.75A4.5 4.5 0 002.25 6.75v3.75a4.5 4.5 0 004.5 4.5H12m6-11.25h.75A4.5 4.5 0 0121.75 6.75v3.75a4.5 4.5 0 01-4.5 4.5H12M12 15v3.75m-1.5 6h3" 
    />
  </svg>
);