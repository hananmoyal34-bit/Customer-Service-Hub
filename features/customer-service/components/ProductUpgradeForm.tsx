
import React, { useState } from 'react';
import FormWrapper from '../../../components/FormWrapper';
import BackButton from '../../../components/BackButton';
import { submitForm } from '../../../services/formSubmissionService';
import { SpinnerIcon } from '../../../components/icons/SpinnerIcon';
import ReviewModal from './ReviewModal';

interface ProductUpgradeFormProps {
    onBack: () => void;
    onSubmission: (msg: string) => void;
}

const ProductUpgradeForm: React.FC<ProductUpgradeFormProps> = ({ onBack, onSubmission }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentProduct, setCurrentProduct] = useState('');
    const [showNoInvoice, setShowNoInvoice] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [formDataToReview, setFormDataToReview] = useState<Record<string, any>>({});

    const today = new Date().toISOString().split('T')[0];

    const handleReview = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
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
                    {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">{error}</div>}
                    
                    <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <legend className="text-lg font-semibold text-gray-700 mb-2 col-span-full">Your Information</legend>
                        <div><label className="block text-sm font-medium text-gray-700">First Name <span className="text-red-500">*</span></label><input name="firstName" type="text" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" /></div>
                        <div><label className="block text-sm font-medium text-gray-700">Last Name <span className="text-red-500">*</span></label><input name="lastName" type="text" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" /></div>
                        <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700">Email Address <span className="text-red-500">*</span></label><input name="email" type="email" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" /></div>
                    </fieldset>
                    
                    <fieldset className="space-y-4">
                        <legend className="text-lg font-semibold text-gray-700 mb-2">Current Product & Purchase Details</legend>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Which product do you currently own? <span className="text-red-500">*</span></label>
                            <input
                                name="currentProduct"
                                type="text"
                                value={currentProduct}
                                onChange={(e) => setCurrentProduct(e.target.value)}
                                required
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter the product you own"
                            />
                        </div>
                        <div><label className="block text-sm font-medium text-gray-700">Store Name <span className="text-red-500">*</span></label><input name="storeName" type="text" required placeholder="e.g., Main Street Store" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" /></div>
                        <div><label className="block text-sm font-medium text-gray-700">Order / Invoice Number {!showNoInvoice && <span className="text-red-500">*</span>}</label><input name="invoiceNumber" type="text" required={!showNoInvoice} disabled={showNoInvoice} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100" /></div>
                        <button type="button" onClick={() => setShowNoInvoice(!showNoInvoice)} className="text-sm text-indigo-600 hover:underline">Don't have your invoice number?</button>
                        {showNoInvoice && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-md bg-gray-50">
                                <div><label className="block text-sm font-medium text-gray-700">Last 4 Digits of Card <span className="text-red-500">*</span></label><input name="last4Digits" type="text" pattern="\d{4}" maxLength={4} title="Four digits" required={showNoInvoice} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" /></div>
                                <div><label className="block text-sm font-medium text-gray-700">Purchase Amount ($) <span className="text-red-500">*</span></label><input name="purchaseAmount" type="number" step="0.01" required={showNoInvoice} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" /></div>
                                <div><label className="block text-sm font-medium text-gray-700">Date of Purchase <span className="text-red-500">*</span></label><input name="purchaseDate" type="date" required={showNoInvoice} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" max={today} /></div>
                                <div><label className="block text-sm font-medium text-gray-700">Store of Purchase <span className="text-red-500">*</span></label><input name="storeOfPurchase" type="text" placeholder="e.g., Acme.com, Amazon" required={showNoInvoice} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" /></div>
                            </div>
                        )}
                    </fieldset>
                    
                    <fieldset className="space-y-4">
                        <legend className="text-lg font-semibold text-gray-700 mb-2">Upgrade Details</legend>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Your New Phone Model <span className="text-red-500">*</span></label>
                            <input name="newPhoneModel" type="text" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" placeholder="e.g., iPhone 16 Pro Max"/>
                        </div>
                        <div><label className="block text-sm font-medium text-gray-700">Reason for upgrade or any questions (Ticket Notes)</label><textarea name="ticketNotes" rows={5} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea></div>
                    </fieldset>

                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 text-gray-800 text-sm">
                        <h4 className="font-bold text-base text-blue-800 mb-2">Important Information Regarding Your Upgrade</h4>
                        <p className="mb-4">We're excited to help you upgrade your product! Your case includes a lifetime warranty, which covers a free replacement for defects. For upgrades due to a new phone model, a fee of <strong className="font-semibold">$27.08</strong> is required to cover handling, shipping, and taxes.</p>
                        
                        <h5 className="font-semibold text-blue-800 mb-2">Next Steps:</h5>
                        <ol className="list-decimal list-inside space-y-2">
                            <li><strong>Submit this Request:</strong> Complete and submit this form.</li>
                            <li><strong>Return Your Current Case:</strong> Please mail your current case to the address below. We recommend using a trackable shipping method.
                                <div className="mt-1 p-2 bg-white border rounded-md text-gray-700 text-xs">
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
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="upgrade-agreement" className="font-medium text-gray-700">
                                I have read and agree to the upgrade process and the associated fee of $27.08. <span className="text-red-500">*</span>
                            </label>
                        </div>
                    </div>

                    <button type="submit" disabled={isSubmitting} className="w-full flex justify-center bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-700 disabled:bg-indigo-400">
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