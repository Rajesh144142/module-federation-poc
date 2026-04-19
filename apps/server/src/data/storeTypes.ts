export interface StoreInsights {
  heroMessage: string;
  featuredCategory: string;
  freeShippingThreshold: number;
  shippingEta: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  badge: string;
  stock: number;
  rating: number;
  image: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discountPercent: number;
  code: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}
