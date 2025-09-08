import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Product } from '../../../types';
import { SearchIcon } from '../../../components/icons/SearchIcon';

interface ProductSelectorProps {
    products: Product[];
    value: string;
    onChange: (value: string) => void;
    name: string;
    required?: boolean;
}

const ChevronIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);


const ProductSelector: React.FC<ProductSelectorProps> = ({ products, value, onChange, name, required }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedState, setExpandedState] = useState<Record<string, boolean>>({});

    const isProductInList = useMemo(() => {
        if (!value) return false;
        return products.some(p => p.productName === value);
    }, [products, value]);
    
    const [isOtherActive, setIsOtherActive] = useState(!!value && !isProductInList);
    
    const modalRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const otherInputRef = useRef<HTMLInputElement>(null);
    const openButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        setIsOtherActive(!!value && !isProductInList);
    }, [value, isProductInList]);

    // Focus management for modal
    useEffect(() => {
        if (isModalOpen) {
            // Defer focus until the modal is fully rendered
            setTimeout(() => searchInputRef.current?.focus(), 100);
            
            const handleKeyDown = (event: KeyboardEvent) => {
                if (event.key === 'Escape') {
                    setIsModalOpen(false);
                }
                // Basic focus trapping
                if (event.key === 'Tab') {
                     const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
                        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                    );
                    if (!focusableElements || focusableElements.length === 0) return;

                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];

                    if (event.shiftKey) {
                        if (document.activeElement === firstElement) {
                            lastElement.focus();
                            event.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            firstElement.focus();
                            event.preventDefault();
                        }
                    }
                }
            };

            document.addEventListener('keydown', handleKeyDown);
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
                openButtonRef.current?.focus(); // Return focus on close
            };
        }
    }, [isModalOpen]);


    useEffect(() => {
        if (isOtherActive) {
            otherInputRef.current?.focus();
        }
    }, [isOtherActive]);
    
    const handleSelect = (productName: string) => {
        if (productName === '__OTHER__') {
            setIsOtherActive(true);
            onChange('');
        } else {
            setIsOtherActive(false);
            onChange(productName);
        }
        setIsModalOpen(false);
        setSearchTerm('');
    };

    const toggleExpand = (key: string) => {
        setExpandedState(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const isExpanded = (key: string) => {
        if (searchTerm.length > 0) return true; // Expand all results when searching
        return !!expandedState[key]; // Otherwise, respect the user's toggle state (default collapsed)
    };


    const filteredAndGroupedProducts = useMemo(() => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const filtered = products.filter(p => 
            (p.productName || '').toLowerCase().includes(lowercasedSearchTerm) ||
            (p.category || '').toLowerCase().includes(lowercasedSearchTerm) ||
            (p.subCategory || '').toLowerCase().includes(lowercasedSearchTerm)
        );

        return filtered.reduce((acc, product) => {
            const category = product.category || 'Uncategorized';
            const subCategory = product.subCategory || 'General';
            if (!acc[category]) {
                acc[category] = {};
            }
            if (!acc[category][subCategory]) {
                acc[category][subCategory] = [];
            }
            acc[category][subCategory].push(product);
            return acc;
        }, {} as Record<string, Record<string, Product[]>>);
    }, [products, searchTerm]);

    const displayValue = value || "Select a product...";

    return (
        <div className="relative">
            {!isOtherActive && <input type="hidden" name={name} value={value} required={required} />}
            <button
                ref={openButtonRef}
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white text-left focus:ring-indigo-500 focus:border-indigo-500"
                aria-haspopup="dialog"
            >
                 <span className={`block truncate ${value && !isOtherActive ? 'text-gray-900' : 'text-gray-500'}`}>
                    {isOtherActive ? 'Other product specified below' : displayValue}
                </span>
                 <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                 </span>
            </button>

            {isOtherActive && (
                <div className="mt-2">
                    <label htmlFor={`${name}-other-input`} className="block text-sm font-medium text-gray-700">Please specify your product</label>
                    <input
                        id={`${name}-other-input`}
                        ref={otherInputRef}
                        name={name}
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        required={required}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="e.g., SuperWidget Model X"
                    />
                    <button type="button" onClick={() => {setIsOtherActive(false); onChange(''); setIsModalOpen(true);}} className="text-sm text-indigo-600 hover:underline mt-1">Select from list instead</button>
                </div>
            )}
            
            {isModalOpen && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" 
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="product-modal-title"
                >
                    <div ref={modalRef} className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[90vh] max-h-[700px] flex flex-col">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 id="product-modal-title" className="text-lg font-semibold text-gray-800">Select a Product</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" aria-label="Close product selection modal">
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        {/* Search Bar */}
                        <div className="p-4 border-b bg-white">
                            <div className="relative">
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search by name, category..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <SearchIcon className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        {/* Product List */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <ul role="listbox">
                                {Object.keys(filteredAndGroupedProducts).length === 0 && (
                                    <li className="text-center text-gray-500 py-6">
                                        {searchTerm ? 'No products found matching your search.' : 'No products available.'}
                                    </li>
                                )}
                                {Object.entries(filteredAndGroupedProducts).map(([category, subCategories]) => {
                                    const isCategoryExpanded = isExpanded(category);
                                    return (
                                    <li key={category} className="mb-2">
                                        <button type="button" onClick={() => toggleExpand(category)} className="w-full flex justify-between items-center text-left text-sm font-bold uppercase text-gray-600 bg-gray-100 p-2 rounded-md hover:bg-gray-200 transition-colors">
                                            <span>{category}</span>
                                            <ChevronIcon className={`h-5 w-5 transform transition-transform text-gray-500 ${isCategoryExpanded ? 'rotate-180' : ''}`} />
                                        </button>
                                        {isCategoryExpanded && (
                                            <ul className="mt-2 space-y-1 pl-4">
                                            {Object.entries(subCategories).map(([subCategory, productList]) => {
                                                const subCategoryKey = `${category}-${subCategory}`;
                                                const isSubCategoryExpanded = isExpanded(subCategoryKey);
                                                return (
                                                <li key={subCategoryKey}>
                                                    <button type="button" onClick={() => toggleExpand(subCategoryKey)} className="w-full flex justify-between items-center text-md font-semibold text-gray-700 p-2 text-left rounded-md hover:bg-gray-100">
                                                        <span>{subCategory}</span>
                                                        <ChevronIcon className={`h-5 w-5 transform transition-transform ${isSubCategoryExpanded ? 'rotate-180' : ''}`} />
                                                    </button>
                                                    {isSubCategoryExpanded && (
                                                        <ul className="pl-4 mt-1 border-l-2 border-gray-200">
                                                            {productList.map(product => (
                                                                <li
                                                                    key={product.productID}
                                                                    onClick={() => handleSelect(product.productName)}
                                                                    className={`text-gray-800 cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-100 rounded-md my-1 ${value === product.productName ? 'bg-indigo-100 font-semibold' : ''}`}
                                                                    role="option"
                                                                    aria-selected={value === product.productName}
                                                                >
                                                                    <span className="block truncate">{product.productName}</span>
                                                                    {value === product.productName && (
                                                                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                            </svg>
                                                                        </span>
                                                                    )}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </li>
                                                )
                                            })}
                                            </ul>
                                        )}
                                    </li>
                                    )
                                })}
                            </ul>
                        </div>

                        {/* Footer / Other option */}
                         <div className="p-4 border-t">
                             <button 
                                type="button" 
                                onClick={() => handleSelect('__OTHER__')} 
                                className="w-full text-left text-gray-800 cursor-pointer select-none py-3 px-4 hover:bg-gray-100 rounded-md font-semibold"
                                role="option"
                            >
                                My product is not on this list
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductSelector;