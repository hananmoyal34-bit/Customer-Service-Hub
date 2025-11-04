
import React, { useState, useMemo } from 'react';
import { Product, ProductSupportSubView } from '../../../types';
import FormWrapper from '../../../components/FormWrapper';
import BackButton from '../../../components/BackButton';
import { submitForm, processFiles } from '../../../services/formSubmissionService';
import { SpinnerIcon } from '../../../components/icons/SpinnerIcon';
import ProductSelector from './ProductSelector';
import MultiUploader from './MultiUploader';
import ReviewModal from './ReviewModal';
import ProductUpgradeForm from './ProductUpgradeForm';


interface ProductSupportFormProps {
    products: Product[];
    onBack: () => void;
    onSubmission: (msg: string) => void;
}

const damageDetails: Record<string, Record<string, string>> = {
    'Charging Cases': {
        Broken: 'This refers to issues caused by external factors or customer handling. Examples: charging port is physically broken.',
        Damaged: 'This refers to manufacturer defects. Examples: not charging even though the port is intact, peeling color, battery burned out.'
    },
    'Headphones': {
        Broken: 'This refers to issues caused by external factors or customer handling. Examples: power button stuck, visible cracks, or foam torn.',
        Damaged: 'This refers to manufacturer defects. Examples: no sound output but no visible damage, not charging, or doesn’t connect to Bluetooth.'
    },
    'Scooter Luggage': {
        Broken: 'This refers to issues caused by external factors or customer handling. Examples: broken wheels or heavy cosmetic scratches from airline handling.',
        Damaged: 'This refers to manufacturer defects. Examples: looks new, no scratches, but doesn’t turn on, battery won’t charge, or lock not working.'
    },
    'Luggage': {
        Broken: 'This refers to issues caused by external factors or customer handling. Examples: broken wheels or heavy cosmetic scratches from airline handling.',
        Damaged: 'This refers to manufacturer defects where the product fails under normal use without signs of external damage.'
    }
};

const damageCategories = ['Charging Cases', 'Headphones', 'Scooter Luggage', 'Luggage'];

const ProductSupportForm: React.FC<ProductSupportFormProps> = ({ products, onBack, onSubmission }) => {
    const [subView, setSubView] = useState<ProductSupportSubView>('select');
    const [showNoInvoice, setShowNoInvoice] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [product, setProduct] = useState('');
    const [damagePhotos, setDamagePhotos] = useState<File[]>([]);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [formDataToReview, setFormDataToReview] = useState<Record<string, any>>({});
    const [damageCategory, setDamageCategory] = useState<string | null>(null);
    const [damageReason, setDamageReason] = useState<string | null>(null);

    const today = new Date().toISOString().split('T')[0];

    const { filteredProducts, productSelectorLabel } = useMemo(() => {
        let filtered = products;
        let label = "Which product are you having an issue with?";

        if (damageCategory) {
            label = `Which ${damageCategory} are you having an issue with?`;
            switch (damageCategory) {
                case 'Charging Cases':
                    filtered = products.filter(p => p.category === 'Power & Charging' && (p.subCategory === 'Charging Cases (Galaxy)' || p.subCategory === 'Charging Cases (iPhone)'));
                    break;
                case 'Headphones':
                    filtered = products.filter(p => p.category === 'Audio Devices' && p.subCategory === 'Headphones');
                    break;
                case 'Scooter Luggage':
                    filtered = products.filter(p => p.category === 'Mobility' && p.subCategory === 'General');
                    break;
                case 'Luggage':
                    filtered = products.filter(p => p.category === 'Luggage' && p.subCategory === 'General');
                    break;
            }
        }
        return { filteredProducts: filtered, productSelectorLabel: label };
    }, [damageCategory, products]);

    const handleReview = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        if (damageCategory) {
            data.productCategory = damageCategory;
        }
        if (damageReason) {
            data.damageReason = damageReason;
        }

        setFormDataToReview(data);
        setIsReviewModalOpen(true);
    };

    const handleConfirmSubmit = async () => {
        setIsSubmitting(true);
        setError(null);

        try {
            const files = await processFiles(damagePhotos, 'file');
            
            await submitForm({
                formType: "Product Support",
                formData: formDataToReview,
                files: files
            });
            onSubmission("Your support ticket has been submitted successfully. Our team will review the details and get back to you soon.");
        } catch (err) {
            setError("Failed to submit ticket. Please try again later.");
            console.error(err);
        } finally {
            setIsSubmitting(false);
            setIsReviewModalOpen(false);
        }
    };

    if (subView === 'select') {
        return (
            <FormWrapper title="Product Support">
                 <BackButton onClick={onBack} />
                 <div className="space-y-4">
                     <button type="button" onClick={() => setSubView('damageCategorySelect')} className="w-full text-left p-4 border rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <p className="font-semibold text-gray-800">My product is damaged or not working.</p>
                        <p className="text-sm text-gray-600">Proceed to file a report for a defective or damaged item.</p>
                     </button>
                     <button type="button" onClick={() => setSubView('upgrade')} className="w-full text-left p-4 border rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <p className="font-semibold text-gray-800">I want to upgrade my Charging Case.</p>
                        <p className="text-sm text-gray-600">Request information about upgrading your charging case to a newer model.</p>
                     </button>
                      <button type="button" onClick={onBack} className="w-full text-left p-4 border rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <p className="font-semibold text-gray-800">I need help with something else related to my product.</p>
                         <p className="text-sm text-gray-600">Please use the 'General Questions' form for other inquiries.</p>
                     </button>
                 </div>
            </FormWrapper>
        )
    }

    if (subView === 'upgrade') {
        return <ProductUpgradeForm products={products} onBack={() => setSubView('select')} onSubmission={onSubmission} />;
    }

    if (subView === 'damageCategorySelect') {
        return (
            <FormWrapper title="Select Product Category">
                <BackButton onClick={() => setSubView('select')} />
                <p className="text-gray-600 mb-6">What type of product are you having an issue with?</p>
                <div className="space-y-3">
                    {damageCategories.map(category => (
                        <button key={category} type="button" onClick={() => { setDamageCategory(category); setSubView('damageReasonSelect'); }} className="w-full text-left p-4 border rounded-md hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-700">
                            {category}
                        </button>
                    ))}
                    <button type="button" onClick={() => { setDamageCategory(null); setDamageReason(null); setSubView('form'); }} className="w-full text-left p-4 border rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-700">
                        Something Else
                    </button>
                </div>
            </FormWrapper>
        )
    }

    if (subView === 'damageReasonSelect' && damageCategory) {
        const details = damageDetails[damageCategory];
        return (
            <FormWrapper title={`Issue with your ${damageCategory}`}>
                <BackButton onClick={() => setSubView('damageCategorySelect')} />
                <p className="text-gray-600 mb-6">Please select the option that best describes the issue.</p>
                <div className="space-y-6">
                    <div className="p-5 border-2 border-gray-200 rounded-lg hover:border-indigo-400 transition-colors">
                        <h3 className="font-bold text-lg text-gray-900">Broken</h3>
                        <p className="text-gray-700 mt-1">{details.Broken}</p>
                        <button type="button" onClick={() => { setDamageReason('Broken'); setSubView('form'); }} className="mt-4 bg-indigo-600 text-white font-semibold py-2 px-5 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            This sounds right
                        </button>
                    </div>
                     <div className="p-5 border-2 border-gray-200 rounded-lg hover:border-indigo-400 transition-colors">
                        <h3 className="font-bold text-lg text-gray-900">Damaged</h3>
                        <p className="text-gray-700 mt-1">{details.Damaged}</p>
                        <button type="button" onClick={() => { setDamageReason('Damaged'); setSubView('form'); }} className="mt-4 bg-indigo-600 text-white font-semibold py-2 px-5 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                           This sounds right
                        </button>
                    </div>
                </div>
            </FormWrapper>
        )
    }
    
    if (subView === 'form') {
        const handleBackFromForm = () => {
            if (damageCategory) {
                setSubView('damageReasonSelect');
            } else {
                setSubView('damageCategorySelect');
            }
        };

        return (
            <>
                <FormWrapper 
                    title="Product Issue Report" 
                    intro="We're sorry you're experiencing an issue. Please provide the details below, and our team will get back to you shortly. To speed up the process, please be as detailed as possible."
                >
                    <BackButton onClick={handleBackFromForm} />
                    <form onSubmit={handleReview} className="space-y-8">
                        {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">{error}</div>}
                        <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <legend className="text-lg font-semibold text-gray-700 mb-2 col-span-full">Part 1: Your Information</legend>
                            <div><label className="block text-sm font-medium text-gray-700">First Name <span className="text-red-500">*</span></label><input name="firstName" type="text" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" /></div>
                            <div><label className="block text-sm font-medium text-gray-700">Last Name <span className="text-red-500">*</span></label><input name="lastName" type="text" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" /></div>
                            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700">Email Address <span className="text-red-500">*</span></label><input name="email" type="email" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" /></div>
                        </fieldset>
                        
                        <fieldset className="space-y-4">
                            <legend className="text-lg font-semibold text-gray-700 mb-2">Part 2: Purchase Details</legend>
                            <div><label className="block text-sm font-medium text-gray-700">Store Name <span className="text-red-500">*</span></label><input name="storeName" type="text" required placeholder="e.g., Main Street Store" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" /></div>
                            <div><label className="block text-sm font-medium text-gray-700">Order / Invoice Number {!showNoInvoice && <span className="text-red-500">*</span>}</label><input name="invoiceNumber" type="text" required={!showNoInvoice} disabled={showNoInvoice} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100" /></div>
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
                            <legend className="text-lg font-semibold text-gray-700 mb-2">Part 3: Issue Details</legend>
                             {damageCategory && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Product Category</label>
                                        <p className="mt-1 block w-full p-3 border border-gray-200 rounded-md bg-gray-100 text-gray-800">{damageCategory}</p>
                                    </div>
                                     <div>
                                        <label className="block text-sm font-medium text-gray-700">Type of Issue</label>
                                        <p className="mt-1 block w-full p-3 border border-gray-200 rounded-md bg-gray-100 text-gray-800">{damageReason}</p>
                                    </div>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">{productSelectorLabel} <span className="text-red-500">*</span></label>
                                <ProductSelector
                                    products={filteredProducts}
                                    name="product"
                                    value={product}
                                    onChange={(val) => typeof val === 'string' && setProduct(val)}
                                    required
                                />
                            </div>
                            <div><label className="block text-sm font-medium text-gray-700">Please describe the issue in detail (Ticket Notes) <span className="text-red-500">*</span></label><textarea name="ticketNotes" required rows={5} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea></div>
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
                            {isSubmitting ? <SpinnerIcon /> : 'Review & Submit Ticket'}
                        </button>
                    </form>
                </FormWrapper>
                <ReviewModal
                    isOpen={isReviewModalOpen}
                    onClose={() => setIsReviewModalOpen(false)}
                    onConfirm={handleConfirmSubmit}
                    title="Review Your Product Support Ticket"
                    data={formDataToReview}
                    files={damagePhotos}
                    isSubmitting={isSubmitting}
                />
            </>
        );
    }
    return null;
};

export default ProductSupportForm;
