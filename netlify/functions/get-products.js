// This Netlify serverless function fetches product data from the Google Sheet.
// It calls the Google Apps Script, which is now expected to return a direct
// array of product objects.

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

        // The updated script returns a direct array of objects in the `data` property.
        if (result.status !== 'success' || !Array.isArray(result.data)) {
             console.error("Invalid data structure from Google Apps Script. Expected { data: [...] }", result);
             // Return empty array to prevent frontend from crashing
             return new Response(JSON.stringify([]), { headers: { 'Content-Type': 'application/json' } });
        }

        const rawProducts = result.data;

        const products = rawProducts.map((rawProduct, index) => {
            // Map the properties from the Google Sheet column names to the application's Product type.
            // Example mapping: 'Items' -> 'productName', 'Sub-Category' -> 'subCategory'
            const productName = rawProduct.Items || '';
            const category = rawProduct.Category || '';

            // Skip any rows that are missing essential data.
            if (!productName || !category) {
                return null;
            }

            return {
                productID: `p${String(index + 1).padStart(3, '0')}`,
                productName: productName,
                colors: rawProduct.Colors || '',
                category: category,
                subCategory: rawProduct['Sub-Category'] || 'General',
                lowStockThreshold: Number(rawProduct['Low Stock Threshold']) || 0,
            };
        }).filter(p => p !== null); // Filter out any invalid rows

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
