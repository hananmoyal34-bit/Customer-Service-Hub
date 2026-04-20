
import React, { ReactNode } from 'react';

interface ServiceCardProps {
    title: string;
    description: string;
    onClick?: () => void;
    href?: string;
    icon?: ReactNode;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, onClick, href, icon }) => {
    const defaultIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5 text-neutral-500" style={{ strokeWidth: 1.5 }}>
            <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
        </svg>
    );

    const innerContent = (
        <div className="relative z-10 w-full h-full rounded-[14.5px] bg-white dark:bg-[#121212] p-5 flex flex-col justify-start transition-colors duration-300">
            <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-md bg-neutral-900/5 dark:bg-white/10 ring-1 ring-neutral-900/10 dark:ring-white/10 flex items-center justify-center transition-colors">
                    {icon || defaultIcon}
                </div>
                <div className="text-base font-medium text-neutral-900 dark:text-white transition-colors">{title}</div>
            </div>
            <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300 transition-colors">
                {description}
            </p>
            <div className="mt-auto pt-4 flex items-center gap-2 text-luxury-amber dark:text-luxury-amber text-sm font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                <span>Select option</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" style={{ strokeWidth: 1.5 }}>
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                </svg>
            </div>
        </div>
    );

    const commonStructure = (
        <>
            {/* Spinning Gradient Border Layer (shows up smoothly upon hover) */}
            <span className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_60%,#b48a47_100%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
            
            {/* Default Border Mask (disappears upon hover) */}
            <span className="absolute inset-0 bg-neutral-200 dark:bg-white/10 transition-opacity duration-300 group-hover:opacity-0 pointer-events-none" />

            {innerContent}
        </>
    );

    const outerClasses = "group relative w-full h-full flex flex-col p-[1.5px] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-luxury-amber focus-visible:ring-offset-2 dark:focus-visible:ring-offset-luxury-950 shadow-sm hover:shadow-[0_10px_35px_-5px_rgba(180,138,71,0.2)] dark:shadow-none dark:hover:shadow-[0_0_25px_rgba(180,138,71,0.15)] bg-white dark:bg-luxury-950";

    if (href) {
        return (
            <a href={href} className={outerClasses} aria-label={`Go to ${title}`}>
                {commonStructure}
            </a>
        );
    }

    return (
        <button onClick={onClick} className={outerClasses} aria-label={`Select ${title}`}>
            {commonStructure}
        </button>
    );
};

export default ServiceCard;