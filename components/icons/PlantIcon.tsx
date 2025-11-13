import React from 'react';

export const PlantIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75a3.75 3.75 0 000-7.5 3.75 3.75 0 000 7.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-3.75m0 0a3.75 3.75 0 010-7.5 3.75 3.75 0 010 7.5zm0-7.5V3" />
  </svg>
);