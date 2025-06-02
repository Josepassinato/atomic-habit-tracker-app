
import { TeamMetrics, TeamData } from "./types";
import { TeamMetricsCalculator } from "./team-metrics-calculator";

export class SupabaseTeamService {
  constructor(private supabase: any) {}

  async syncTeamsToSupabase(teams: any[]): Promise<void> {
    if (!this.supabase) return;
    
    try {
      console.log("Syncing teams with Supabase...");
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;
      
      if (!user) {
        console.warn("User not found, cannot sync with Supabase");
        return;
      }
      
      // For each team in the array
      for (const team of teams) {
        // Check if team already exists in Supabase
        const { data: existingTeam, error: checkError } = await this.supabase
          .from('teams')
          .select('*')
          .eq('id', team.id)
          .single();
          
        if (checkError && checkError.code !== 'PGRST116') {
          console.error("Error checking team:", checkError);
          continue;
        }
        
        // If team doesn't exist, insert it
        if (!existingTeam) {
          const { error: insertError } = await this.supabase
            .from('teams')
            .insert({
              id: team.id,
              name: team.name || team.nome, // Compatibility with different formats
              empresa_id: user.empresa_id || '1',
              created_at: new Date().toISOString()
            });
            
          if (insertError) {
            console.error("Error inserting team into Supabase:", insertError);
          } else {
            console.log(`Team ${team.name || team.nome} synced with Supabase`);
          }
        }
      }
      
      console.log("Supabase sync completed");
    } catch (error) {
      console.error("Error syncing with Supabase:", error);
    }
  }

  async fetchTeamMetrics(user: any): Promise<TeamMetrics[]> {
    // Fetch teams
    let query = this.supabase.from('teams').select('*');
    
    // If user is not admin, filter only for their company
    if (user.role !== 'admin' && user.empresa_id) {
      query = query.eq('empresa_id', user.empresa_id);
    }
    
    const { data: teams, error: teamError } = await query;
      
    if (teamError) {
      console.error("Error fetching teams:", teamError);
      throw teamError;
    }
    
    console.log("Teams found:", teams);
    
    // If no teams in Supabase but there are in localStorage, sync them
    if ((!teams || teams.length === 0) && user.teams && user.teams.length > 0) {
      console.log("Syncing teams from localStorage to Supabase...");
      await this.syncTeamsToSupabase(user.teams);
      
      // Fetch again after sync
      const { data: syncedTeams, error: syncError } = await query;
      
      if (syncError) {
        console.error("Error fetching synced teams:", syncError);
        throw syncError;
      }
      
      if (syncedTeams && syncedTeams.length > 0) {
        console.log("Synced teams found:", syncedTeams);
        return this.processTeams(syncedTeams);
      }
    }
    
    if (!teams || teams.length === 0) {
      console.log("No teams found");
      return [];
    }
    
    return this.processTeams(teams);
  }

  private async processTeams(teams: TeamData[]): Promise<TeamMetrics[]> {
    const metrics: TeamMetrics[] = [];
    
    // Fetch data for each team
    for (const team of teams) {
      // Get sales reps for the team
      const { data: salesRepsData, error: salesRepsError } = await this.supabase
        .from('sales_reps')
        .select('*')
        .eq('equipe_id', team.id);
        
      if (salesRepsError) throw salesRepsError;
      
      const salesReps = salesRepsData || [];
      console.log(`Sales reps for team ${team.name}:`, salesReps);
      
      // Get habits for the team
      const { data: habitsData, error: habitsError } = await this.supabase
        .from('team_habits')
        .select('*')
        .eq('equipe_id', team.id);
        
      if (habitsError) throw habitsError;
      
      const habits = habitsData || [];
      
      // Calculate team metrics
      const teamMetrics = TeamMetricsCalculator.calculateTeamMetrics(team, salesReps, habits);
      metrics.push(teamMetrics);
    }
    
    return metrics;
  }
}
