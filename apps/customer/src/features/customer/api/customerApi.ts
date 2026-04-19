/// <reference types="vite/client" />

import type { Customer } from '../../../shared/types/customer';

const DEFAULT_API_BASE_URL = 'http://localhost:4000/api';

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(errorBody?.message ?? 'Customer API request failed');
  }

  return response.json() as Promise<T>;
}

export async function getCustomerProfile(
  token: string,
  apiBaseUrl: string = import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL,
): Promise<Customer> {
  const response = await fetch(`${apiBaseUrl}/store/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const payload = await parseResponse<{ profile: Customer }>(response);
  return payload.profile;
}
