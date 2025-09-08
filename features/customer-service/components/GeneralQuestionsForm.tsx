import React, { useState } from 'react';
import FormWrapper from '../../../components/FormWrapper';
import BackButton from '../../../components/BackButton';
import { submitForm } from '../../../services/formSubmissionService';
import { SpinnerIcon } from '../../../components/icons/SpinnerIcon';


interface GeneralQuestionsFormProps {
    onBack: () => void;
    onSubmission: (msg: string) => void;
}

const GeneralQuestionsForm: React.FC<GeneralQuestionsFormProps> = ({ onBack, onSubmission }) => {
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
                formType: "General Inquiry",
                formData: data,
                files: []
            });
            onSubmission("Your message has been sent. We'll get back to you as soon as possible.");
        } catch (err) {
            setError("Failed to submit form. Please try again later.");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
         <FormWrapper title="Contact Us">
             <BackButton onClick={onBack} />
             <form onSubmit={handleSubmit} className="space-y-6">
                {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">{error}</div>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-medium text-gray-700">Full Name</label><input name="fullName" type="text" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" /></div>
                    <div><label className="block text-sm font-medium text-gray-700">Email Address</label><input name="email" type="email" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" /></div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Subject</label>
                    <select name="subject" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                        <option value="">Select a subject</option>
                        <option>Question about a product</option>
                        <option>Feedback</option>
                        <option>Media/Partnership Inquiry</option>
                        <option>Other</option>
                    </select>
                </div>
                <div><label className="block text-sm font-medium text-gray-700">Your Message</label><textarea name="message" required rows={6} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"></textarea></div>
                <button type="submit" disabled={isSubmitting} className="w-full flex justify-center bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
                    {isSubmitting ? <SpinnerIcon /> : 'Send Message'}
                </button>
             </form>
        </FormWrapper>
    );
};

export default GeneralQuestionsForm;
