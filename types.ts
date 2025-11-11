export interface Product {
  productID: string;
  productName: string;
  colors: string;
  category: string;
  subCategory: string;
}

export type View = 'main' | 'productSupport' | 'salesInquiry' | 'warrantyRegistration' | 'general' | 'requestCallback' | 'shippingInquiry';

export type ProductSupportSubView = 'select' | 'damageCategorySelect' | 'damageReasonSelect' | 'form' | 'upgrade';