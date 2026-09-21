/// <reference types="vite/client" />

// Single place that knows where the Django API lives.
//   Development: http://127.0.0.1:8000 (`python manage.py runserver`)
//   Production : set VITE_API_URL in Vercel, e.g. https://YOUR_USERNAME.pythonanywhere.com
const DEV_API_URL = 'http://127.0.0.1:8000';

const configuredUrl = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? DEV_API_URL : '')).replace(/\/$/, '');

if (!configuredUrl) {
  console.error(
    'VITE_API_URL is not set. Set it to your Django API URL (e.g. https://YOUR_USERNAME.pythonanywhere.com) ' +
      'in the Vercel project settings and redeploy.'
  );
}

export const API_BASE = configuredUrl;

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
