/// <reference types="vite/client" />

const DEFAULT_API_URL = 'https://nsame-reneportfolio.onrender.com';

export const API_BASE = (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace(/\/$/, '');

export function getApiUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${normalizedPath}`;
}

export async function apiFetch(path: string, init?: RequestInit) {
  return fetch(getApiUrl(path), init);
}

export async function apiJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await apiFetch(path, init);

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}
