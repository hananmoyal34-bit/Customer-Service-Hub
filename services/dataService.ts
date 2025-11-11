import { Product } from '../types';

// Fetches product data from a secure Netlify serverless function.
// This function acts as a proxy to the Google Apps Script backend,
// hiding the direct URL from the client.
export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch('/.netlify/functions/get-products');

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend error fetching products:", response.status, errorText);
        throw new Error(`Failed to fetch products. Status: ${response.status}`);
    }

    // The Netlify function returns an array of fully-formed Product objects.
    const products: Product[] = await response.json();

    if (!Array.isArray(products)) {
        const errorMessage = 'Data is not in the expected format.';
        console.error("Invalid response format from backend:", products);
        throw new Error(`Invalid response from backend: ${errorMessage}`);
    }
            
    return products;
  } catch (error) {
    console.error("Failed to fetch and parse products from the backend:", error);
    // Re-throw the error to be caught by the calling component.
    throw error;
  }
};
