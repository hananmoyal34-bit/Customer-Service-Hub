// This is a Netlify serverless function that acts as a secure proxy to the Gemini API.
// It reads the API key from server-side environment variables, preventing it from being exposed in the browser.
// The file should be placed at `netlify/functions/gemini.js`.

const routingSchema = {
    type: 'OBJECT',
    properties: {
        best_match: {
            type: 'STRING',
            description: "The best matching category for the user's query.",
            enum: ['main', 'productSupport', 'salesInquiry', 'warrantyRegistration', 'general', 'requestCallback', 'shippingInquiry']
        }
    },
    required: ['best_match']
};

// Netlify's default export handler for serverless functions
export default async (req, context) => {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
            status: 405,
            headers: { 'Content-Type': 'application/json', 'Allow': 'POST' }
        });
    }

    try {
        const { query } = await req.json();
        const apiKey = process.env.API_KEY;

        if (!apiKey) {
            console.error("API_KEY environment variable not set in Netlify.");
            return new Response(JSON.stringify({ error: "Server configuration error: API key not found." }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (!query || typeof query !== 'string' || query.trim() === '') {
            return new Response(JSON.stringify({ error: "Query is required and must be a non-empty string." }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // Using v1beta as it supports responseSchema for JSON mode
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const prompt = `A customer has the following query: "${query}". Based on this, which of the following customer service categories is the most appropriate? The categories are: 'productSupport', 'salesInquiry', 'warrantyRegistration', 'general', 'requestCallback', 'shippingInquiry'. Only respond with the single best matching category key.`;

        const payload = {
            contents: [{
                parts: [{ text: prompt }]
            }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: routingSchema
            }
        };

        const geminiResponse = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!geminiResponse.ok) {
            const errorBody = await geminiResponse.text();
            console.error("Gemini API Error:", errorBody);
            return new Response(JSON.stringify({ error: "Failed to get a valid response from AI service." }), { 
                status: geminiResponse.status,
                headers: { 'Content-Type': 'application/json' }
             });
        }

        const data = await geminiResponse.json();
        
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!jsonText) {
            console.error("Unexpected response structure from Gemini API:", JSON.stringify(data));
            throw new Error("Could not find text in Gemini response.");
        }

        // The text part itself is a JSON string which needs to be parsed.
        const result = JSON.parse(jsonText);

        return new Response(JSON.stringify(result), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error("Error in Netlify function:", error);
        return new Response(JSON.stringify({ error: "An internal server error occurred." }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
