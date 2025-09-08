
import React from 'react';
import FormWrapper from '../../../components/FormWrapper';
import BackButton from '../../../components/BackButton';

interface SalesInquiryInfoProps {
    onBack: () => void;
}

const SalesInquiryInfo: React.FC<SalesInquiryInfoProps> = ({ onBack }) => (
    <FormWrapper title="Purchase More Products">
        <BackButton onClick={onBack} />
        <div className="prose max-w-none text-gray-600">
            <p>For all new orders, inquiries about bulk pricing, or questions about our product line, our dedicated sales team is here to help.</p>
            <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800">Sales Department Contact</h3>
                <p className="mt-2"><strong>Email:</strong> <a href="mailto:sales@acme.com" className="text-indigo-600 underline">sales@acme.com</a></p>
                <p><strong>Phone:</strong> <a href="tel:+18005557253" className="text-indigo-600 underline">1-800-555-SALE (7253)</a></p>
            </div>
            <div className="mt-4">
                <p className="font-semibold">Business Hours:</p>
                <p>Monday - Friday, 9:00 AM - 5:00 PM (PST)</p>
            </div>
        </div>
    </FormWrapper>
);

export default SalesInquiryInfo;
