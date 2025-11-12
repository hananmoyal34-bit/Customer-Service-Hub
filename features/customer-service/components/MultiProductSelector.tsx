import React, { useState, useMemo, useEffect } from 'react';
import { ProductCatalog } from '../../../services/productService';

export interface SelectedColor {
    color: string;
    quantity: number;
}

export interface SelectedProduct {
    name: string;
    selections: SelectedColor[];
}

interface MultiProductSelectorProps {
    catalog: ProductCatalog;
    selected: SelectedProduct[];
    onChange: (selected: SelectedProduct[]) => void;
}

const ProductSelectionSummary: React.FC<{ product: SelectedProduct; onEdit: () => void; onRemove: () => void }> = ({ product, onEdit, onRemove }) => {
    const totalQuantity = product.selections.reduce((sum, s) => sum + s.quantity, 0);
    const colorCount = product.selections.length;

    return (
        <div className="p-3 bg-white rounded-md border border-indigo-200 shadow-sm flex items-center justify-between gap-2 flex-wrap">
            <div>
                <h5 className="font-semibold text-gray-900 text-base">{product.name}</h5>
                <p className="text-xs text-gray-600 mt-1">
                    {colorCount > 0 ? `${colorCount} color(s) selected, ${totalQuantity} total item(s)` : 'No colors selected'}
                </p>
            </div>
            <div className="flex items-center gap-2">
                 <button
                    type="button"
                    onClick={onEdit}
                    className="px-3 py-1 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    Edit
                </button>
                 <button
                    type="button"
                    onClick={onRemove}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label={`Remove ${product.name}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
};


export const MultiProductSelector: React.FC<MultiProductSelectorProps> = ({ catalog, selected, onChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());
    const allProductNames = useMemo(() => Object.keys(catalog).sort(), [catalog]);

    // Auto-expand the last added product if it's not already expanded.
    useEffect(() => {
        if (selected.length > 0) {
            const lastProduct = selected[selected.length - 1];
            if (!expandedProducts.has(lastProduct.name)) {
                setExpandedProducts(prev => new Set(prev).add(lastProduct.name));
            }
        }
    }, [selected.length]);

    const filteredProductNames = useMemo(() => {
        const selectedNames = new Set(selected.map(p => p.name));
        return allProductNames.filter(name =>
            !selectedNames.has(name) &&
            name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, allProductNames, selected]);

    const handleAddProduct = (productName: string) => {
        const isSelected = selected.some(p => p.name === productName);
        if (!isSelected) {
            const newSelection = [...selected, { name: productName, selections: [] }];
            onChange(newSelection);
            // The useEffect will handle expanding this new product
        }
    };
    
    const handleColorToggle = (productName: string, color: string) => {
        const newSelection = selected.map(p => {
            if (p.name === productName) {
                const isColorSelected = p.selections.some(s => s.color === color);
                const newSelections = isColorSelected
                    ? p.selections.filter(s => s.color !== color)
                    : [...p.selections, { color, quantity: 1 }];
                return { ...p, selections: newSelections.sort((a, b) => a.color.localeCompare(b.color)) };
            }
            return p;
        });
        onChange(newSelection);
    };

    const handleQuantityChange = (productName: string, color: string, quantityStr: string) => {
        const quantity = parseInt(quantityStr, 10);
        const newQuantity = isNaN(quantity) || quantity < 1 ? 1 : quantity;

        const newSelection = selected.map(p => {
            if (p.name === productName) {
                const newSelections = p.selections.map(s => 
                    s.color === color ? { ...s, quantity: newQuantity } : s
                );
                return { ...p, selections: newSelections };
            }
            return p;
        });
        onChange(newSelection);
    };

    const handleRemoveProduct = (productName: string) => {
        const newSelection = selected.filter(p => p.name !== productName);
        onChange(newSelection);
        handleToggleExpand(productName, false); // Ensure it's removed from expanded set
    }

    const handleToggleExpand = (productName: string, forceState?: boolean) => {
        setExpandedProducts(prev => {
            const newSet = new Set(prev);
            const shouldExpand = forceState !== undefined ? forceState : !newSet.has(productName);
            
            if (shouldExpand) {
                newSet.add(productName);
            } else {
                newSet.delete(productName);
            }
            return newSet;
        });
    };
    
    return (
        <div className="space-y-4">
            {selected.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-800">Selected Products:</h4>
                    <div className="space-y-3 rounded-lg border border-gray-200 p-2 sm:p-3 bg-gray-50">
                        {selected.map(product => {
                            const isExpanded = expandedProducts.has(product.name);
                            if (!isExpanded) {
                                return (
                                    <ProductSelectionSummary 
                                        key={product.name} 
                                        product={product} 
                                        onEdit={() => handleToggleExpand(product.name, true)}
                                        onRemove={() => handleRemoveProduct(product.name)}
                                    />
                                );
                            }

                             const availableColors = catalog[product.name] || [];
                             return (
                            <div key={product.name} className="p-3 bg-white rounded-md border-2 border-indigo-400 shadow-lg">
                                <div className="flex justify-between items-start gap-2">
                                    <h5 className="font-semibold text-gray-900 pt-1 text-base">{product.name}</h5>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveProduct(product.name)}
                                        className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        aria-label={`Remove ${product.name}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="mt-3 pl-1 border-t pt-3 space-y-3">
                                     <p className="text-sm font-medium text-gray-600">Select colors & quantity:</p>
                                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                        {availableColors.map(color => {
                                            const selection = product.selections.find(s => s.color === color);
                                            const isChecked = !!selection;
                                            const pillClasses = isChecked 
                                                ? 'bg-indigo-600 text-white border-indigo-600'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-indigo-50 hover:border-indigo-400';

                                            return (
                                                <div key={color} className="space-y-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleColorToggle(product.name, color)}
                                                        className={`w-full flex items-center justify-center text-center px-2 py-2 text-sm font-medium border rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 ${pillClasses}`}
                                                    >
                                                        {isChecked && (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                        {color}
                                                    </button>
                                                    {isChecked && (
                                                         <div className="flex items-center gap-2 pl-1">
                                                            <label htmlFor={`${product.name}-${color}-qty`} className="text-sm text-gray-600 font-medium">Qty:</label>
                                                            <input
                                                                id={`${product.name}-${color}-qty`}
                                                                type="number"
                                                                min="1"
                                                                value={selection.quantity}
                                                                onChange={(e) => handleQuantityChange(product.name, color, e.target.value)}
                                                                className="w-full p-1.5 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                                aria-label={`Quantity for ${product.name} ${color}`}
                                                            />
                                                         </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="pt-3 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => handleToggleExpand(product.name, false)}
                                            className="px-4 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Done
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )})}
                    </div>
                </div>
            )}
            
            <div>
                 <label htmlFor="product-search" className="block text-sm font-medium text-gray-700">Find and Select Products:</label>
                 <input
                    id="product-search"
                    type="search"
                    placeholder="Search for a product..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
            
            <div className="mt-2 p-3 border border-gray-300 rounded-md max-h-60 overflow-y-auto bg-white">
                {filteredProductNames.length > 0 ? (
                    <div className="space-y-1">
                        {filteredProductNames.map(productName => (
                            <div key={productName} className="flex items-center p-2 rounded-md hover:bg-gray-50">
                                <button
                                    type="button"
                                    onClick={() => handleAddProduct(productName)}
                                    className="flex items-center space-x-3 cursor-pointer w-full text-left"
                                >
                                    <div className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 flex items-center justify-center border">
                                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    <span className="text-sm text-gray-800">{productName}</span>
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                        {allProductNames.length > selected.length ? 'No products found matching your search.' : 'All products have been selected.'}
                    </p>
                )}
            </div>
        </div>
    );
};