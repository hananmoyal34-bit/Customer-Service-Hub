import { View } from '../types';

// This service now calls our secure Netlify function instead of the Gemini API directly.
export const getSuggestedService = async (query: string): Promise<View | null> => {
    try {
        const response = await fetch('/.netlify/functions/gemini', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });

        if (!response.ok) {
            console.error("Error calling backend function:", response.status, await response.text());
            return null;
        }

        const result = await response.json();
        
        if (!result.best_match) {
            console.error("Invalid response from backend function:", result);
            return null;
        }

        return result.best_match as View;

    } catch (error) {
        console.error("Failed to fetch from the backend function:", error);
        return null;
    }
};
