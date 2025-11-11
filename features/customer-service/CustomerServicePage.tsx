import React, { useState } from 'react';
import { View } from '../../types';
import SuccessMessage from '../../components/SuccessMessage';
import ProductSupportForm from './components/ProductSupportForm';
import ShippingInquiryForm from './components/ShippingInquiryForm';
import SalesInquiryInfo from './components/SalesInquiryInfo';
import WarrantyRegistrationForm from './components/WarrantyRegistrationForm';
import GeneralQuestionsForm from './components/GeneralQuestionsForm';
import RequestCallbackForm from './components/RequestCallbackForm';
import MainView from './MainView';

const CustomerServicePage: React.FC = () => {
  const [view, setView] = useState<View>('main');
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);

  const handleSubmission = (message: string) => {
      setSubmissionMessage(message);
      setView('main');
  };

  const resetView = () => {
      setSubmissionMessage(null);
      setView('main');
  }

  const renderContent = () => {
    if (submissionMessage) {
        return <SuccessMessage message={submissionMessage} onReset={resetView} />
    }

    switch(view) {
        case 'productSupport':
            return <ProductSupportForm onBack={() => setView('main')} onSubmission={handleSubmission} />;
        case 'shippingInquiry':
            return <ShippingInquiryForm onBack={() => setView('main')} onSubmission={handleSubmission} />;
        case 'salesInquiry':
            return <SalesInquiryInfo onBack={() => setView('main')} />;
        case 'warrantyRegistration':
            return <WarrantyRegistrationForm onBack={() => setView('main')} onSubmission={handleSubmission} />;
        case 'general':
            return <GeneralQuestionsForm onBack={() => setView('main')} onSubmission={handleSubmission} />;
        case 'requestCallback':
            return <RequestCallbackForm onBack={() => setView('main')} onSubmission={handleSubmission} />;
        case 'main':
        default:
            return <MainView setView={setView} />;
    }
  };

  return <div>{renderContent()}</div>;
};

export default CustomerServicePage;