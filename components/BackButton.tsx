
import React from 'react';

interface BackButtonProps {
    onClick: () => void;
    className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick, className = '' }) => (
    <button onClick={onClick} className={`inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-6 group transition-transform duration-200 ${className}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
    </button>
);

export default BackButton;
