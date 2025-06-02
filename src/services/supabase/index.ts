
import { supabaseConfigService } from "./supabase-config";
import { supabaseConnectionService } from "./supabase-connection";
import { supabaseSettingsService } from "./supabase-settings";
import { DataSyncOrchestratorService } from "./sync/data-sync-orchestrator";

/**
 * Main Supabase service that combines all supabase related functionality
 */
class SupabaseService {
  private dataSyncOrchestrator = new DataSyncOrchestratorService();

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

  // Data sync methods (delegated to orchestrator)
  syncTeamsToSupabase(teams: any[]) {
    return this.dataSyncOrchestrator.syncTeamsToSupabase(teams);
  }

  syncVendedoresToSupabase(vendedores: any[]) {
    return this.dataSyncOrchestrator.syncVendedoresToSupabase(vendedores);
  }
  
  syncHabitosToSupabase(habitos: any[]) {
    return this.dataSyncOrchestrator.syncHabitosToSupabase(habitos);
  }
  
  syncMetasToSupabase(metas: any[]) {
    return this.dataSyncOrchestrator.syncMetasToSupabase(metas);
  }
  
  syncAllDataToSupabase() {
    return this.dataSyncOrchestrator.syncAllDataToSupabase();
  }
}

// Exporta uma instância única do serviço
export const supabaseService = new SupabaseService();
