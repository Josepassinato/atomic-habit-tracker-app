
import { storageService } from "../storage-service";
import { supabaseConfigService } from "./supabase-config";

/**
 * Manages Supabase settings storage and retrieval
 */
class SupabaseSettingsService {
  async saveConfigToDatabase() {
    const url = supabaseConfigService.getUrl();
    const key = supabaseConfigService.getApiKey();
    
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
    const url = supabaseConfigService.getUrl();
    const key = supabaseConfigService.getApiKey();
    
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
          supabaseConfigService.setUrl(config[0].supabase_url);
        }
        
        if (config[0].supabase_key) {
          supabaseConfigService.setApiKey(config[0].supabase_key);
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

export const supabaseSettingsService = new SupabaseSettingsService();
