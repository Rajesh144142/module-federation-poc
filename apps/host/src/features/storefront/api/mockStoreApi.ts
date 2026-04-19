import type { CartItem, Offer, OrderSummary, Product, StoreInsights } from '../../../shared/types/store';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api';

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error('API request failed.');
  }

  return response.json() as Promise<T>;
}

export async function getStoreInsights(): Promise<StoreInsights> {
  const response = await fetch(`${API_BASE_URL}/store/insights`);
  return parseResponse<StoreInsights>(response);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/store/products`);
  return parseResponse<Product[]>(response);
}

export async function getInitialCartItems(token: string): Promise<CartItem[]> {
  const response = await fetch(`${API_BASE_URL}/store/cart`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return parseResponse<CartItem[]>(response);
}

export async function getActiveOffers(): Promise<Offer[]> {
  const response = await fetch(`${API_BASE_URL}/store/offers`);
  return parseResponse<Offer[]>(response);
}

export async function getMyOrders(token: string): Promise<OrderSummary[]> {
  const response = await fetch(`${API_BASE_URL}/store/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return parseResponse<OrderSummary[]>(response);
}
