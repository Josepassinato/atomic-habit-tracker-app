
import { supabaseConfigService } from "../supabase-config";

/**
 * Service for syncing sales reps data with Supabase
 */
export class SalesRepsSyncService {
  /**
   * Syncs sales reps from localStorage to Supabase
   */
  async syncToSupabase(salesReps: any[]): Promise<boolean> {
    const url = supabaseConfigService.getUrl();
    const key = supabaseConfigService.getApiKey();
    
    if (!url || !key || !salesReps || salesReps.length === 0) {
      console.log("Incomplete data, cannot sync sales reps");
      return false;
    }
    
    try {
      console.log("Syncing sales reps with Supabase...");
      
      // For each sales rep in the array
      for (const salesRep of salesReps) {
        // Check if sales rep already exists in Supabase
        const checkResponse = await fetch(`${url}/rest/v1/sales_reps?id=eq.${salesRep.id}`, {
          method: "GET",
          headers: {
            "apikey": key,
            "Authorization": `Bearer ${key}`
          }
        });
        
        const existingSalesRep = await checkResponse.json();
          
        // If sales rep doesn't exist, insert it
        if (!existingSalesRep || existingSalesRep.length === 0) {
          const insertResponse = await fetch(`${url}/rest/v1/sales_reps`, {
            method: "POST",
            headers: {
              "apikey": key,
              "Authorization": `Bearer ${key}`,
              "Content-Type": "application/json",
              "Prefer": "return=minimal"
            },
            body: JSON.stringify({
              id: salesRep.id,
              name: salesRep.name || salesRep.nome,
              email: salesRep.email || `salesrep${salesRep.id}@example.com`,
              equipe_id: salesRep.equipe_id,
              empresa_id: '00000000-0000-0000-0000-000000000001',
              vendas_total: salesRep.vendas_total || 0,
              meta_atual: salesRep.meta_atual || 100000,
              taxa_conversao: salesRep.taxa_conversao || 0.3,
              created_at: new Date().toISOString()
            })
          });
            
          if (!insertResponse.ok) {
            console.error("Error inserting sales rep into Supabase:", await insertResponse.text());
          } else {
            console.log(`Sales rep ${salesRep.name || salesRep.nome} synced with Supabase`);
          }
        }
      }
      
      console.log("Sales reps sync with Supabase completed");
      return true;
    } catch (error) {
      console.error("Error syncing sales reps with Supabase:", error);
      return false;
    }
  }
}
