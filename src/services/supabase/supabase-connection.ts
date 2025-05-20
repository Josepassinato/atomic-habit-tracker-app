
import { toast } from "sonner";
import { supabaseConfigService } from "./supabase-config";

/**
 * Handles Supabase connection testing and management
 */
class SupabaseConnectionService {
  // Método para testar a conexão com o Supabase
  async testConnection() {
    const url = supabaseConfigService.getUrl();
    const key = supabaseConfigService.getApiKey();
    
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

export const supabaseConnectionService = new SupabaseConnectionService();
