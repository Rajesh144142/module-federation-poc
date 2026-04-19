export interface Address {
  line1: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  tier: string;
  location: string;
  phone: string;
  primaryAddress: Address;
  rewardsPoints: number;
  recentOrders: number;
  wishlistItems: number;
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

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discountPercent: number;
  code: string;
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  placedAt: string;
}

export interface StoreInsights {
  heroMessage: string;
  featuredCategory: string;
  freeShippingThreshold: number;
  shippingEta: string;
}
