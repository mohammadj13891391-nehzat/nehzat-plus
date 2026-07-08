export function loadApiConfig(): () => Promise<void> {
  return () => {
    const base = document.querySelector('base')?.href ?? '/';
    const configUrl = `${base}config.json`;

    return fetch(configUrl)
      .then((response) => (response.ok ? response.json() : {}))
      .then((config: { apiUrl?: string; otuh2Url?: string }) => {
        const win = window as unknown as { __apiBase?: string; __otuh2Base?: string };
        if (typeof config.apiUrl === 'string') {
          win.__apiBase = config.apiUrl;
        }
        if (typeof config.otuh2Url === 'string') {
          win.__otuh2Base = config.otuh2Url;
        }
      })
      .catch(() => undefined);
  };
}
