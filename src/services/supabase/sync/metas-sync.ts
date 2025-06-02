
import { supabaseConfigService } from "../supabase-config";

/**
 * Service for syncing goals data with Supabase
 */
export class GoalsSyncService {
  /**
   * Syncs goals from localStorage to Supabase
   */
  async syncToSupabase(goals: any[]): Promise<boolean> {
    const url = supabaseConfigService.getUrl();
    const key = supabaseConfigService.getApiKey();
    
    if (!url || !key || !goals || goals.length === 0) {
      console.log("Incomplete data, cannot sync goals");
      return false;
    }
    
    try {
      console.log("Syncing goals with Supabase...");
      
      // For each goal in the array
      for (const goal of goals) {
        // Check if goal already exists in Supabase
        const checkResponse = await fetch(`${url}/rest/v1/goals?id=eq.${goal.id}`, {
          method: "GET",
          headers: {
            "apikey": key,
            "Authorization": `Bearer ${key}`
          }
        });
        
        const existingGoal = await checkResponse.json();
          
        // If goal doesn't exist, insert it
        if (!existingGoal || existingGoal.length === 0) {
          const insertResponse = await fetch(`${url}/rest/v1/goals`, {
            method: "POST",
            headers: {
              "apikey": key,
              "Authorization": `Bearer ${key}`,
              "Content-Type": "application/json",
              "Prefer": "return=minimal"
            },
            body: JSON.stringify({
              id: goal.id,
              name: goal.name || goal.nome,
              target_value: goal.target_value || goal.valor,
              current_value: goal.current_value || goal.atual,
              percentage: goal.percentage || goal.percentual,
              type: goal.type || goal.tipo || 'sales',
              usuario_id: goal.usuario_id || '1',
              equipe_id: goal.equipe_id || null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
          });
            
          if (!insertResponse.ok) {
            console.error("Error inserting goal into Supabase:", await insertResponse.text());
          } else {
            console.log(`Goal ${goal.name || goal.nome} synced with Supabase`);
          }
        }
      }
      
      console.log("Goals sync with Supabase completed");
      return true;
    } catch (error) {
      console.error("Error syncing goals with Supabase:", error);
      return false;
    }
  }
}
