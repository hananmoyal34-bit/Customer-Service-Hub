import React, { useState } from 'react';
import { Product, ProductSupportSubView } from '../../../types';
import FormWrapper from '../../../components/FormWrapper';
import BackButton from '../../../components/BackButton';
import { submitForm, processFiles } from '../../../services/formSubmissionService';
import { SpinnerIcon } from '../../../components/icons/SpinnerIcon';
import ProductSelector from './ProductSelector';
import MultiUploader from './MultiUploader';


interface ProductSupportFormProps {
    products: Product[];
    onBack: () => void;
    onSubmission: (msg: string) => void;
}

const ProductSupportForm: React.FC<ProductSupportFormProps> = ({ products, onBack, onSubmission }) => {
    const [subView, setSubView] = useState<ProductSupportSubView>('select');
    const [showNoInvoice, setShowNoInvoice] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [product, setProduct] = useState('');
    const [isOtherProduct, setIsOtherProduct] = useState(false);
    const [damagePhotos, setDamagePhotos] = useState<File[]>([]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const files = await processFiles(damagePhotos, 'file');
            
            await submitForm({
                formType: "Product Support",
                formData: data,
                files: files
            });
            onSubmission("Your support ticket has been submitted successfully. Our team will review the details and get back to you soon.");
        // FIX: Corrected a syntax error in the catch block. The `=>` is not valid here and was causing numerous parser errors.
        } catch (err) {
            setError("Failed to submit ticket. Please try again later.");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (subView === 'select') {
        return (
            <FormWrapper title="Product Support & Warranty">
                 <BackButton onClick={onBack} />
                 <div className="space-y-4">
                     <button onClick={() => setSubView('form')} className="w-full text-left p-4 border rounded-md hover:bg-gray-50 transition-colors">
                        <p className="font-semibold text-gray-800">My product is damaged or not working.</p>
                        <p className="text-sm text-gray-600">Proceed to file a report for a defective or damaged item.</p>
                     </button>
                      <button onClick={onBack} className="w-full text-left p-4 border rounded-md hover:bg-gray-50 transition-colors">
                        <p className="font-semibold text-gray-800">I need help with something else related to my product.</p>
                         <p className="text-sm text-gray-600">Please use the 'General Questions' form for other inquiries.</p>
                     </button>
                 </div>
            </FormWrapper>
        )
    }

    return (
        <FormWrapper 
            title="Product Issue Report" 
            intro="We're sorry you're experiencing an issue. Please provide the details below, and our team will get back to you shortly. To speed up the process, please be as detailed as possible."
        >
            <BackButton onClick={() => setSubView('select')} />
            <form onSubmit={handleSubmit} className="space-y-8">
                 {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">{error}</div>}
                <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <legend className="text-lg font-semibold text-gray-700 mb-2 col-span-full">Part 1: Your Information</legend>
                    <div><label className="block text-sm font-medium text-gray-700">Full Name</label><input name="fullName" type="text" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" /></div>
                    <div><label className="block text-sm font-medium text-gray-700">Email Address</label><input name="email" type="email" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" /></div>
                </fieldset>
                
                <fieldset className="space-y-4">
                    <legend className="text-lg font-semibold text-gray-700 mb-2">Part 2: Purchase Details</legend>
                     <div><label className="block text-sm font-medium text-gray-700">Order / Invoice Number</label><input name="invoiceNumber" type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" /></div>
                    <button type="button" onClick={() => setShowNoInvoice(!showNoInvoice)} className="text-sm text-indigo-600 hover:underline">Don't have your invoice number?</button>
                    {showNoInvoice && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-md bg-gray-50">
                            <div><label className="block text-sm font-medium text-gray-700">Last 4 Digits of Card</label><input name="last4Digits" type="text" pattern="\d{4}" title="Four digits" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" /></div>
                            <div><label className="block text-sm font-medium text-gray-700">Purchase Amount ($)</label><input name="purchaseAmount" type="number" step="0.01" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" /></div>
                            <div><label className="block text-sm font-medium text-gray-700">Date of Purchase</label><input name="purchaseDate" type="date" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" /></div>
                             <div><label className="block text-sm font-medium text-gray-700">Store of Purchase</label><input name="storeOfPurchase" type="text" placeholder="e.g., Acme.com, Amazon" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" /></div>
                        </div>
                    )}
                </fieldset>
                
                <fieldset className="space-y-4">
                    <legend className="text-lg font-semibold text-gray-700 mb-2">Part 3: Issue Details</legend>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Which product are you having an issue with?</label>
                        { isOtherProduct ? (
                            <input
                                name="product"
                                type="text"
                                value={product}
                                onChange={e => setProduct(e.target.value)}
                                required
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                placeholder="Please specify your product"
                            />
                        ) : (
                            <ProductSelector
                                products={products}
                                name="product"
                                value={product}
                                onChange={setProduct}
                                required
                            />
                        )}
                        <div className="mt-2">
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    checked={isOtherProduct}
                                    onChange={(e) => {
                                        setIsOtherProduct(e.target.checked);
                                        setProduct(''); // Clear selection on toggle
                                    }}
                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                                <span className="ml-2 text-sm text-gray-600">My product is not on the list</span>
                            </label>
                        </div>
                    </div>
                     <div><label className="block text-sm font-medium text-gray-700">Please describe the issue in detail.</label><textarea name="issueDescription" required rows={5} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea></div>
                    <MultiUploader 
                        name="damagePhotos"
                        label="Upload Photos of the Damage"
                        onChange={setDamagePhotos}
                        maxFiles={4}
                        description="Please upload up to 4 clear photos showing the issue."
                    />
                </fieldset>

                <div className="bg-gray-100 p-4 rounded-md text-sm text-gray-600 border border-gray-200">
                    <p><b>Please note:</b> Replacements are subject to our warranty and return policies. Our team will confirm all details and any potential costs with you before proceeding.</p>
                </div>
                
                <button type="submit" disabled={isSubmitting} className="w-full flex justify-center bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-700 disabled:bg-indigo-400">
                     {isSubmitting ? <SpinnerIcon /> : 'Submit Support Ticket'}
                </button>
            </form>
        </FormWrapper>
    );
};

export default ProductSupportForm;