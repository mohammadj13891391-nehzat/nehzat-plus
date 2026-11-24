export function loadApiConfig(): () => Promise<void> {
  return () => {
    const base = document.querySelector('base')?.href ?? '/';
    const configUrl = `${base}config.json`;

    return fetch(configUrl)
      .then((response) => {
        if (!response.ok) {
          console.warn(`[ConfigLoader] config.json unavailable (HTTP ${response.status}) — falling back to environment defaults`);
          return {};
        }
        return response.json().catch((err) => {
          console.error(`[ConfigLoader] invalid JSON in ${configUrl} — falling back to environment defaults`, err);
          return {};
        });
      })
      .then((config: { apiUrl?: string; otuh2Url?: string; apiBase?: string; otuh2Base?: string; morabbiApiBase?: string; lightragApiBase?: string; ragflowApiBase?: string; ragflowApiKey?: string }) => {
        const win = window as unknown as { __apiBase?: string; __otuh2Base?: string; __morabbiApiBase?: string; __lightragApiBase?: string; __ragflowApiBase?: string; __ragflowApiKey?: string };
        const apiBase = config.apiUrl ?? config.apiBase;
        const otuh2Base = config.otuh2Url ?? config.otuh2Base;
        const morabbiApiBase = config.morabbiApiBase;
        const lightragApiBase = config.lightragApiBase;
        const ragflowApiBase = config.ragflowApiBase;
        const ragflowApiKey = config.ragflowApiKey;
        if (typeof apiBase === 'string') {
          win.__apiBase = apiBase;
        }
        if (typeof otuh2Base === 'string') {
          win.__otuh2Base = otuh2Base;
        }
        if (typeof morabbiApiBase === 'string') {
          win.__morabbiApiBase = morabbiApiBase;
        }
        if (typeof lightragApiBase === 'string') {
          win.__lightragApiBase = lightragApiBase;
        }
        if (typeof ragflowApiBase === 'string') {
          win.__ragflowApiBase = ragflowApiBase;
        }
        if (typeof ragflowApiKey === 'string' && ragflowApiKey.length > 0) {
          win.__ragflowApiKey = ragflowApiKey;
        }
      })
      .catch((err) => {
        console.error(`[ConfigLoader] failed to load ${configUrl} — falling back to environment defaults`, err);
      });
  };
}
