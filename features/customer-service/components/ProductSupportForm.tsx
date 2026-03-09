

import React, { useState, useMemo } from 'react';
import { ProductSupportSubView } from '../../../types';
import FormWrapper from '../../../components/FormWrapper';
import BackButton from '../../../components/BackButton';
import { submitForm, processFiles } from '../../../services/formSubmissionService';
import { SpinnerIcon } from '../../../components/icons/SpinnerIcon';
import MultiUploader from './MultiUploader';
import ReviewModal from './ReviewModal';
import ProductUpgradeForm from './ProductUpgradeForm';


interface ProductSupportFormProps {
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

const ProductSupportForm: React.FC<ProductSupportFormProps> = ({ onBack, onSubmission }) => {
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

    const productSelectorLabel = useMemo(() => {
        if (damageCategory) {
            return `Which ${damageCategory} are you having an issue with?`;
        }
        return "Which product are you having an issue with?";
    }, [damageCategory]);

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
            <FormWrapper title="Product Support & Upgrades">
                 <BackButton onClick={onBack} />
                 <div className="space-y-4">
                     <button type="button" onClick={() => setSubView('damageCategorySelect')} className="w-full text-left p-4 border rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:hover:bg-gray-700">
                        <p className="font-semibold text-gray-800 dark:text-gray-200">My product is damaged or not working.</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Proceed to file a report for a defective or damaged item.</p>
                     </button>
                     <button type="button" onClick={() => setSubView('upgrade')} className="w-full text-left p-4 border rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:hover:bg-gray-700">
                        <p className="font-semibold text-gray-800 dark:text-gray-200">I want to upgrade my Charging Case.</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Request information about upgrading your charging case to a newer model.</p>
                     </button>
                      <button type="button" onClick={onBack} className="w-full text-left p-4 border rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:hover:bg-gray-700">
                        <p className="font-semibold text-gray-800 dark:text-gray-200">I need help with something else related to my product.</p>
                         <p className="text-sm text-gray-600 dark:text-gray-400">Please use the 'General Questions' form for other inquiries.</p>
                     </button>
                 </div>
            </FormWrapper>
        )
    }

    if (subView === 'upgrade') {
        return <ProductUpgradeForm onBack={() => setSubView('select')} onSubmission={onSubmission} />;
    }

    if (subView === 'damageCategorySelect') {
        return (
            <FormWrapper title="Select Product Category">
                <BackButton onClick={() => setSubView('select')} />
                <p className="text-gray-600 mb-6 dark:text-gray-300">What type of product are you having an issue with?</p>
                <div className="space-y-3">
                    {damageCategories.map(category => (
                        <button key={category} type="button" onClick={() => { setDamageCategory(category); setSubView('damageReasonSelect'); }} className="w-full text-left p-4 border rounded-md hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-700 dark:border-gray-700 dark:hover:bg-indigo-900/50 dark:text-gray-300">
                            {category}
                        </button>
                    ))}
                    <button type="button" onClick={() => { setDamageCategory(null); setDamageReason(null); setSubView('form'); }} className="w-full text-left p-4 border rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-700 dark:border-gray-700 dark:hover:bg-gray-700 dark:text-gray-300">
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
                <p className="text-gray-600 mb-6 dark:text-gray-300">Please select the option that best describes the issue.</p>
                <div className="space-y-6">
                    <div className="p-5 border-2 border-gray-200 rounded-lg hover:border-indigo-400 transition-colors dark:border-gray-700 dark:hover:border-indigo-500">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">Broken</h3>
                        <p className="text-gray-700 mt-1 dark:text-gray-300">{details.Broken}</p>
                        <button type="button" onClick={() => { setDamageReason('Broken'); setSubView('form'); }} className="mt-4 bg-indigo-600 text-white font-semibold py-2 px-5 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            This sounds right
                        </button>
                    </div>
                     <div className="p-5 border-2 border-gray-200 rounded-lg hover:border-indigo-400 transition-colors dark:border-gray-700 dark:hover:border-indigo-500">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">Damaged</h3>
                        <p className="text-gray-700 mt-1 dark:text-gray-300">{details.Damaged}</p>
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
                        {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900/50 dark:text-red-300" role="alert">{error}</div>}
                        <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <legend className="text-lg font-semibold text-gray-700 mb-2 col-span-full dark:text-gray-300">Part 1: Your Information</legend>
                            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name <span className="text-red-500">*</span></label><input name="firstName" type="text" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name <span className="text-red-500">*</span></label><input name="lastName" type="text" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" /></div>
                            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address <span className="text-red-500">*</span></label><input name="email" type="email" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" /></div>
                        </fieldset>
                        
                        <fieldset className="space-y-4">
                            <legend className="text-lg font-semibold text-gray-700 mb-2 dark:text-gray-300">Part 2: Purchase Details</legend>
                            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Store Name <span className="text-red-500">*</span></label><input name="storeName" type="text" required placeholder="e.g., Main Street Store" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" /></div>
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
                                <input id="invoiceNumber" name="invoiceNumber" type="tel" pattern="[0-9]*" onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }} title="Please enter only numbers for the invoice number." required={!showNoInvoice} disabled={showNoInvoice} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:disabled:bg-gray-600" />
                            </div>
                            <button type="button" onClick={() => setShowNoInvoice(!showNoInvoice)} className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">Don't have your invoice number?</button>
                            {showNoInvoice && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-md bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600">
                                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last 4 Digits of Card <span className="text-red-500">*</span></label><input name="last4Digits" type="text" pattern="\d{4}" maxLength={4} title="Four digits" required={showNoInvoice} className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Purchase Amount ($) <span className="text-red-500">*</span></label><input name="purchaseAmount" type="number" step="0.01" required={showNoInvoice} className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date of Purchase <span className="text-red-500">*</span></label><input name="purchaseDate" type="date" required={showNoInvoice} className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" max={today} /></div>
                                </div>
                            )}
                        </fieldset>
                        
                        <fieldset className="space-y-4">
                            <legend className="text-lg font-semibold text-gray-700 mb-2 dark:text-gray-300">Part 3: Issue Details</legend>
                             {damageCategory && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product Category</label>
                                        <p className="mt-1 block w-full p-3 border border-gray-200 rounded-md bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">{damageCategory}</p>
                                    </div>
                                     <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type of Issue</label>
                                        <p className="mt-1 block w-full p-3 border border-gray-200 rounded-md bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">{damageReason}</p>
                                    </div>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{productSelectorLabel} <span className="text-red-500">*</span></label>
                                <input
                                    name="product"
                                    type="text"
                                    value={product}
                                    onChange={(e) => setProduct(e.target.value)}
                                    required
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    placeholder="Enter product name (e.g., SuperWidget Model X)"
                                />
                            </div>
                            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Please describe the issue in detail (Ticket Notes) <span className="text-red-500">*</span></label><textarea name="ticketNotes" required rows={5} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"></textarea></div>
                            <MultiUploader 
                                name="damagePhotos"
                                label="Upload Photos of the Damage"
                                onChange={setDamagePhotos}
                                maxFiles={4}
                                description="Please upload up to 4 clear photos showing the issue."
                            />
                        </fieldset>

                        <div className="bg-gray-100 p-4 rounded-md text-sm text-gray-600 border border-gray-200 dark:bg-gray-900/50 dark:text-gray-400 dark:border-gray-700">
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