
import { GoogleGenAI, Type } from "@google/genai";
import { View } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const routingSchema = {
    type: Type.OBJECT,
    properties: {
        best_match: {
            type: Type.STRING,
            description: "The best matching category for the user's query.",
            enum: ['main', 'productSupport', 'salesInquiry', 'warrantyRegistration', 'general', 'requestCallback', 'shippingInquiry']
        }
    },
    required: ['best_match']
};

export const getSuggestedService = async (query: string): Promise<View | null> => {
    if (!process.env.API_KEY) {
        return null;
    }
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `A customer has the following query: "${query}". Based on this, which of the following customer service categories is the most appropriate? The categories are: 'productSupport', 'salesInquiry', 'warrantyRegistration', 'general', 'requestCallback', 'shippingInquiry'. Only respond with the single best matching category key.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: routingSchema
            }
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        
        return result.best_match as View;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return null;
    }
};
