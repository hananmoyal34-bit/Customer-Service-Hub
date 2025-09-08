import React, { useState, useRef, useCallback } from 'react';

interface MultiUploaderProps {
    onChange: (files: File[]) => void;
    maxFiles?: number;
    name: string;
    label: string;
    description?: string;
}

const MultiUploader: React.FC<MultiUploaderProps> = ({ onChange, maxFiles = 4, name, label, description }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(event.target.files || []);
        if (newFiles.length === 0) return;

        if (files.length + newFiles.length > maxFiles) {
            setError(`You can only upload a maximum of ${maxFiles} files.`);
            if (event.target) event.target.value = '';
            return;
        }

        const updatedFiles = [...files, ...newFiles];
        setFiles(updatedFiles);
        onChange(updatedFiles);
        setError(null);
        if (event.target) event.target.value = ''; // Reset for re-selection of the same file
    }, [files, maxFiles, onChange]);

    const handleRemoveFile = (indexToRemove: number) => {
        const updatedFiles = files.filter((_, index) => index !== indexToRemove);
        setFiles(updatedFiles);
        onChange(updatedFiles);
        if (updatedFiles.length < maxFiles) {
            setError(null);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                name={name}
            />
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600 justify-center">
                        <button
                            type="button"
                            onClick={triggerFileInput}
                            disabled={files.length >= maxFiles}
                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                            <span>Add files</span>
                        </button>
                    </div>
                    {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
                </div>
            </div>
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            
            {files.length > 0 && (
                <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Selected files ({files.length}/{maxFiles}):</p>
                    <ul className="divide-y divide-gray-200 border rounded-md" role="list">
                        {files.map((file, index) => (
                            <li key={index} className="px-3 py-2 flex items-center justify-between text-sm">
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-800 truncate">{file.name}</p>
                                    <p className="text-gray-500">({(file.size / 1024).toFixed(2)} KB)</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveFile(index)}
                                    className="ml-4 p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    aria-label={`Remove ${file.name}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MultiUploader;
