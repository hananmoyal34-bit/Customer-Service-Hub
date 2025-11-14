
import React, { useState } from 'react';
import FormWrapper from '../../../components/FormWrapper';
import BackButton from '../../../components/BackButton';
import { submitForm, processFiles } from '../../../services/formSubmissionService';
import { SpinnerIcon } from '../../../components/icons/SpinnerIcon';
import MultiUploader from './MultiUploader';
import ReviewModal from './ReviewModal';

interface ShippingInquiryFormProps {
    onBack: () => void;
    onSubmission: (msg: string) => void;
}

const ShippingInquiryForm: React.FC<ShippingInquiryFormProps> = ({ onBack, onSubmission }) => {
    const [subject, setSubject] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [damagePhotos, setDamagePhotos] = useState<File[]>([]);
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
            const files = await processFiles(damagePhotos, 'file');
            
            await submitForm({
                formType: "Shipping Inquiry",
                formData: formDataToReview,
                files: files
            });
            onSubmission("Your shipping inquiry has been submitted. We'll review it and get back to you shortly.");
        } catch (err) {
            setError("Failed to submit inquiry. Please try again later.");
            console.error(err);
        } finally {
            setIsSubmitting(false);
            setIsReviewModalOpen(false);
        }
    };

    return (
        <>
            <FormWrapper 
                title="Shipping & Order Inquiries"
                intro="Please provide your order details below so we can assist you with your shipping questions."
            >
                <BackButton onClick={onBack} />
                <form onSubmit={handleReview} className="space-y-6">
                    {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900/50 dark:text-red-300" role="alert">{error}</div>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name <span className="text-red-500">*</span></label><input name="firstName" type="text" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name <span className="text-red-500">*</span></label><input name="lastName" type="text" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" /></div>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address <span className="text-red-500">*</span></label><input name="email" type="email" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" /></div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Store Name <span className="text-red-500">*</span></label>
                        <input name="storeName" type="text" required placeholder="e.g., Main Street Store" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
                    </div>
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
                        <input id="invoiceNumber" name="invoiceNumber" type="tel" pattern="[0-9]*" onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }} title="Please enter only numbers for the invoice number." required={!showNoInvoice} disabled={showNoInvoice} placeholder="Located on your confirmation email" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:disabled:bg-gray-600" />
                    </div>
                    <button type="button" onClick={() => setShowNoInvoice(!showNoInvoice)} className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">Don't have your invoice number?</button>
                    
                    {showNoInvoice && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-md bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600">
                            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last 4 Digits of Card <span className="text-red-500">*</span></label><input name="last4Digits" type="text" pattern="\d{4}" maxLength={4} title="Four digits" required={showNoInvoice} className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Purchase Amount ($) <span className="text-red-500">*</span></label><input name="purchaseAmount" type="number" step="0.01" required={showNoInvoice} className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date of Purchase <span className="text-red-500">*</span></label><input name="purchaseDate" type="date" required={showNoInvoice} className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" max={today} /></div>
                            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Store of Purchase <span className="text-red-500">*</span></label><input name="storeOfPurchase" type="text" placeholder="e.g., Acme.com, Amazon" required={showNoInvoice} className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" /></div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject <span className="text-red-500">*</span></label>
                        <select name="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
                            <option value="">Please select a reason</option>
                            <option>Where is my order?</option>
                            <option>My order arrived damaged</option>
                            <option>I received the wrong item(s)</option>
                            <option>Question about shipping policy</option>
                            <option>Other</option>
                        </select>
                    </div>

                    {subject === 'My order arrived damaged' && (
                        <MultiUploader 
                            name="damagePhotos"
                            label="Upload Photos of the Damage"
                            onChange={setDamagePhotos}
                            maxFiles={4}
                            description="Please provide photos of the damaged item and the shipping box."
                        />
                    )}
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message (Ticket Notes) <span className="text-red-500">*</span></label>
                        <textarea name="ticketNotes" required rows={6} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Please provide any additional details that might help us resolve your issue."></textarea>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full flex justify-center bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-700 disabled:bg-indigo-400">
                        {isSubmitting ? <SpinnerIcon /> : 'Review & Submit Inquiry'}
                    </button>
                </form>
            </FormWrapper>
            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                onConfirm={handleConfirmSubmit}
                title="Review Your Shipping Inquiry"
                data={formDataToReview}
                files={damagePhotos}
                isSubmitting={isSubmitting}
            />
        </>
    );
};

export default ShippingInquiryForm;