
import { toast } from "sonner";
import { storageService } from "./storage-service";

class SupabaseService {
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

  // Método para testar a conexão com o Supabase
  async testConnection() {
    const url = this.getUrl();
    const key = this.getApiKey();
    
    if (!url || !key) {
      toast.error("URL e chave API do Supabase são necessários");
      return false;
    }

    try {
      // Requisição simples para verificar se as credenciais são válidas
      const response = await fetch(`${url}/rest/v1/`, {
        method: "GET",
        headers: {
          "apikey": key,
          "Authorization": `Bearer ${key}`
        }
      });

      if (response.ok) {
        return true;
      } else {
        console.error("Erro ao conectar com Supabase:", await response.text());
        return false;
      }
    } catch (error) {
      console.error("Erro ao testar conexão com Supabase:", error);
      return false;
    }
  }
}

// Exporta uma instância única do serviço
export const supabaseService = new SupabaseService();
