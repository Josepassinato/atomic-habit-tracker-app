
import { supabaseConfigService } from "../supabase-config";
import { EmpresasSyncService } from "./empresas-sync";

/**
 * Service for syncing teams data with Supabase
 */
export class TeamsSyncService {
  private empresasSync = new EmpresasSyncService();

  /**
   * Syncs teams from localStorage to Supabase
   */
  async syncToSupabase(teams: any[]): Promise<boolean> {
    const url = supabaseConfigService.getUrl();
    const key = supabaseConfigService.getApiKey();
    
    if (!url || !key || !teams || teams.length === 0) {
      console.log("Incomplete data, cannot sync teams");
      return false;
    }
    
    try {
      console.log("Syncing teams with Supabase...");
      
      // Ensure default company exists
      await this.empresasSync.syncToSupabase();
      
      // For each team in the array
      for (const team of teams) {
        // Check if team already exists in Supabase
        const checkResponse = await fetch(`${url}/rest/v1/teams?id=eq.${team.id}`, {
          method: "GET",
          headers: {
            "apikey": key,
            "Authorization": `Bearer ${key}`
          }
        });
        
        const existingTeam = await checkResponse.json();
          
        // If team doesn't exist, insert it
        if (!existingTeam || existingTeam.length === 0) {
          const insertResponse = await fetch(`${url}/rest/v1/teams`, {
            method: "POST",
            headers: {
              "apikey": key,
              "Authorization": `Bearer ${key}`,
              "Content-Type": "application/json",
              "Prefer": "return=minimal"
            },
            body: JSON.stringify({
              id: team.id,
              name: team.name || team.nome,
              empresa_id: '00000000-0000-0000-0000-000000000001',
              meta_total: team.meta_total || 100000,
              created_at: new Date().toISOString()
            })
          });
            
          if (!insertResponse.ok) {
            console.error("Error inserting team into Supabase:", await insertResponse.text());
          } else {
            console.log(`Team ${team.name || team.nome} synced with Supabase`);
          }
        }
      }
      
      console.log("Team sync with Supabase completed");
      return true;
    } catch (error) {
      console.error("Error syncing teams with Supabase:", error);
      return false;
    }
  }
}
