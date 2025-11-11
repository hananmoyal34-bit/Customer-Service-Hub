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

        // The original script returns a structured object { headers: [], rows: [] }.
        // We need to parse this into an array of product objects.
        if (result.status !== 'success' || !result.data || !Array.isArray(result.data.headers) || !Array.isArray(result.data.rows)) {
             console.error("Invalid data structure from Google Apps Script. Expected { data: { headers: [...], rows: [...] } }", result);
             // Return empty array to prevent frontend from crashing
             return new Response(JSON.stringify([]), { headers: { 'Content-Type': 'application/json' } });
        }

        const { headers, rows } = result.data;

        // Find the index of each column. This makes the mapping robust to column reordering.
        const headerMap = {
            items: headers.indexOf('Items'),
            colors: headers.indexOf('Colors'),
            category: headers.indexOf('Category'),
            subCategory: headers.indexOf('Sub-Category'),
            lowStock: headers.indexOf('Low Stock Threshold')
        };

        // Check if essential headers are present
        if (headerMap.items === -1 || headerMap.category === -1) {
            console.error("Essential columns 'Items' or 'Category' not found in Products sheet.", headers);
            return new Response(JSON.stringify([]), { headers: { 'Content-Type': 'application/json' } });
        }

        const products = rows.map((row, index) => {
            const productName = row[headerMap.items] || '';
            const category = row[headerMap.category] || '';

            // Only create a product object if it has the minimum required data
            if (!productName || !category) {
                return null;
            }

            return {
                productID: `p${String(index + 1).padStart(3, '0')}`,
                productName: productName,
                colors: headerMap.colors > -1 ? row[headerMap.colors] || '' : '',
                category: category,
                subCategory: headerMap.subCategory > -1 ? row[headerMap.subCategory] || 'General' : 'General',
                lowStockThreshold: headerMap.lowStock > -1 ? Number(row[headerMap.lowStock]) || 0 : 0,
            };
        }).filter(p => p !== null); // Filter out any null entries from invalid rows

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