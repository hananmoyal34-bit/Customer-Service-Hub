import React, { useState } from 'react';
import BackButton from '../../components/BackButton';

interface FAQPageProps {
    onBack: () => void;
}

interface FAQItemProps {
    question: string;
    answer: React.ReactNode;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-neutral-200 dark:border-white/10 py-5">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-luxury-amber rounded-md"
                aria-expanded={isOpen}
            >
                <span className="text-base font-medium text-neutral-900 dark:text-white transition-colors">{question}</span>
                <span className="ml-6 flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 dark:bg-white/5 transition-colors">
                    <svg
                        className={`h-4 w-4 text-neutral-600 dark:text-neutral-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
            </button>
            <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
            >
                <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed transition-colors">
                    {answer}
                </p>
            </div>
        </div>
    );
};

const FAQPage: React.FC<FAQPageProps> = ({ onBack }) => {
    const faqs = [
        {
            question: "Do you offer refunds on purchases?",
            answer: "No, we strictly have a no-refund policy. We only offer exchanges for defective or damaged items based on our warranty terms and conditions."
        },
        {
            question: "Is there a fee for exchanging a damaged item?",
            answer: "If the damage is caused by external factors or customer handling (e.g., physical breakage like a snapped charging port, cracked luggage), a restocking fee is required (e.g., $27.08 for charging cases, $32.50 for headphones). If our technicians determine it is a manufacturing defect, the replacement is generally free of charge."
        },
        {
            question: "How do I claim a warranty replacement?",
            answer: "To claim a replacement, please submit a 'Product Support' ticket via the main page. You will need to provide photos or videos of the issue, alongside your purchase confirmation (store name, transaction date, or receipt). We will inspect the items, notify you of any required restocking fees, and generate your replacement."
        },
        {
            question: "My Apex battery case stopped charging my phone. What should I do?",
            answer: "First, inspect the USB-C / Lightning port to ensure it's not physically broken or bent. If the port is damaged, you will need to pay the restocking fee for a replacement. If it looks brand new but refuses to charge, submit a ticket so we can inspect it for an internal manufacturer defect."
        },
        {
            question: "Are shipping costs covered for exchanges?",
            answer: "Customers are typically required to cover their own shipping costs when returning damaged items to our facility for inspection. Once the restocking fee or warranty claim is satisfied, we will ship the replacement out to you and provide tracking."
        },
        {
            question: "I received the wrong item in my box (or a display model), how do I get it fixed?",
            answer: "Please reach out to us using the 'Request a Callback' or 'Product Support' options. Provide the details of your purchase, and we will verify with the original salesperson and ship you the correct item immediately to correct the mistake."
        }
    ];

    return (
        <div className="w-full relative min-h-screen pb-24">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-24 sm:pt-32">
                <div className="mb-8">
                    <BackButton onClick={onBack} label="Back to Hub" />
                </div>
                
                <div className="mb-12">
                    <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-3 transition-colors">Frequently Asked Questions</h1>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400 transition-colors">
                        Find answers to our most common customer service topics.
                    </p>
                </div>

                <div className="bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-neutral-200 dark:border-white/10 p-2 sm:p-4 transition-colors duration-300">
                    <div className="px-4 sm:px-6">
                        {faqs.map((faq, index) => (
                            <FAQItem key={index} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>
                </div>
                
                <div className="mt-12 text-center">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 transition-colors">Still have questions?</p>
                    <button 
                        onClick={onBack}
                        className="inline-flex items-center justify-center rounded-full bg-luxury-amber hover:bg-amber-500 text-luxury-950 font-medium px-6 py-2.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-luxury-amber dark:focus-visible:ring-offset-luxury-950 shadow-sm"
                    >
                        Submit a Ticket
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FAQPage;
