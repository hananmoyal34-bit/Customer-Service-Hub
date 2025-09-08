import React, { useState } from 'react';
import { Product } from '../../../types';
import FormWrapper from '../../../components/FormWrapper';
import BackButton from '../../../components/BackButton';
import { submitForm, processSingleFile } from '../../../services/formSubmissionService';
import { SpinnerIcon } from '../../../components/icons/SpinnerIcon';
import ProductSelector from './ProductSelector';


interface WarrantyRegistrationFormProps {
    products: Product[];
    onBack: () => void;
    onSubmission: (msg: string) => void;
}

const WarrantyRegistrationForm: React.FC<WarrantyRegistrationFormProps> = ({ products, onBack, onSubmission }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [product, setProduct] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const receiptInput = form.elements.namedItem('receiptUpload') as HTMLInputElement;
        const receiptFile = receiptInput?.files?.[0];

        try {
            const files = receiptFile ? await processSingleFile(receiptFile, 'receipt') : [];

            await submitForm({
                formType: "Warranty Registration",
                formData: data,
                files: files
            });
            onSubmission("Your warranty has been successfully registered. Thank you for choosing our products!");
        } catch (err) {
            setError("Failed to register warranty. Please try again later.");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <FormWrapper title="Register Your Product Warranty">
            <BackButton onClick={onBack} />
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">{error}</div>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div><label className="block text-sm font-medium text-gray-700">Full Name</label><input name="fullName" type="text" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" /></div>
                    <div><label className="block text-sm font-medium text-gray-700">Email Address</label><input name="email" type="email" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" /></div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Product Purchased</label>
                        <ProductSelector 
                            products={products}
                            name="product"
                            value={product}
                            onChange={setProduct}
                            required
                        />
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700">Date of Purchase</label><input name="purchaseDate" type="date" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" /></div>
                    <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700">Store of Purchase</label><input name="storeOfPurchase" type="text" required placeholder="e.g., Acme.com, Amazon" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" /></div>
                    <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700">Order / Invoice Number</label><input name="invoiceNumber" type="text" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" /></div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Upload Receipt</label>
                        <input name="receiptUpload" type="file" accept="image/*,.pdf" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                        <p className="text-xs text-gray-500 mt-1">A clear photo or PDF of your receipt is required.</p>
                    </div>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full flex justify-center bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-700 disabled:bg-indigo-400">
                    {isSubmitting ? <SpinnerIcon /> : 'Register My Warranty'}
                </button>
            </form>
        </FormWrapper>
    );
};

export default WarrantyRegistrationForm;
