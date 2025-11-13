import React from 'react';

export const MeatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 8.25C12.75 7.007 11.743 6 10.5 6S8.25 7.007 8.25 8.25m4.5 7.5c0 1.243-1.007 2.25-2.25 2.25S8.25 17.007 8.25 15.75" />
  </svg>
);