
import React from 'react';
import { SpinnerIcon } from '../../../components/icons/SpinnerIcon';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    data: Record<string, any>;
    files?: File[];
    isSubmitting: boolean;
}

const formatLabel = (key: string) => {
  const result = key.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
};

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onConfirm, title, data, files, isSubmitting }) => {
    if (!isOpen) return null;

    const formatValue = (key: string, value: any): string => {
        if (key === 'purchaseAmount') {
            const amount = parseFloat(String(value));
            if (!isNaN(amount)) {
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }).format(amount);
            }
        }
        // Prettify checkbox values which are submitted as 'on'
        if (String(value) === 'on') {
            return 'Agreed';
        }
        return String(value);
    };

    // Filter out empty values and internal keys for file inputs, which are handled separately
    const displayData = Object.entries(data).filter(([key, value]) => {
        return value && !key.startsWith('receiptUpload') && !key.startsWith('damagePhotos');
    });

    const fileNames = files?.map(f => f.name).join(', ') || 'None';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" role="dialog" aria-modal="true" aria-labelledby="review-modal-title">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col m-4 dark:bg-gray-800">
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <h2 id="review-modal-title" className="text-xl font-bold text-gray-800 dark:text-gray-100">{title}</h2>
                    <button onClick={onClose} disabled={isSubmitting} className="p-1 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:text-gray-400 dark:hover:bg-gray-700" aria-label="Close review modal">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Please review the information below before submitting.</p>
                    <dl className="divide-y divide-gray-200 border border-gray-200 rounded-lg dark:divide-gray-700 dark:border-gray-700">
                        {displayData.map(([key, value]) => (
                            <div key={key} className="py-3 px-4 grid grid-cols-3 gap-4">
                                <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">{formatLabel(key)}</dt>
                                <dd className="text-sm text-gray-900 col-span-2 break-words dark:text-gray-100">{formatValue(key, value)}</dd>
                            </div>
                        ))}
                         {files && files.length > 0 && (
                            <div className="py-3 px-4 grid grid-cols-3 gap-4">
                                <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Files to Upload</dt>
                                <dd className="text-sm text-gray-900 col-span-2 dark:text-gray-100">{fileNames}</dd>
                            </div>
                        )}
                    </dl>
                </div>

                <div className="flex justify-end items-center p-4 border-t bg-gray-50 rounded-b-lg space-x-3 dark:bg-gray-900/50 dark:border-gray-700">
                    <button onClick={onClose} disabled={isSubmitting} type="button" className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:border-gray-600 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">
                        Edit
                    </button>
                    <button onClick={onConfirm} disabled={isSubmitting} type="button" className="inline-flex justify-center items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
                        {isSubmitting ? (
                           <>
                             <SpinnerIcon className="-ml-1 mr-3 h-5 w-5 text-white" />
                             Submitting...
                           </>
                        ) : 'Confirm & Submit'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;