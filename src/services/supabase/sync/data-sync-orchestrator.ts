
import { supabaseConfigService } from "../supabase-config";
import { toast } from "sonner";
import { EmpresasSyncService } from "./empresas-sync";
import { TeamsSyncService } from "./teams-sync";
import { VendedoresSyncService } from "./vendedores-sync";
import { HabitosSyncService } from "./habitos-sync";
import { MetasSyncService } from "./metas-sync";

/**
 * Orchestrator service for coordinating all data sync operations
 */
export class DataSyncOrchestratorService {
  private empresasSync = new EmpresasSyncService();
  private teamsSync = new TeamsSyncService();
  private vendedoresSync = new VendedoresSyncService();
  private habitosSync = new HabitosSyncService();
  private metasSync = new MetasSyncService();

  /**
   * Sincroniza todos os dados do localStorage para o Supabase
   */
  async syncAllDataToSupabase(): Promise<boolean> {
    const isConfigured = supabaseConfigService.isConfigured();
    
    if (!isConfigured) {
      toast.error("Supabase não está configurado. Configure antes de tentar sincronizar dados.");
      return false;
    }
    
    try {
      toast.loading("Sincronizando dados com o Supabase...");
      
      // Buscar dados do localStorage
      const teams = localStorage.getItem('equipes') ? JSON.parse(localStorage.getItem('equipes')!) : [];
      const vendedores = localStorage.getItem('vendedores') ? JSON.parse(localStorage.getItem('vendedores')!) : [];
      const habitos = localStorage.getItem('habitos') ? JSON.parse(localStorage.getItem('habitos')!) : [];
      const habitosEquipe = localStorage.getItem('habitos_equipe') ? JSON.parse(localStorage.getItem('habitos_equipe')!) : [];
      const metas = localStorage.getItem('metas') ? JSON.parse(localStorage.getItem('metas')!) : [];
      
      // Sincronizar todos os dados
      const empresasResult = await this.empresasSync.syncToSupabase();
      const teamsResult = await this.teamsSync.syncToSupabase(teams);
      const vendedoresResult = await this.vendedoresSync.syncToSupabase(vendedores);
      const habitosResult = await this.habitosSync.syncToSupabase(habitos);
      const habitosEquipeResult = await this.habitosSync.syncToSupabase(habitosEquipe);
      const metasResult = await this.metasSync.syncToSupabase(metas);
      
      // Verificar se tudo foi sincronizado com sucesso
      const allSuccess = empresasResult && teamsResult && vendedoresResult && habitosResult && habitosEquipeResult && metasResult;
      
      toast.dismiss();
      if (allSuccess) {
        toast.success("Todos os dados foram sincronizados com o Supabase!");
        return true;
      } else {
        toast.warning("Alguns dados não puderam ser sincronizados completamente.");
        return false;
      }
    } catch (error) {
      console.error("Erro ao sincronizar dados com Supabase:", error);
      toast.dismiss();
      toast.error("Erro ao sincronizar dados com o Supabase.");
      return false;
    }
  }

  // Individual sync methods for specific tables
  async syncEmpresasToSupabase() {
    return this.empresasSync.syncToSupabase();
  }

  async syncTeamsToSupabase(teams: any[]) {
    return this.teamsSync.syncToSupabase(teams);
  }

  async syncVendedoresToSupabase(vendedores: any[]) {
    return this.vendedoresSync.syncToSupabase(vendedores);
  }
  
  async syncHabitosToSupabase(habitos: any[]) {
    return this.habitosSync.syncToSupabase(habitos);
  }
  
  async syncMetasToSupabase(metas: any[]) {
    return this.metasSync.syncToSupabase(metas);
  }
}
