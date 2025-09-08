import { Product } from '../types';

const mockProducts: Product[] = [
    // Laptops
    { productID: 'p001', productName: 'Quantum Pro Laptop 13"', colors: 'Silver, Space Gray', category: 'Electronics', subCategory: 'Laptops' },
    { productID: 'p002', productName: 'Quantum Pro Laptop 15"', colors: 'Silver, Space Gray', category: 'Electronics', subCategory: 'Laptops' },
    { productID: 'p003', productName: 'Starlight Notebook', colors: 'Midnight Blue, Rose Gold', category: 'Electronics', subCategory: 'Laptops' },
    // Audio
    { productID: 'p004', productName: 'Nova Wireless Earbuds', colors: 'Black, White, Coral Pink', category: 'Electronics', subCategory: 'Audio' },
    { productID: 'p005', productName: 'Echo Soundbar', colors: 'Black', category: 'Electronics', subCategory: 'Audio' },
    { productID: 'p006', productName: 'Aura Headphones', colors: 'Matte Black, Navy Blue', category: 'Electronics', subCategory: 'Audio' },
    // Smart Devices
    { productID: 'p007', productName: 'Aura Smart Watch Series 5', colors: 'Black, Silver, Gold', category: 'Electronics', subCategory: 'Smart Devices' },
    { productID: 'p008', productName: 'Connect Smart Hub', colors: 'White', category: 'Electronics', subCategory: 'Smart Devices' },
    // Gaming
    { productID: 'p009', productName: 'Helios Gaming Mouse', colors: 'RGB, Black', category: 'Accessories', subCategory: 'Gaming' },
    { productID: 'p010', productName: 'Orion Mechanical Keyboard', colors: 'RGB, Black', category: 'Accessories', subCategory: 'Gaming' },
    { productID: 'p011', productName: 'Vortex Gaming Headset', colors: 'Red, Blue', category: 'Accessories', subCategory: 'Gaming' },
    // Peripherals
    { productID: 'p012', productName: 'Ergo-Flow Mouse', colors: 'Graphite', category: 'Accessories', subCategory: 'Peripherals' },
    { productID: 'p013', productName: 'SlimType Keyboard', colors: 'White, Silver', category: 'Accessories', subCategory: 'Peripherals' },
    { productID: 'p014', productName: 'CrystalView 4K Monitor', colors: 'Black', category: 'Accessories', subCategory: 'Peripherals' },
];

export const getProducts = async (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProducts);
    }, 500);
  });
};
