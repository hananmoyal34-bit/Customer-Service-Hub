
import React from 'react';

interface FormWrapperProps {
    title: string;
    intro?: string;
    children: React.ReactNode;
}

const FormWrapper: React.FC<FormWrapperProps> = ({ title, intro, children }) => (
    <div className="pt-24 sm:pt-32 pb-24 px-4 min-h-screen flex items-start sm:items-center justify-center transition-colors">
        <div className="bg-white dark:bg-white/5 p-6 sm:p-12 rounded-2xl shadow-xl dark:shadow-2xl max-w-3xl w-full border border-neutral-200 dark:border-white/10 relative overflow-hidden backdrop-blur-md transition-colors">
            <div className="absolute top-0 w-full h-1 bg-luxury-amber left-0"></div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-neutral-900 dark:text-white mb-3 tracking-tight transition-colors">{title}</h2>
            {intro && <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base mb-8 transition-colors">{intro}</p>}
            <div className="text-neutral-900 dark:text-white transition-colors">
                {children}
            </div>
        </div>
    </div>
);

export default FormWrapper;