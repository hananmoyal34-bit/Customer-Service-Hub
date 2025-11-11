
// This is a new Netlify serverless function to fetch product data from the Google Sheet.
// It calls the same Google Apps Script as the form submission service but with a different action.
// The file should be placed at `netlify/functions/get-products.js`.

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxqwgllT5UqBonhDAKiqUGF6UlLm1ZGDR1EAzvV5mx0qid2y-eQ6wR3sTX-LpW3xDAO/exec'; // This should be the same URL as in formSubmissionService.ts

export default async (req, context) => {
    if (!APPS_SCRIPT_URL) {
        return new Response(JSON.stringify({ error: "Server configuration error: Google Apps Script URL not found." }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const url = `${APPS_SCRIPT_URL}?action=getProducts`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorBody = await response.text();
            console.error("Google Apps Script Error:", errorBody);
            throw new Error("Failed to fetch from Google Apps Script.");
        }
        
        const result = await response.json();

        // The Google Apps Script for products returns a structured object.
        // We check for the expected structure from the Apps Script.
        if (result.status !== 'success' || !Array.isArray(result.data)) {
             console.warn("No product data received from the backend or data is in an invalid format.", result);
             return new Response(JSON.stringify([]), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // The data from the backend is already in the { Item, Color, Category, SubCategory } format.
        // We just need to map it to our frontend's Product type.
        const products = result.data.map((rawProduct, index) => ({
            productID: `p${String(index + 1).padStart(3, '0')}`,
            productName: rawProduct.Item || '',
            colors: rawProduct.Color || '',
            category: rawProduct.Category || '',
            subCategory: rawProduct.SubCategory || 'General', // Default to 'General'
        })).filter(p => p.productName && p.category); // Filter out any invalid rows (must have name and category)

        return new Response(JSON.stringify(products), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error("Error in get-products Netlify function:", error);
        return new Response(JSON.stringify({ error: "An internal server error occurred while fetching products." }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
