import React, { useState } from 'react';
import FormWrapper from '../../../components/FormWrapper';
import BackButton from '../../../components/BackButton';
import { submitForm } from '../../../services/formSubmissionService';
import { SpinnerIcon } from '../../../components/icons/SpinnerIcon';


interface RequestCallbackFormProps {
    onBack: () => void;
    onSubmission: (msg: string) => void;
}

const RequestCallbackForm: React.FC<RequestCallbackFormProps> = ({ onBack, onSubmission }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        
        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            await submitForm({
                formType: "Callback Request",
                formData: data,
                files: []
            });
            onSubmission("Your callback request has been received. Our team will contact you shortly.");
        } catch (err) {
            setError("Failed to submit request. Please try again later.");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
         <FormWrapper title="Request a Callback">
             <BackButton onClick={onBack} />
             <form onSubmit={handleSubmit} className="space-y-6">
                {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">{error}</div>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-medium text-gray-700">Full Name</label><input name="fullName" type="text" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" /></div>
                    <div><label className="block text-sm font-medium text-gray-700">Phone Number</label><input name="phoneNumber" type="tel" required placeholder="(555) 555-5555" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" /></div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Best Time to Call</label>
                    <select name="bestTimeToCall" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white">
                        <option>Anytime</option>
                        <option>Morning (9am - 12pm)</option>
                        <option>Afternoon (12pm - 5pm)</option>
                    </select>
                </div>
                <div><label className="block text-sm font-medium text-gray-700">Reason for Call (optional)</label><textarea name="reasonForCall" rows={4} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea></div>
                <button type="submit" disabled={isSubmitting} className="w-full flex justify-center bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-700 disabled:bg-indigo-400">
                     {isSubmitting ? <SpinnerIcon /> : 'Submit Request'}
                </button>
             </form>
        </FormWrapper>
    );
};

export default RequestCallbackForm;
