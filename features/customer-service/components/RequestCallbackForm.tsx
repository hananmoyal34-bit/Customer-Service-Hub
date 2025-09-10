import React, { useState } from 'react';
import FormWrapper from '../../../components/FormWrapper';
import BackButton from '../../../components/BackButton';
import { submitForm } from '../../../services/formSubmissionService';
import { SpinnerIcon } from '../../../components/icons/SpinnerIcon';
import ReviewModal from './ReviewModal';


interface RequestCallbackFormProps {
    onBack: () => void;
    onSubmission: (msg: string) => void;
}

const RequestCallbackForm: React.FC<RequestCallbackFormProps> = ({ onBack, onSubmission }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
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
        // FIX: Removed `e.preventDefault()` which caused an error because the event object `e` is not passed to this handler.
        setIsSubmitting(true);
        setError(null);
        
        try {
            await submitForm({
                formType: "Callback Request",
                formData: formDataToReview,
                files: []
            });
            onSubmission("Your callback request has been received. Our team will contact you shortly.");
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
            <FormWrapper title="Request a Callback">
                <BackButton onClick={onBack} />
                <form onSubmit={handleReview} className="space-y-6">
                    {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">{error}</div>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label className="block text-sm font-medium text-gray-700">First Name</label><input name="firstName" type="text" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" /></div>
                        <div><label className="block text-sm font-medium text-gray-700">Last Name</label><input name="lastName" type="text" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" /></div>
                        <div><label className="block text-sm font-medium text-gray-700">Phone Number</label><input name="phoneNumber" type="tel" required placeholder="(555) 555-5555" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" /></div>
                        <div><label className="block text-sm font-medium text-gray-700">Store Name</label><input name="storeName" type="text" required placeholder="e.g., Main Street Store" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" /></div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
                        <input name="invoiceNumber" type="text" required={!showNoInvoice} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                    </div>

                    <button type="button" onClick={() => setShowNoInvoice(!showNoInvoice)} className="text-sm text-indigo-600 hover:underline">Don't have your invoice number?</button>

                    {showNoInvoice && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-md bg-gray-50">
                            <div><label className="block text-sm font-medium text-gray-700">Last 4 Digits of Card</label><input name="last4Digits" type="text" pattern="\d{4}" title="Four digits" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" /></div>
                            <div><label className="block text-sm font-medium text-gray-700">Purchase Amount ($)</label><input name="purchaseAmount" type="number" step="0.01" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" /></div>
                            <div><label className="block text-sm font-medium text-gray-700">Date of Purchase</label><input name="purchaseDate" type="date" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" max={today} /></div>
                            <div><label className="block text-sm font-medium text-gray-700">Store of Purchase</label><input name="storeOfPurchase" type="text" placeholder="e.g., Acme.com, Amazon" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" /></div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Best Time to Call</label>
                        <select name="bestTimeToCall" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white">
                            <option>Anytime</option>
                            <option>Morning (9am - 12pm)</option>
                            <option>Afternoon (12pm - 5pm)</option>
                        </select>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700">Reason for Call (Ticket Notes)</label><textarea name="ticketNotes" required rows={4} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea></div>
                    <button type="submit" disabled={isSubmitting} className="w-full flex justify-center bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-700 disabled:bg-indigo-400">
                        {isSubmitting ? <SpinnerIcon /> : 'Review & Submit Request'}
                    </button>
                </form>
            </FormWrapper>
            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                onConfirm={handleConfirmSubmit}
                title="Review Your Callback Request"
                data={formDataToReview}
                isSubmitting={isSubmitting}
            />
        </>
    );
};

export default RequestCallbackForm;