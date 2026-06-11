const DEFAULT_BACKEND_URL = 'http://localhost:8080';

export function getBackendUrl(): string {
  return normalizeUrl(process.env.NEXT_PUBLIC_BACKEND_URL || DEFAULT_BACKEND_URL);
}

export function getApiBaseUrl(): string {
  return `${getBackendUrl()}/api/v1`;
}

export function getWsBaseUrl(): string {
  return `${getBackendUrl()}/ws`;
}

function normalizeUrl(url: string): string {
  return url.replace(/\/+$/, '');
}
