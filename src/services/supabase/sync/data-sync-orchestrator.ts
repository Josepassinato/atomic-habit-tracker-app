
import { supabaseConfigService } from "../supabase-config";
import { toast } from "sonner";
import { EmpresasSyncService } from "./empresas-sync";
import { TeamsSyncService } from "./teams-sync";
import { SalesRepsSyncService } from "./vendedores-sync";
import { HabitsSyncService } from "./habitos-sync";
import { GoalsSyncService } from "./metas-sync";

/**
 * Orchestrator service for coordinating all data sync operations
 */
export class DataSyncOrchestratorService {
  private empresasSync = new EmpresasSyncService();
  private teamsSync = new TeamsSyncService();
  private salesRepsSync = new SalesRepsSyncService();
  private habitsSync = new HabitsSyncService();
  private goalsSync = new GoalsSyncService();

  /**
   * Syncs all data from localStorage to Supabase
   */
  async syncAllDataToSupabase(): Promise<boolean> {
    const isConfigured = supabaseConfigService.isConfigured();
    
    if (!isConfigured) {
      toast.error("Supabase is not configured. Configure before trying to sync data.");
      return false;
    }
    
    try {
      toast.loading("Syncing data with Supabase...");
      
      // Fetch data from localStorage
      const teams = localStorage.getItem('teams') ? JSON.parse(localStorage.getItem('teams')!) : [];
      const salesReps = localStorage.getItem('sales_reps') ? JSON.parse(localStorage.getItem('sales_reps')!) : [];
      const habits = localStorage.getItem('habits') ? JSON.parse(localStorage.getItem('habits')!) : [];
      const teamHabits = localStorage.getItem('team_habits') ? JSON.parse(localStorage.getItem('team_habits')!) : [];
      const goals = localStorage.getItem('goals') ? JSON.parse(localStorage.getItem('goals')!) : [];
      
      // Sync all data
      const companiesResult = await this.empresasSync.syncToSupabase();
      const teamsResult = await this.teamsSync.syncToSupabase(teams);
      const salesRepsResult = await this.salesRepsSync.syncToSupabase(salesReps);
      const habitsResult = await this.habitsSync.syncToSupabase(habits);
      const teamHabitsResult = await this.habitsSync.syncToSupabase(teamHabits);
      const goalsResult = await this.goalsSync.syncToSupabase(goals);
      
      // Check if everything was synced successfully
      const allSuccess = companiesResult && teamsResult && salesRepsResult && habitsResult && teamHabitsResult && goalsResult;
      
      toast.dismiss();
      if (allSuccess) {
        toast.success("All data was synced with Supabase!");
        return true;
      } else {
        toast.warning("Some data could not be synced completely.");
        return false;
      }
    } catch (error) {
      console.error("Error syncing data with Supabase:", error);
      toast.dismiss();
      toast.error("Error syncing data with Supabase.");
      return false;
    }
  }

  // Individual sync methods for specific tables
  async syncCompaniesToSupabase() {
    return this.empresasSync.syncToSupabase();
  }

  async syncTeamsToSupabase(teams: any[]) {
    return this.teamsSync.syncToSupabase(teams);
  }

  async syncSalesRepsToSupabase(salesReps: any[]) {
    return this.salesRepsSync.syncToSupabase(salesReps);
  }
  
  async syncHabitsToSupabase(habits: any[]) {
    return this.habitsSync.syncToSupabase(habits);
  }
  
  async syncGoalsToSupabase(goals: any[]) {
    return this.goalsSync.syncToSupabase(goals);
  }
}
