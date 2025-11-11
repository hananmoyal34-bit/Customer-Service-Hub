
import { Product } from '../types';

// This URL points to the Google Apps Script that retrieves product data from the spreadsheet.
// It's the same public endpoint used by the form submission service.
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxqwgllT5UqBonhDAKiqUGF6UlLm1ZGDR1EAzvV5mx0qid2y-eQ6wR3sTX-LpW3xDAO/exec';

// This interface defines the shape of the raw product data returned by the Google Apps Script.
// The backend script returns keys like 'Item', 'Color', and 'SubCategory'.
interface RawProductFromAPI {
  Item: string;
  Color: string;
  Category: string;
  SubCategory: string;
}

export const getProducts = async (): Promise<Product[]> => {
  if (!APPS_SCRIPT_URL) {
    const errorMessage = "Backend service is not configured. Please set the APPS_SCRIPT_URL in dataService.";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  const url = `${APPS_SCRIPT_URL}?action=getProducts`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend error fetching products from Google Apps Script:", response.status, errorText);
        throw new Error(`Failed to fetch products. Status: ${response.status}`);
    }

    const result = await response.json();

    if (result.status === 'success' && Array.isArray(result.data)) {
        const rawProducts: RawProductFromAPI[] = result.data;
        
        const products: Product[] = rawProducts
            .map((rawProduct, index) => {
                // Ensure the essential properties, Item (product name) and Category, exist.
                if (!rawProduct.Item || !rawProduct.Category) {
                    console.warn(`Skipping malformed product data at index ${index}:`, rawProduct);
                    return null;
                }
                return {
                    productID: `p${String(index + 1).padStart(3, '0')}`,
                    productName: rawProduct.Item,
                    colors: rawProduct.Color || '',
                    category: rawProduct.Category,
                    // Default to 'General' if SubCategory is missing or empty.
                    subCategory: rawProduct.SubCategory || 'General',
                };
            })
            .filter((p): p is Product => p !== null); // Filter out any null entries that resulted from malformed data.
            
        return products;
    } else {
        const errorMessage = result.message || 'Data is not in the expected format.';
        console.error("Invalid response format from backend:", errorMessage);
        throw new Error(`Invalid response from backend: ${errorMessage}`);
    }
  } catch (error) {
    console.error("Failed to fetch and parse products from the backend:", error);
    // Re-throw the error to be caught by the calling component.
    throw error;
  }
};
