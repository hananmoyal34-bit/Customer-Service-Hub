
import React from 'react';

interface BackButtonProps {
    onClick: () => void;
    className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick, className = '' }) => (
    <button 
        onClick={onClick} 
        aria-label="Go back"
        className={`inline-flex items-center text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-luxury-amber dark:hover:text-luxury-amber mb-6 group transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-luxury-amber rounded-md px-2 py-1 -ml-2 ${className}`}
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
    </button>
);

export default BackButton;
