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
        
        const data = await response.json();

        // Expects a 2D array from Google Sheets. First row is headers.
        if (!Array.isArray(data) || data.length < 2) {
             console.warn("No product data received from the spreadsheet or sheet is empty.");
             return new Response(JSON.stringify([]), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const headers = data[0].map(h => h.toString().trim().toLowerCase());
        const itemIndex = headers.indexOf('items');
        const colorsIndex = headers.indexOf('colors');
        const categoryIndex = headers.indexOf('category');
        const subCategoryIndex = headers.indexOf('sub-category');

        if (itemIndex === -1 || categoryIndex === -1 || subCategoryIndex === -1) {
            const errorMessage = `Missing required columns in 'Products' sheet. Expected 'Items', 'Category', 'Sub-Category', but got: ${headers.join(', ')}`;
            console.error(errorMessage);
            return new Response(JSON.stringify({ error: "Invalid data structure from source. " + errorMessage}), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const products = data.slice(1).map((row, index) => ({
            productID: `p${String(index + 1).padStart(3, '0')}`,
            productName: row[itemIndex] || '',
            colors: row[colorsIndex] || '',
            category: row[categoryIndex] || '',
            subCategory: row[subCategoryIndex] || '',
        })).filter(p => p.productName && p.category && p.subCategory); // Filter out any invalid rows

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
