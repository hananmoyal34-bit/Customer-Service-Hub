import React, { useState } from 'react';
import { View } from '../../types';
import ServiceCard from '../../components/ServiceCard';
import { SearchIcon } from '../../components/icons/SearchIcon';
import { SpinnerIcon } from '../../components/icons/SpinnerIcon';
import { getSuggestedService } from '../../services/geminiService';

interface MainViewProps {
    setView: (view: View) => void;
}

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
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Welcome to Your Support Hub</h2>
                <p className="mt-2 text-lg text-gray-600">Let's get started. Describe your issue below, or select an option.</p>
            </div>
            
            <div className="max-w-2xl mx-auto">
                <form onSubmit={handleSearch} className="relative">
                    <input 
                        type="search" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Ask our AI Assistant (e.g., 'my laptop is broken', 'track my order')"
                        className="w-full p-4 pl-12 pr-32 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                        aria-label="Search help center"
                        disabled={isSearching}
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <SearchIcon className="text-gray-400" />
                    </div>
                    <button 
                        type="submit" 
                        className="absolute inset-y-0 right-0 flex items-center justify-center bg-indigo-600 text-white font-semibold px-6 rounded-full m-1.5 hover:bg-indigo-700 disabled:bg-indigo-400"
                        disabled={isSearching || !searchQuery.trim()}
                    >
                        {isSearching ? <SpinnerIcon /> : 'Ask AI'}
                    </button>
                </form>
                {searchError && <p className="text-center text-red-600 mt-2">{searchError}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                <ServiceCard title="Product Support" description="For issues with a damaged product or to file a warranty claim." onClick={() => setView('productSupport')} />
                <ServiceCard title="Shipping & Order Inquiries" description="Track your order, report a shipping issue, or ask about delivery." onClick={() => setView('shippingInquiry')} />
                <ServiceCard title="Request a Callback" description="Leave your number and we'll call you back as soon as possible." onClick={() => setView('requestCallback')} />
                <ServiceCard title="Purchase More Products" description="Contact our sales team to place new orders or inquire about bulk purchases." onClick={() => setView('salesInquiry')} />
                <ServiceCard title="Warranty Registration" description="Register your new product to activate your warranty." onClick={() => setView('warrantyRegistration')} />
                <ServiceCard title="General Questions" description="For all other questions, partnership inquiries, or feedback." onClick={() => setView('general')} />
            </div>
        </div>
    );
};

export default MainView;