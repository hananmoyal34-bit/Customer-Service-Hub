// This service is responsible for fetching product data from the backend.

// The same URL used for form submissions, now also used for fetching data.
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxqwgllT5UqBonhDAKiqUGF6UlLm1ZGDR1EAzvV5mx0qid2y-eQ6wR3sTX-LpW3xDAO/exec';

interface ProductDataResponse {
    headers: string[];
    rows: string[][];
}

// A structured catalog where each product name maps to a list of its available colors.
export type ProductCatalog = Record<string, string[]>;


/**
 * Fetches the list of available products from the Google Apps Script backend
 * and structures it into a catalog.
 * @returns A promise that resolves to a ProductCatalog object.
 */
export const getProducts = async (): Promise<ProductCatalog> => {
    // Construct a GET request with the 'action' parameter the backend expects.
    const url = `${APPS_SCRIPT_URL}?action=getProducts`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error calling Google Apps Script for products:", response.status, errorText);
            throw new Error(`Failed to fetch products. Server responded with ${response.status}`);
        }

        const result: { status: string; data: ProductDataResponse } = await response.json();
        
        if (result.status !== 'success' || !result.data || !Array.isArray(result.data.headers) || !Array.isArray(result.data.rows)) {
             console.error("Invalid response from Google Apps Script for products:", result);
             throw new Error("Received an invalid format for the product list from the server.");
        }

        const { headers, rows } = result.data;
        
        const itemsIndex = headers.indexOf('Items');
        const colorsIndex = headers.indexOf('Colors');

        if (itemsIndex === -1 || colorsIndex === -1) {
            console.error("Required 'Items' or 'Colors' columns not found in product data headers:", headers);
            throw new Error("Product data is missing required columns.");
        }

        // Process the rows and headers to create a structured product catalog.
        // This groups all available colors under a single product item,
        // splitting comma-separated color strings from the sheet.
        const catalog = rows.reduce<ProductCatalog>((acc, row) => {
            const item = row[itemsIndex]?.trim();
            const colorsString = row[colorsIndex]?.trim();

            if (item && colorsString) {
                if (!acc[item]) {
                    acc[item] = [];
                }
                // Split comma-separated colors, trim whitespace, and filter out any empty strings.
                const newColors = colorsString.split(',').map(c => c.trim()).filter(Boolean);
                
                // Use a Set to ensure uniqueness and merge with any existing colors for the same item.
                const colorSet = new Set([...acc[item], ...newColors]);
                acc[item] = Array.from(colorSet);
            }
            return acc;
        }, {});

        return catalog;

    } catch (error) {
        console.error("Failed to fetch products from Google Apps Script:", error);
        // Re-throw the error so the calling component can handle it.
        throw error;
    }
};