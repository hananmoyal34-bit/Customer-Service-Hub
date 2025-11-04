import React, { useState } from 'react';
import { Product } from '../../../types';
import FormWrapper from '../../../components/FormWrapper';
import BackButton from '../../../components/BackButton';
import { submitForm, processSingleFile } from '../../../services/formSubmissionService';
import { SpinnerIcon } from '../../../components/icons/SpinnerIcon';
import ProductSelector from './ProductSelector';
import ReviewModal from './ReviewModal';


interface WarrantyRegistrationFormProps {
    products: Product[];
    onBack: () => void;
    onSubmission: (msg: string) => void;
}

const WarrantyRegistrationForm: React.FC<WarrantyRegistrationFormProps> = ({ products, onBack, onSubmission }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [showNoInvoice, setShowNoInvoice] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [formDataToReview, setFormDataToReview] = useState<Record<string, any>>({});
    const [filesToReview, setFilesToReview] = useState<File[]>([]);

    const today = new Date().toISOString().split('T')[0];

    const handleReview = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

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
                    {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">{error}</div>}
                    
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Your Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label className="block text-sm font-medium text-gray-700">First Name <span className="text-red-500">*</span></label><input name="firstName" type="text" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" /></div>
                        <div><label className="block text-sm font-medium text-gray-700">Last Name <span className="text-red-500">*</span></label><input name="lastName" type="text" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" /></div>
                        <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700">Email Address <span className="text-red-500">*</span></label><input name="email" type="email" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" /></div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Purchase & Product Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700">Store Name <span className="text-red-500">*</span></label><input name="storeName" type="text" required placeholder="e.g., Main Street Store" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" /></div>
                        <div><label className="block text-sm font-medium text-gray-700">Date of Purchase <span className="text-red-500">*</span></label><input name="purchaseDate" type="date" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" max={today} /></div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Product(s) Purchased <span className="text-red-500">*</span></label>
                            <ProductSelector 
                                products={products}
                                name="product"
                                value={selectedProducts}
                                onChange={(val) => Array.isArray(val) && setSelectedProducts(val)}
                                required
                                multiple
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Order / Invoice Number {!showNoInvoice && <span className="text-red-500">*</span>}</label>
                            <input name="invoiceNumber" type="text" required={!showNoInvoice} disabled={showNoInvoice} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100" />
                        </div>
                        <div className="md:col-span-2">
                            <button type="button" onClick={() => setShowNoInvoice(!showNoInvoice)} className="text-sm text-indigo-600 hover:underline">Don't have your invoice number?</button>
                        </div>

                        {showNoInvoice && (
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-md bg-gray-50">
                                <div><label className="block text-sm font-medium text-gray-700">Last 4 Digits of Card <span className="text-red-500">*</span></label><input name="last4Digits" type="text" pattern="\d{4}" maxLength={4} title="Four digits" required={showNoInvoice} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" /></div>
                                <div><label className="block text-sm font-medium text-gray-700">Purchase Amount ($) <span className="text-red-500">*</span></label><input name="purchaseAmount" type="number" step="0.01" required={showNoInvoice} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" /></div>
                            </div>
                        )}

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Upload Receipt</label>
                            <input name="receiptUpload" type="file" accept="image/*,.pdf" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                            <p className="text-xs text-gray-500 mt-1">A clear photo or PDF of your receipt is recommended.</p>
                        </div>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full flex justify-center bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-700 disabled:bg-indigo-400">
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