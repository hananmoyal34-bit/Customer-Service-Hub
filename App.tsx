
import React from 'react';
import CustomerServicePage from './features/customer-service/CustomerServicePage';
import Header from './components/Header';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Header />
      <main className="py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
        <CustomerServicePage />
      </main>
      <Footer />
    </div>
  );
};

export default App;
