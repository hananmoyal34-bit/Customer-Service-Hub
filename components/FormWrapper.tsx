
import React from 'react';

interface FormWrapperProps {
    title: string;
    intro?: string;
    children: React.ReactNode;
}

const FormWrapper: React.FC<FormWrapperProps> = ({ title, intro, children }) => (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg max-w-3xl mx-auto border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>
        {intro && <p className="text-gray-600 mb-6">{intro}</p>}
        {children}
    </div>
);

export default FormWrapper;
