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

const ProductSelector: React.FC<ProductSelectorProps> = ({ products, value, onChange, name, required }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);
    
    const handleSelect = (product: Product) => {
        onChange(product.productName);
        setIsOpen(false);
        setSearchTerm('');
    };

    const filteredAndGroupedProducts = useMemo(() => {
        const filtered = products.filter(p => 
            p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.subCategory.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return filtered.reduce((acc, product) => {
            const { category, subCategory } = product;
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

    const displayValue = value || "Select a product";

    return (
        <div className="relative" ref={wrapperRef}>
            <input type="hidden" name={name} value={value} required={required} />
            <button
                type="button"
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) {
                        setTimeout(() => inputRef.current?.focus(), 100);
                    }
                }}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white text-left focus:ring-indigo-500 focus:border-indigo-500"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                 <span className={value ? 'text-gray-900' : 'text-gray-500'}>{displayValue}</span>
                 <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                 </span>
            </button>
            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-80 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    <div className="p-2 sticky top-0 bg-white z-10 border-b">
                        <div className="relative">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                aria-label="Search products"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                    </div>
                    <ul className="px-2" tabIndex={-1} role="listbox" aria-label="Products">
                        {Object.keys(filteredAndGroupedProducts).length === 0 && searchTerm && (
                            <li className="text-center text-gray-500 py-4">No products found.</li>
                        )}
                        {Object.entries(filteredAndGroupedProducts).map(([category, subCategories]) => (
                            <li key={category}>
                                <h3 className="text-xs font-bold uppercase text-gray-500 bg-gray-50 p-2 -mx-2 my-1 sticky top-[68px]">{category}</h3>
                                {Object.entries(subCategories).map(([subCategory, productList]) => (
                                    <React.Fragment key={subCategory}>
                                        <h4 className="text-sm font-semibold text-gray-700 p-2 pt-3">{subCategory}</h4>
                                        <ul>
                                            {productList.map(product => (
                                                <li
                                                    key={product.productID}
                                                    onClick={() => handleSelect(product)}
                                                    className="text-gray-900 cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-100 rounded-md"
                                                    role="option"
                                                    aria-selected={value === product.productName}
                                                    title={product.productName}
                                                >
                                                    <span className="font-normal block truncate">{product.productName}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </React.Fragment>
                                ))}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ProductSelector;