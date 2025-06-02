
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
    
    // Try to save configuration to database if possible
    supabaseSettingsService.saveConfigToDatabase();
  }

  getApiKey() {
    return supabaseConfigService.getApiKey();
  }

  setUrl(url: string) {
    supabaseConfigService.setUrl(url);
    
    // Try to save configuration to database if possible
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

  syncSalesRepsToSupabase(salesReps: any[]) {
    return this.dataSyncOrchestrator.syncSalesRepsToSupabase(salesReps);
  }
  
  syncHabitsToSupabase(habits: any[]) {
    return this.dataSyncOrchestrator.syncHabitsToSupabase(habits);
  }
  
  syncGoalsToSupabase(goals: any[]) {
    return this.dataSyncOrchestrator.syncGoalsToSupabase(goals);
  }
  
  syncAllDataToSupabase() {
    return this.dataSyncOrchestrator.syncAllDataToSupabase();
  }
}

// Export a single instance of the service
export const supabaseService = new SupabaseService();
