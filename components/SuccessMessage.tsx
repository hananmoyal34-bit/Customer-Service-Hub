
import React from 'react';

interface SuccessMessageProps {
    message: string;
    onReset: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message, onReset }) => (
    <div className="text-center p-8 bg-green-50 rounded-lg border border-green-200 max-w-3xl mx-auto shadow-lg dark:bg-green-950 dark:border-green-800">
        <svg className="mx-auto h-12 w-12 text-green-500 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-4 text-2xl font-bold text-green-800 dark:text-green-200">Thank You!</h3>
        <p className="mt-2 text-green-700 dark:text-green-300">{message}</p>
        <button onClick={onReset} className="mt-6 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            Submit Another Request
        </button>
    </div>
);

export default SuccessMessage;