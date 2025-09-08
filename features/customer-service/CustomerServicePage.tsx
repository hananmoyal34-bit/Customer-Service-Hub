
import React, { useState, useEffect } from 'react';
import { Product, View } from '../../types';
import { getProducts } from '../../services/dataService';
import SuccessMessage from '../../components/SuccessMessage';
import ProductSupportForm from './components/ProductSupportForm';
import ShippingInquiryForm from './components/ShippingInquiryForm';
import SalesInquiryInfo from './components/SalesInquiryInfo';
import WarrantyRegistrationForm from './components/WarrantyRegistrationForm';
import GeneralQuestionsForm from './components/GeneralQuestionsForm';
import RequestCallbackForm from './components/RequestCallbackForm';
import MainView from './MainView';
import { SpinnerIcon } from '../../components/icons/SpinnerIcon';

const CustomerServicePage: React.FC = () => {
  const [view, setView] = useState<View>('main');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductsData = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products for customer service:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchProductsData();
  }, []);

  const handleSubmission = (message: string) => {
      setSubmissionMessage(message);
      setView('main');
  };

  const resetView = () => {
      setSubmissionMessage(null);
      setView('main');
  }

  const renderContent = () => {
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                <p className="ml-4 text-gray-600">Loading essential data...</p>
            </div>
        );
    }
    
    if (submissionMessage) {
        return <SuccessMessage message={submissionMessage} onReset={resetView} />
    }

    switch(view) {
        case 'productSupport':
            return <ProductSupportForm products={products} onBack={() => setView('main')} onSubmission={handleSubmission} />;
        case 'shippingInquiry':
            return <ShippingInquiryForm onBack={() => setView('main')} onSubmission={handleSubmission} />;
        case 'salesInquiry':
            return <SalesInquiryInfo onBack={() => setView('main')} />;
        case 'warrantyRegistration':
            return <WarrantyRegistrationForm products={products} onBack={() => setView('main')} onSubmission={handleSubmission} />;
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
