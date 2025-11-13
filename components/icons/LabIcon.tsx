import React from 'react';

export const LabIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
        d="M9.75 3.104v5.622c0 .54.438.978.978.978h2.544c.54 0 .978-.438.978-.978V3.104M9 4.878l.06-2.142a2.25 2.25 0 012.19-2.238h1.5a2.25 2.25 0 012.19 2.238l.06 2.142M9 13.5V21a2.25 2.25 0 002.25 2.25h1.5A2.25 2.25 0 0015 21v-7.5m-6 0h6M5.25 9.75h13.5" 
    />
  </svg>
);