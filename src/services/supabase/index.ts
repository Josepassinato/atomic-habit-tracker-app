
import { supabaseConfigService } from "./supabase-config";
import { supabaseConnectionService } from "./supabase-connection";
import { supabaseSettingsService } from "./supabase-settings";

/**
 * Main Supabase service that combines all supabase related functionality
 */
class SupabaseService {
  // Config methods
  setApiKey(apiKey: string) {
    supabaseConfigService.setApiKey(apiKey);
    
    // Tenta salvar a configuração no banco de dados se possível
    supabaseSettingsService.saveConfigToDatabase();
  }

  getApiKey() {
    return supabaseConfigService.getApiKey();
  }

  setUrl(url: string) {
    supabaseConfigService.setUrl(url);
    
    // Tenta salvar a configuração no banco de dados se possível
    supabaseSettingsService.saveConfigToDatabase();
  }

  getUrl() {
    return supabaseConfigService.getUrl();
  }

  isConfigured() {
    return supabaseConfigService.isConfigured();
  }

  // Connection methods
  testConnection() {
    return supabaseConnectionService.testConnection();
  }

  // Settings methods
  saveConfigToDatabase() {
    return supabaseSettingsService.saveConfigToDatabase();
  }

  loadConfigFromDatabase() {
    return supabaseSettingsService.loadConfigFromDatabase();
  }
}

// Exporta uma instância única do serviço
export const supabaseService = new SupabaseService();
