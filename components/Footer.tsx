
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-neutral-50 dark:bg-luxury-950 border-t border-neutral-200 dark:border-white/5 py-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center flex flex-col items-center">
                <span className="text-lg font-semibold text-neutral-900 dark:text-white tracking-tight opacity-70 dark:opacity-50 mb-4 transition-colors">Customer Service Hub</span>
                <p className="text-sm text-neutral-500 dark:text-neutral-500 transition-colors">All inquiries will be answered within 1-3 business days, excluding public holidays.</p>
                <div className="mt-6 flex gap-6 text-sm text-neutral-500">
                    <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition">Privacy Policy</a>
                    <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;