
import React, { useState, useEffect, useMemo } from 'react';
import FormWrapper from '../../../components/FormWrapper';
import BackButton from '../../../components/BackButton';
import { submitForm, processSingleFile } from '../../../services/formSubmissionService';
import { SpinnerIcon } from '../../../components/icons/SpinnerIcon';
import ReviewModal from './ReviewModal';
import { getProducts, ProductCatalog } from '../../../services/productService';
import { MultiProductSelector, SelectedProduct } from './MultiProductSelector';


interface WarrantyRegistrationFormProps {
    onBack: () => void;
    onSubmission: (msg: string) => void;
}

const WarrantyRegistrationForm: React.FC<WarrantyRegistrationFormProps> = ({ onBack, onSubmission }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const [productCatalog, setProductCatalog] = useState<ProductCatalog>({});
    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [productError, setProductError] = useState<string | null>(null);
    const [hasInteractedWithProducts, setHasInteractedWithProducts] = useState(false);

    const [showNoInvoice, setShowNoInvoice] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [formDataToReview, setFormDataToReview] = useState<Record<string, any>>({});
    const [filesToReview, setFilesToReview] = useState<File[]>([]);

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoadingProducts(true);
                setProductError(null);
                const catalog = await getProducts();
                setProductCatalog(catalog);
            } catch (err) {
                console.error("Failed to fetch products:", err);
                setProductError("Could not load product list. Please try again or contact support.");
            } finally {
                setIsLoadingProducts(false);
            }
        };

        fetchProducts();
    }, []);
    
    const formatSelectedProductsForSubmission = (products: SelectedProduct[]) => {
        return products
            .filter(p => p.selections.length > 0)
            .map(p => {
                const selectionsString = p.selections
                    .map(s => `${s.color} x${s.quantity}`)
                    .join(', ');
                return `${p.name} (${selectionsString})`;
            })
            .join('; ');
    };

    const validationError = useMemo(() => {
        if (!hasInteractedWithProducts && selectedProducts.length === 0) {
            return null;
        }
        if (selectedProducts.length === 0) {
            return "Please select at least one product to register.";
        }
        const productWithoutColor = selectedProducts.find(p => p.selections.length === 0);
        if (productWithoutColor) {
            return `Please select at least one color and quantity for "${productWithoutColor.name}".`;
        }
        return null;
    }, [selectedProducts, hasInteractedWithProducts]);

    const isSubmissionDisabled = isSubmitting || !!validationError;

    const handleReview = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        data.product = formatSelectedProductsForSubmission(selectedProducts);

        const receiptInput = form.elements.namedItem('receiptUpload') as HTMLInputElement;
        const receiptFile = receiptInput?.files?.[0];
        const files = receiptFile ? [receiptFile] : [];
        
        setFormDataToReview(data);
        setFilesToReview(files);
        setIsReviewModalOpen(true);
    };

    const handleConfirmSubmit = async () => {
        setIsSubmitting(true);
        setError(null);

        try {
            const files = filesToReview.length > 0 ? await processSingleFile(filesToReview[0], 'receipt') : [];

            await submitForm({
                formType: "Warranty Registration",
                formData: formDataToReview,
                files: files
            });
            onSubmission("Your warranty has been successfully registered. Thank you for choosing our products!");
        } catch (err) {
            setError("Failed to register warranty. Please try again later.");
            console.error(err);
        } finally {
            setIsSubmitting(false);
            setIsReviewModalOpen(false);
        }
    };
    
    return (
        <>
            <FormWrapper title="Register Your Product Warranty">
                <BackButton onClick={onBack} />
                <form onSubmit={handleReview} className="space-y-6">
                    {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900/50 dark:text-red-300" role="alert">{error}</div>}
                    
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 dark:text-gray-300 dark:border-gray-700">Your Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name <span className="text-red-500">*</span></label><input name="firstName" type="text" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name <span className="text-red-500">*</span></label><input name="lastName" type="text" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" /></div>
                        <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address <span className="text-red-500">*</span></label><input name="email" type="email" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" /></div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 dark:text-gray-300 dark:border-gray-700">Purchase & Product Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Store Name <span className="text-red-500">*</span></label><input name="storeName" type="text" required placeholder="e.g., Main Street Store" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" /></div>
                        
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date of Purchase <span className="text-red-500">*</span></label><input name="purchaseDate" type="date" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" max={today} /></div>
                        
                        <div>
                            <div className="flex items-center">
                                <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Order / Invoice Number {!showNoInvoice && <span className="text-red-500">*</span>}</label>
                                <div className="group relative flex items-center ml-2">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    <span className="absolute bottom-full mb-2 w-max -translate-x-1/2 left-1/2 invisible group-hover:visible bg-gray-700 text-white text-xs rounded py-1 px-2 z-10 dark:bg-gray-600">
                                        Only numbers are allowed.
                                    </span>
                                </div>
                            </div>
                            <input id="invoiceNumber" name="invoiceNumber" type="tel" pattern="[0-9]*" onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }} title="Please enter only numbers for the invoice number." required={!showNoInvoice} disabled={showNoInvoice} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:disabled:bg-gray-600" />
                        </div>

                        <div className="md:col-span-2">
                            <button type="button" onClick={() => setShowNoInvoice(!showNoInvoice)} className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">Don't have your invoice number?</button>
                        </div>

                        {showNoInvoice && (
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-md bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600">
                                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last 4 Digits of Card <span className="text-red-500">*</span></label><input name="last4Digits" type="text" pattern="\d{4}" maxLength={4} title="Four digits" required={showNoInvoice} className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Purchase Amount ($) <span className="text-red-500">*</span></label><input name="purchaseAmount" type="number" step="0.01" required={showNoInvoice} className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" /></div>
                            </div>
                        )}

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Upload Receipt</label>
                            <input name="receiptUpload" type="file" accept="image/*,.pdf" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:text-gray-400 dark:file:bg-indigo-900/50 dark:file:text-indigo-300 dark:hover:file:bg-indigo-900"/>
                            <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">A clear photo or PDF of your receipt is recommended.</p>
                        </div>

                        <div className="md:col-span-2">
                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product(s) Purchased <span className="text-red-500">*</span></label>
                             {isLoadingProducts && <div className="mt-2 text-gray-500 dark:text-gray-400">Loading products...</div>}
                             {productError && <div className="mt-2 text-red-600 dark:text-red-400">{productError}</div>}
                             {!isLoadingProducts && !productError && (
                                <MultiProductSelector
                                    catalog={productCatalog}
                                    selected={selectedProducts}
                                    onChange={(newSelection) => {
                                        if (!hasInteractedWithProducts) {
                                            setHasInteractedWithProducts(true);
                                        }
                                        setSelectedProducts(newSelection);
                                    }}
                                />
                             )}
                             <input type="hidden" name="product" value={formatSelectedProductsForSubmission(selectedProducts)} />
                        </div>
                    </div>
                    
                    {validationError && (
                        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg text-center dark:bg-red-900/50 dark:text-red-300" role="alert">
                            {validationError}
                        </div>
                    )}

                    <button type="submit" disabled={isSubmissionDisabled} className="w-full flex justify-center bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-700 disabled:bg-indigo-400">
                        {isSubmitting ? <SpinnerIcon /> : 'Review & Register Warranty'}
                    </button>
                </form>
            </FormWrapper>
            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                onConfirm={handleConfirmSubmit}
                title="Review Your Warranty Registration"
                data={formDataToReview}
                files={filesToReview}
                isSubmitting={isSubmitting}
            />
        </>
    );
};

export default WarrantyRegistrationForm;