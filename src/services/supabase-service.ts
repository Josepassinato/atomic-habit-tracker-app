
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
    
    // Tenta salvar a configuração no banco de dados se possível
    this.saveConfigToDatabase();
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
    
    // Tenta salvar a configuração no banco de dados se possível
    this.saveConfigToDatabase();
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
  
  // Salva a configuração atual no banco de dados (se conectado)
  private async saveConfigToDatabase() {
    const url = this.getUrl();
    const key = this.getApiKey();
    
    if (!url || !key) {
      console.log("Configuração incompleta, não é possível salvar no banco");
      return;
    }
    
    try {
      // Verifica se a tabela 'admin_settings' existe
      const tableCheckResponse = await fetch(`${url}/rest/v1/admin_settings?select=id&limit=1`, {
        method: "GET",
        headers: {
          "apikey": key,
          "Authorization": `Bearer ${key}`
        }
      });
      
      // Se a tabela não existir, cria-a
      if (!tableCheckResponse.ok) {
        console.log("Tabela admin_settings não existe, criando...");
        try {
          // Aqui precisamos criar a tabela via SQL
          const createTableResponse = await fetch(`${url}/rest/v1/rpc/create_admin_settings_table`, {
            method: "POST",
            headers: {
              "apikey": key,
              "Authorization": `Bearer ${key}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({})
          });
          
          if (!createTableResponse.ok) {
            console.error("Erro ao criar tabela admin_settings:", await createTableResponse.text());
            return;
          }
        } catch (error) {
          console.error("Erro ao criar tabela:", error);
          return;
        }
      }
      
      // Verifica se já existe um registro de configuração
      const checkConfigResponse = await fetch(`${url}/rest/v1/admin_settings?id=eq.1`, {
        method: "GET",
        headers: {
          "apikey": key,
          "Authorization": `Bearer ${key}`
        }
      });
      
      const existingConfig = await checkConfigResponse.json();
      
      // Salva as configurações no banco de dados
      let saveResponse;
      if (existingConfig && existingConfig.length > 0) {
        // Atualiza o registro existente
        saveResponse = await fetch(`${url}/rest/v1/admin_settings?id=eq.1`, {
          method: "PATCH",
          headers: {
            "apikey": key,
            "Authorization": `Bearer ${key}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
          },
          body: JSON.stringify({
            supabase_url: url,
            supabase_key: key,
            openai_key: storageService.getItem<string>("admin-openai-api-key") || null,
            updated_at: new Date().toISOString()
          })
        });
      } else {
        // Cria um novo registro
        saveResponse = await fetch(`${url}/rest/v1/admin_settings`, {
          method: "POST",
          headers: {
            "apikey": key,
            "Authorization": `Bearer ${key}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
          },
          body: JSON.stringify({
            id: 1, // ID fixo para facilitar atualizações
            supabase_url: url,
            supabase_key: key,
            openai_key: storageService.getItem<string>("admin-openai-api-key") || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
        });
      }
      
      if (!saveResponse.ok) {
        console.error("Erro ao salvar configurações no banco:", await saveResponse.text());
      } else {
        console.log("Configurações salvas com sucesso no banco de dados");
      }
    } catch (error) {
      console.error("Erro ao salvar configurações no banco:", error);
    }
  }
  
  // Carrega a configuração do banco de dados (se conectado)
  async loadConfigFromDatabase(): Promise<boolean> {
    const url = this.getUrl();
    const key = this.getApiKey();
    
    if (!url || !key) {
      console.log("Configuração incompleta, não é possível carregar do banco");
      return false;
    }
    
    try {
      // Verifica se já existe um registro de configuração
      const loadConfigResponse = await fetch(`${url}/rest/v1/admin_settings?id=eq.1`, {
        method: "GET",
        headers: {
          "apikey": key,
          "Authorization": `Bearer ${key}`
        }
      });
      
      if (!loadConfigResponse.ok) {
        console.error("Erro ao carregar configurações do banco:", await loadConfigResponse.text());
        return false;
      }
      
      const config = await loadConfigResponse.json();
      
      if (config && config.length > 0) {
        // Atualiza o localStorage e os caches com os valores do banco
        if (config[0].supabase_url) {
          this.urlCache = config[0].supabase_url;
          storageService.setItem("admin-supabase-url", config[0].supabase_url);
        }
        
        if (config[0].supabase_key) {
          this.apiKeyCache = config[0].supabase_key;
          storageService.setItem("admin-supabase-api-key", config[0].supabase_key);
        }
        
        if (config[0].openai_key) {
          storageService.setItem("admin-openai-api-key", config[0].openai_key);
        }
        
        console.log("Configurações carregadas com sucesso do banco de dados");
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Erro ao carregar configurações do banco:", error);
      return false;
    }
  }
}

// Exporta uma instância única do serviço
export const supabaseService = new SupabaseService();
