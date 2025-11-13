import React from 'react';

export const LeafIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.622c0 .54.438.978.978.978h2.544c.54 0 .978-.438.978-.978V3.104m0 17.792v-5.622c0-.54-.438-.978-.978-.978h-2.544c-.54 0-.978.438-.978.978v5.622m0-17.792h3.516c.54 0 .978.438.978.978v2.544c0 .54-.438.978-.978.978h-3.516m0 12.144h3.516c.54 0 .978.438.978.978v2.544c0 .54-.438.978-.978.978h-3.516m-3.516-12.144H6.23c-.54 0-.978.438-.978.978v2.544c0 .54.438.978.978.978h3.516m-3.516 6.522H6.23c-.54 0-.978.438-.978.978v2.544c0 .54.438.978.978.978h3.516" />
  </svg>
);