
import React, { useState, useEffect } from 'react';
import CustomerServicePage from './features/customer-service/CustomerServicePage';
import Header from './components/Header';
import Footer from './components/Footer';
import { View } from './types';

const App: React.FC = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  const [view, setView] = useState<View>('main');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        setIsDark(e.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    const nextMode = !isDark;
    setIsDark(nextMode);
    localStorage.setItem('theme', nextMode ? 'dark' : 'light');
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-luxury-950 text-neutral-900 dark:text-neutral-100 overflow-x-hidden transition-colors duration-300">
      <Header isDark={isDark} toggleTheme={toggleTheme} setView={setView} currentView={view} />
      <main>
        <CustomerServicePage view={view} setView={setView} />
      </main>
      <Footer />
    </div>
  );
};

export default App;