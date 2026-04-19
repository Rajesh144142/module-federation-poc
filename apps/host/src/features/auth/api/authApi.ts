import type { Customer } from '../../../shared/types/store';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  token: string;
  user: AuthUser;
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(errorBody?.message ?? 'Request failed');
  }

  return response.json() as Promise<T>;
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  return parseResponse<AuthResponse>(response);
}

export async function loginUser(input: { email: string; password: string }): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  return parseResponse<AuthResponse>(response);
}

export async function getMe(token: string): Promise<AuthUser> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const payload = await parseResponse<{ user: AuthUser }>(response);
  return payload.user;
}

export async function getCustomerProfile(token: string): Promise<Customer> {
  const response = await fetch(`${API_BASE_URL}/store/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const payload = await parseResponse<{ profile: Customer }>(response);
  return payload.profile;
}
