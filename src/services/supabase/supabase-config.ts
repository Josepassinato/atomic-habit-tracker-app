
import { storageService } from "../storage-service";

/**
 * Manages Supabase configuration (API keys and URLs)
 */
class SupabaseConfigService {
  private apiKeyCache: string | null = null;
  private urlCache: string | null = null;

  constructor() {
    // Tenta recuperar as configurações do Supabase do storage service
    this.apiKeyCache = storageService.getItem<string>("admin-supabase-api-key");
    this.urlCache = storageService.getItem<string>("admin-supabase-url");
  }

  setApiKey(apiKey: string) {
    this.apiKeyCache = apiKey;
    storageService.setItem("admin-supabase-api-key", apiKey);
  }

  getApiKey() {
    // Sempre verifique o storage primeiro, caso tenha sido atualizado em outra aba
    if (!this.apiKeyCache) {
      this.apiKeyCache = storageService.getItem<string>("admin-supabase-api-key");
    }
    return this.apiKeyCache;
  }

  setUrl(url: string) {
    this.urlCache = url;
    storageService.setItem("admin-supabase-url", url);
  }

  getUrl() {
    // Sempre verifique o storage primeiro, caso tenha sido atualizado em outra aba
    if (!this.urlCache) {
      this.urlCache = storageService.getItem<string>("admin-supabase-url");
    }
    return this.urlCache;
  }

  isConfigured() {
    return !!this.getApiKey() && !!this.getUrl();
  }
}

export const supabaseConfigService = new SupabaseConfigService();
