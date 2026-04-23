
import React from 'react';
import { View } from '../types';

interface HeaderProps {
    isDark?: boolean;
    toggleTheme?: () => void;
    setView?: React.Dispatch<React.SetStateAction<View>>;
    currentView?: View;
}

const Header: React.FC<HeaderProps> = ({ isDark, toggleTheme, setView, currentView }) => {
    return (
        <header className="bg-white/80 dark:bg-luxury-950/80 backdrop-blur-md border-b border-black/5 dark:border-white/5 fixed top-0 w-full z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto py-3 sm:py-5 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                <button 
                    onClick={() => setView && setView('main')}
                    className="flex items-center gap-2 sm:gap-3 min-w-0 pr-4 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-luxury-amber rounded-lg py-1"
                >
                    <div className="flex-shrink-0 h-8 w-8 rounded bg-neutral-900/5 dark:bg-white/10 ring-1 ring-neutral-900/10 dark:ring-white/10 flex items-center justify-center transition-colors group-hover:bg-neutral-900/10 dark:group-hover:bg-white/20">
                        <svg className="w-5 h-5 text-neutral-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                    </div>
                    <span className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-white tracking-tight truncate group-hover:opacity-80 transition-opacity">Customer Service Hub</span>
                </button>

                <div className="flex items-center gap-4">
                    <div className="group relative">
                        <div className={`absolute -inset-0.5 rounded-full blur opacity-20 group-hover:opacity-50 transition duration-500 group-hover:duration-200 will-change-transform ${isDark ? 'bg-gradient-to-r from-luxury-amber via-yellow-500 to-luxury-amber' : 'bg-gradient-to-r from-neutral-400 via-neutral-500 to-neutral-400'}`}></div>
                        <button 
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            className={`relative flex items-center justify-center gap-2.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full leading-none transition-all duration-300 ease-out border shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-luxury-amber focus:ring-offset-2 overflow-hidden w-full sm:w-auto ${isDark ? 'bg-neutral-900 border-white/10 text-neutral-50 hover:bg-neutral-800 dark:focus:ring-offset-luxury-950' : 'bg-white border-neutral-200 text-neutral-900 hover:bg-neutral-50 focus:ring-offset-white'}`}
                        >
                            <span className="absolute inset-0 w-full h-full -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out z-0 pointer-events-none">
                                <span className={`absolute inset-0 bg-gradient-to-r from-transparent to-transparent w-1/2 -skew-x-12 transform origin-left ${isDark ? 'via-white/10' : 'via-black/5'}`}></span>
                            </span>
                            <span className={`relative z-10 transition-colors duration-300 ${isDark ? 'text-luxury-amber group-hover:text-amber-300' : 'text-neutral-500 group-hover:text-neutral-800'}`}>
                                {isDark ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                                )}
                            </span>
                            <span className="relative z-10 text-sm font-medium tracking-tight whitespace-nowrap">
                                {isDark ? 'Light Mode' : 'Dark Mode'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;