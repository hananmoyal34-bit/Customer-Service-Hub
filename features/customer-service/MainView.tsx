
import React, { useState } from 'react';
import { View } from '../../types';
import ServiceCard from '../../components/ServiceCard';
import { SearchIcon } from '../../components/icons/SearchIcon';
import { SpinnerIcon } from '../../components/icons/SpinnerIcon';
import { getSuggestedService } from '../../services/geminiService';

interface MainViewProps {
    setView: (view: View) => void;
}

const ToolIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5 text-amber-600 dark:text-amber-300" style={{ strokeWidth: 1.5 }}>
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
    </svg>
);

const TruckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5 text-sky-600 dark:text-sky-300" style={{ strokeWidth: 1.5 }}>
        <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"></path>
        <path d="M14 9h4l4 4v5c0 .6-.4 1-1 1h-2"></path>
        <circle cx="7" cy="18" r="2"></circle>
        <circle cx="17" cy="18" r="2"></circle>
    </svg>
);

const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-300" style={{ strokeWidth: 1.5 }}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
);

const ShoppingCartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5 text-violet-600 dark:text-violet-300" style={{ strokeWidth: 1.5 }}>
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
        <path d="M3 6h18"></path>
        <path d="M16 10a4 4 0 0 1-8 0"></path>
    </svg>
);

const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5 text-rose-600 dark:text-rose-300" style={{ strokeWidth: 1.5 }}>
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
        <path d="m9 12 2 2 4-4"></path>
    </svg>
);

const HelpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5 text-fuchsia-600 dark:text-fuchsia-300" style={{ strokeWidth: 1.5 }}>
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
        <path d="M12 17h.01"></path>
    </svg>
);

const MainView: React.FC<MainViewProps> = ({ setView }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        setSearchError(null);
        try {
            const suggestedView = await getSuggestedService(searchQuery);
            if (suggestedView) {
                setView(suggestedView);
            } else {
                 setSearchError("Sorry, I couldn't understand that. Please try rephrasing or select an option below.");
            }
        } catch (error) {
            console.error(error);
            setSearchError("There was an issue with the AI assistant. Please select an option below.");
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="w-full relative min-h-screen pb-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-24 sm:pt-32">
                <div className="max-w-3xl">
                    <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-2 transition-colors">How can we help today?</h2>
                    <p className="mt-2 text-neutral-600 dark:text-neutral-300/90 text-base sm:text-lg transition-colors">Select a category below or ask our AI assistant for immediate help resolving your issue.</p>
                </div>

                <div className="w-full relative max-w-xl mt-8 mb-12">
                    <form onSubmit={handleSearch} className="relative flex items-center">
                        <input 
                            type="search" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="I need help with..."
                            className="w-full bg-white dark:bg-white/5 ring-1 ring-neutral-300 dark:ring-white/10 rounded-xl py-3 pl-11 pr-32 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-luxury-amber transition-all font-sans shadow-sm"
                            aria-label="Search help center"
                            disabled={isSearching}
                        />
                        <div className="absolute left-3 text-neutral-400 dark:text-neutral-500">
                            <SearchIcon className="w-5 h-5 pointer-events-none" />
                        </div>
                        <button 
                            type="submit" 
                            className="absolute right-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-luxury-amber dark:hover:bg-luxury-amber-light dark:text-luxury-950 font-medium px-4 py-1.5 rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-luxury-amber focus-visible:ring-offset-2 dark:focus-visible:ring-offset-luxury-950 shadow-sm"
                            disabled={isSearching || !searchQuery.trim()}
                        >
                            {isSearching ? <SpinnerIcon className="w-4 h-4 ml-0" /> : 'Ask AI'}
                        </button>
                    </form>
                    {searchError && <p className="text-red-500 dark:text-red-400 text-sm mt-2 absolute">{searchError}</p>}
                </div>

                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <ServiceCard 
                        title="Product Support" 
                        description="For damaged products, warranty claims, or to request a product upgrade." 
                        icon={<ToolIcon />}
                        onClick={() => setView('productSupport')} 
                    />
                    <ServiceCard 
                        title="Shipping & Orders" 
                        description="Track your order, report a shipping issue, or ask about delivery." 
                        icon={<TruckIcon />}
                        onClick={() => setView('shippingInquiry')} 
                    />
                    <ServiceCard 
                        title="Request a Callback" 
                        description="Leave your number and we'll call you back as soon as possible." 
                        icon={<PhoneIcon />}
                        onClick={() => setView('requestCallback')} 
                    />
                    <ServiceCard 
                        title="Purchase Inquiry" 
                        description="Contact our sales team to place new orders or inquire about bulk purchases." 
                        icon={<ShoppingCartIcon />}
                        onClick={() => setView('salesInquiry')} 
                    />
                    <ServiceCard 
                        title="Warranty Registration" 
                        description="Register your new product to activate your warranty." 
                        icon={<ShieldIcon />}
                        onClick={() => setView('warrantyRegistration')} 
                    />
                    <ServiceCard 
                        title="General Questions" 
                        description="For all other questions, partnership inquiries, or feedback." 
                        icon={<HelpIcon />}
                        onClick={() => setView('general')} 
                    />
                </div>
            </div>
        </div>
    );
};

export default MainView;