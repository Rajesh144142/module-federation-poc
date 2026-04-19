/// <reference types="vite/client" />

import type { CartItem } from '../../../shared/types/cart';

const DEFAULT_API_BASE_URL = 'http://localhost:4000/api';

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(errorBody?.message ?? 'Cart API request failed');
  }

  return response.json() as Promise<T>;
}

export async function getCartItems(
  token: string,
  apiBaseUrl: string = import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL,
): Promise<CartItem[]> {
  const response = await fetch(`${apiBaseUrl}/store/cart`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return parseResponse<CartItem[]>(response);
}
