import { environment } from '../../../environments/environment';

function trimTrailingSlash(value: string): string {
  return value.trim().replace(/\/+$/, '');
}

export function resolveApiBaseUrl(): string {
  const runtimeApiUrl = (window as unknown as { __apiBase?: string }).__apiBase ?? '';
  const configuredApiUrl = runtimeApiUrl || environment.apiUrl || '';
  return trimTrailingSlash(configuredApiUrl);
}

export function resolvePublicApiBaseUrl(): string {
  const runtimeApiUrl = (window as unknown as { __apiBase?: string }).__apiBase ?? '';
  const configuredPublicUrl = environment.apiPublicUrl || runtimeApiUrl || environment.apiUrl || '';
  return trimTrailingSlash(configuredPublicUrl);
}

export function resolveOtuh2BaseUrl(): string {
  const runtimeOtuh2Url = (window as unknown as { __otuh2Base?: string }).__otuh2Base ?? '';
  const configuredOtuh2Url = runtimeOtuh2Url || (environment as Record<string, unknown>)['otuh2Url'] as string || 'http://localhost:5000';
  return trimTrailingSlash(configuredOtuh2Url);
}

export function setOtuh2Url(url: string): void {
  (window as unknown as { __otuh2Base?: string }).__otuh2Base = url;
}

export function resolveMediaUrl(pathOrUrl: string | null | undefined): string | null {
  if (!pathOrUrl) {
    return null;
  }

  const raw = pathOrUrl.trim();
  if (!raw) {
    return null;
  }

  if (/^(https?:|blob:|data:)/i.test(raw)) {
    return raw;
  }

  const base = resolvePublicApiBaseUrl();
  if (!base) {
    return raw;
  }

  return raw.startsWith('/') ? `${base}${raw}` : `${base}/${raw}`;
}
