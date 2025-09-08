import { Product } from '../types';

// This URL points to the Google Apps Script that retrieves product data from the spreadsheet.
// It's the same public endpoint used by the form submission service.
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxqwgllT5UqBonhDAKiqUGF6UlLm1ZGDR1EAzvV5mx0qid2y-eQ6wR3sTX-LpW3xDAO/exec';

export const getProducts = async (): Promise<Product[]> => {
  try {
    // We fetch directly from the Google Apps Script, bypassing the Netlify function.
    const url = `${APPS_SCRIPT_URL}?action=getProducts`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error("Backend error fetching products from Google Apps Script:", response.status, await response.text());
      return [];
    }

    const data = await response.json();

    // The data from the script is a 2D array (rows from the sheet).
    // We need to parse it into structured Product objects.
    if (!Array.isArray(data) || data.length < 2) {
      console.warn("No product data received from the spreadsheet or sheet is empty.");
      return [];
    }

    const headers = data[0].map((h: any) => String(h).trim().toLowerCase());
    const itemIndex = headers.indexOf('items');
    const colorsIndex = headers.indexOf('colors');
    const categoryIndex = headers.indexOf('category');
    const subCategoryIndex = headers.indexOf('sub-category');

    if (itemIndex === -1 || categoryIndex === -1 || subCategoryIndex === -1) {
        const errorMessage = `Missing required columns in 'Products' sheet. Expected 'Items', 'Category', 'Sub-Category', but got: ${headers.join(', ')}`;
        console.error(errorMessage);
        return [];
    }

    const products: Product[] = data.slice(1).map((row: any[], index: number) => ({
      productID: `p${String(index + 1).padStart(3, '0')}`,
      productName: row[itemIndex] || '',
      colors: row[colorsIndex] || '',
      category: row[categoryIndex] || '',
      subCategory: row[subCategoryIndex] || '',
    })).filter(p => p.productName && p.productName.trim() !== ''); // Filter out only rows without a product name.

    return products;

  } catch (error) {
    console.error("Failed to fetch and parse products from the backend:", error);
    return [];
  }
};