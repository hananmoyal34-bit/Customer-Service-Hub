
import React, { useState, useEffect, useMemo } from 'react';
import FormWrapper from '../../../components/FormWrapper';
import BackButton from '../../../components/BackButton';
import { submitForm } from '../../../services/formSubmissionService';
import { SpinnerIcon } from '../../../components/icons/SpinnerIcon';
import ReviewModal from './ReviewModal';
import { getProducts, ProductCatalog } from '../../../services/productService';
import { MultiProductSelector, SelectedProduct } from './MultiProductSelector';

interface ProductUpgradeFormProps {
    onBack: () => void;
    onSubmission: (msg: string) => void;
}

const ProductUpgradeForm: React.FC<ProductUpgradeFormProps> = ({ onBack, onSubmission }) => {
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

    const filteredCatalog = useMemo(() => {
        const chargerCaseCatalog: ProductCatalog = {};
        for (const productName in productCatalog) {
            if (productName.toLowerCase().includes('charger case')) {
                chargerCaseCatalog[productName] = productCatalog[productName];
            }
        }
        return chargerCaseCatalog;
    }, [productCatalog]);

    const formatSelectedProductsForSubmission = (products: SelectedProduct[]) => {
        if (products.length === 0) return "";
        const product = products[0];
        const selectionsString = product.selections
            .map(s => `${s.color} x${s.quantity}`)
            .join(', ');
        return `${product.name} (${selectionsString})`;
    };

     const validationError = useMemo(() => {
        if (!hasInteractedWithProducts && selectedProducts.length === 0) {
            return null;
        }
        if (selectedProducts.length === 0) {
            return "Please select the charger case you currently own.";
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
        data.currentProduct = formatSelectedProductsForSubmission(selectedProducts);
        setFormDataToReview(data);
        setIsReviewModalOpen(true);
    };

    const handleConfirmSubmit = async () => {
        setIsSubmitting(true);
        setError(null);

        try {
            await submitForm({
                formType: "Product Upgrade",
                formData: formDataToReview,
                files: []
            });
            onSubmission("Your upgrade request has been submitted. Our team will review the details and get in touch about the next steps.");
        } catch (err) {
            setError("Failed to submit request. Please try again later.");
            console.error(err);
        } finally {
            setIsSubmitting(false);
            setIsReviewModalOpen(false);
        }
    };

    return (
        <>
            <FormWrapper 
                title="Product Upgrade Request" 
                intro="Interested in upgrading to a newer model? Please provide details about your current product and what you're interested in."
            >
                <BackButton onClick={onBack} />
                <form onSubmit={handleReview} className="space-y-8">
                    {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900/50 dark:text-red-300" role="alert">{error}</div>}
                    
                    <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <legend className="text-lg font-semibold text-gray-700 mb-2 col-span-full dark:text-gray-300">Your Information</legend>
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name <span className="text-red-500">*</span></label><input name="firstName" type="text" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name <span className="text-red-500">*</span></label><input name="lastName" type="text" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" /></div>
                        <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address <span className="text-red-500">*</span></label><input name="email" type="email" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" /></div>
                    </fieldset>
                    
                    <fieldset className="space-y-4">
                        <legend className="text-lg font-semibold text-gray-700 mb-2 dark:text-gray-300">Current Product & Purchase Details</legend>
                        <div>
                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Which charger case do you currently own? <span className="text-red-500">*</span></label>
                             {isLoadingProducts && <div className="mt-2 text-gray-500 dark:text-gray-400">Loading products...</div>}
                             {productError && <div className="mt-2 text-red-600 dark:text-red-400">{productError}</div>}
                             {!isLoadingProducts && !productError && (
                                <MultiProductSelector
                                    catalog={filteredCatalog}
                                    selected={selectedProducts}
                                    onChange={(newSelection) => {
                                        if (!hasInteractedWithProducts) {
                                            setHasInteractedWithProducts(true);
                                        }
                                        // Enforce a single product selection
                                        if (newSelection.length > selectedProducts.length) {
                                            // User added a new product, only keep the latest one.
                                            setSelectedProducts(newSelection.slice(-1));
                                        } else {
                                            // User removed a product
                                            setSelectedProducts(newSelection);
                                        }
                                    }}
                                />
                             )}
                        </div>
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Store Name <span className="text-red-500">*</span></label><input name="storeName" type="text" required placeholder="e.g., Main Street Store" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" /></div>
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
                        <button type="button" onClick={() => setShowNoInvoice(!showNoInvoice)} className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">Don't have your invoice number?</button>
                        {showNoInvoice && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-md bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600">
                                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last 4 Digits of Card <span className="text-red-500">*</span></label><input name="last4Digits" type="text" pattern="\d{4}" maxLength={4} title="Four digits" required={showNoInvoice} className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Purchase Amount ($) <span className="text-red-500">*</span></label><input name="purchaseAmount" type="number" step="0.01" required={showNoInvoice} className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date of Purchase <span className="text-red-500">*</span></label><input name="purchaseDate" type="date" required={showNoInvoice} className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" max={today} /></div>
                            </div>
                        )}
                    </fieldset>
                    
                    <fieldset className="space-y-4">
                        <legend className="text-lg font-semibold text-gray-700 mb-2 dark:text-gray-300">Upgrade Details</legend>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your New Phone Model <span className="text-red-500">*</span></label>
                            <input name="newPhoneModel" type="text" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="e.g., iPhone 16 Pro Max"/>
                        </div>
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reason for upgrade or any questions (Ticket Notes)</label><textarea name="ticketNotes" rows={5} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"></textarea></div>
                    </fieldset>

                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 text-gray-800 text-sm dark:bg-blue-900/20 dark:border-blue-800 dark:text-gray-300">
                        <h4 className="font-bold text-base text-blue-800 mb-2 dark:text-blue-300">Important Information Regarding Your Upgrade</h4>
                        <p className="mb-4">We're excited to help you upgrade your product! Your case includes a lifetime warranty, which covers a free replacement for defects. For upgrades due to a new phone model, a fee of <strong className="font-semibold">$27.08</strong> is required to cover handling, shipping, and taxes.</p>
                        
                        <h5 className="font-semibold text-blue-800 mb-2 dark:text-blue-300">Next Steps:</h5>
                        <ol className="list-decimal list-inside space-y-2">
                            <li><strong>Submit this Request:</strong> Complete and submit this form.</li>
                            <li><strong>Return Your Current Case:</strong> Please mail your current case to the address below. We recommend using a trackable shipping method.
                                <div className="mt-1 p-2 bg-white border rounded-md text-gray-700 text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                                    <strong>Apex Electronics</strong><br />
                                    5415 Cameron St, Suite 121<br />
                                    Las Vegas, NV 89121
                                </div>
                            </li>
                            <li><strong>Payment Link:</strong> After you submit this form, our team will review your request and email you a secure link to complete the payment.</li>
                            <li><strong>Receive Your New Case:</strong> Once we receive your old case and confirm your payment, we will ship your new upgraded case within four business days.</li>
                        </ol>
                        <p className="mt-4">Thank you for your cooperation. If you have any questions, please don’t hesitate to contact us.</p>
                    </div>
                    
                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                id="upgrade-agreement"
                                name="upgradeAgreement"
                                type="checkbox"
                                required
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded dark:border-gray-600"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="upgrade-agreement" className="font-medium text-gray-700 dark:text-gray-300">
                                I have read and agree to the upgrade process and the associated fee of $27.08. <span className="text-red-500">*</span>
                            </label>
                        </div>
                    </div>
                    
                    {validationError && (
                        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg text-center dark:bg-red-900/50 dark:text-red-300" role="alert">
                            {validationError}
                        </div>
                    )}

                    <button type="submit" disabled={isSubmissionDisabled} className="w-full flex justify-center bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-700 disabled:bg-indigo-400">
                        {isSubmitting ? <SpinnerIcon /> : 'Review & Submit Request'}
                    </button>
                </form>
            </FormWrapper>
            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                onConfirm={handleConfirmSubmit}
                title="Review Your Upgrade Request"
                data={formDataToReview}
                isSubmitting={isSubmitting}
            />
        </>
    );
};

export default ProductUpgradeForm;