
import React from 'react';

interface ServiceCardProps {
    title: string;
    description: string;
    onClick?: () => void;
    href?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, onClick, href }) => {
    const content = (
        <>
            <div>
                <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400">{title}</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{description}</p>
            </div>
            <div className="mt-4 text-sm font-medium text-indigo-600 dark:text-indigo-400 inline-flex items-center group">
                Proceed
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </div>
        </>
    );

    const classNames = "bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all text-left w-full h-full flex flex-col justify-between border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700";

    if (href) {
        return (
            <a href={href} className={classNames}>
                {content}
            </a>
        );
    }

    return (
        <button
            onClick={onClick}
            className={classNames}
        >
            {content}
        </button>
    );
};

export default ServiceCard;