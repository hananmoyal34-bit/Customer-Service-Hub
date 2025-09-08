
import React from 'react';

interface ServiceCardProps {
    title: string;
    description: string;
    onClick: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, onClick }) => (
    <button
        onClick={onClick}
        className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all text-left w-full h-full flex flex-col justify-between border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
        <div>
            <h3 className="text-xl font-semibold text-indigo-700">{title}</h3>
            <p className="mt-2 text-gray-600">{description}</p>
        </div>
        <div className="mt-4 text-sm font-medium text-indigo-600 inline-flex items-center group">
            Proceed
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
        </div>
    </button>
);

export default ServiceCard;
