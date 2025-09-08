import React, { useState } from 'react';
import FormWrapper from '../../../components/FormWrapper';
import BackButton from '../../../components/BackButton';
import { submitForm, processFiles } from '../../../services/formSubmissionService';
import { SpinnerIcon } from '../../../components/icons/SpinnerIcon';

interface ShippingInquiryFormProps {
    onBack: () => void;
    onSubmission: (msg: string) => void;
}

const ShippingInquiryForm: React.FC<ShippingInquiryFormProps> = ({ onBack, onSubmission }) => {
    const [subject, setSubject] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const imageInput = form.elements.namedItem('damagePhotos') as HTMLInputElement;
        const imageFiles = imageInput?.files || new FileList();

        try {
            const files = await processFiles(imageFiles, 'file');
            
            await submitForm({
                formType: "Shipping Inquiry",
                formData: data,
                files: files
            });
            onSubmission("Your shipping inquiry has been submitted. We'll review it and get back to you shortly.");
        } catch (err) {
            setError("Failed to submit inquiry. Please try again later.");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormWrapper 
            title="Shipping & Order Inquiries"
            intro="Please provide your order details below so we can assist you with your shipping questions."
        >
            <BackButton onClick={onBack} />
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">{error}</div>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-medium text-gray-700">Full Name</label><input name="fullName" type="text" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" /></div>
                    <div><label className="block text-sm font-medium text-gray-700">Email Address</label><input name="email" type="email" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" /></div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Order / Invoice Number</label>
                    <input name="invoiceNumber" type="text" required placeholder="Located on your confirmation email" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Subject</label>
                    <select name="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white">
                        <option value="">Please select a reason</option>
                        <option>Where is my order?</option>
                        <option>My order arrived damaged</option>
                        <option>I received the wrong item(s)</option>
                        <option>Question about shipping policy</option>
                        <option>Other</option>
                    </select>
                </div>

                {subject === 'My order arrived damaged' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Upload Photos of the Damage</label>
                        <input name="damagePhotos" type="file" multiple accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                        <p className="text-xs text-gray-500 mt-1">Please provide photos of the damaged item and the shipping box.</p>
                    </div>
                )}
                
                <div>
                    <label className="block text-sm font-medium text-gray-700">Message</label>
                    <textarea name="message" required rows={6} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" placeholder="Please provide any additional details that might help us resolve your issue."></textarea>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full flex justify-center bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-700 disabled:bg-indigo-400">
                     {isSubmitting ? <SpinnerIcon /> : 'Submit Inquiry'}
                </button>
            </form>
        </FormWrapper>
    );
};

export default ShippingInquiryForm;
