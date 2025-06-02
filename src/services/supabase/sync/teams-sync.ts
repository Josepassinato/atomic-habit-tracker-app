
import { supabaseConfigService } from "../supabase-config";
import { EmpresasSyncService } from "./empresas-sync";

/**
 * Service for syncing teams data with Supabase
 */
export class TeamsSyncService {
  private empresasSync = new EmpresasSyncService();

  /**
   * Sincroniza equipes do localStorage para o Supabase
   */
  async syncToSupabase(teams: any[]): Promise<boolean> {
    const url = supabaseConfigService.getUrl();
    const key = supabaseConfigService.getApiKey();
    
    if (!url || !key || !teams || teams.length === 0) {
      console.log("Dados incompletos, não é possível sincronizar equipes");
      return false;
    }
    
    try {
      console.log("Sincronizando equipes com o Supabase...");
      
      // Garantir que a empresa padrão existe
      await this.empresasSync.syncToSupabase();
      
      // Para cada equipe no array
      for (const team of teams) {
        // Verificar se a equipe já existe no Supabase
        const checkResponse = await fetch(`${url}/rest/v1/equipes?id=eq.${team.id}`, {
          method: "GET",
          headers: {
            "apikey": key,
            "Authorization": `Bearer ${key}`
          }
        });
        
        const existingTeam = await checkResponse.json();
          
        // Se a equipe não existir, inserir
        if (!existingTeam || existingTeam.length === 0) {
          const insertResponse = await fetch(`${url}/rest/v1/equipes`, {
            method: "POST",
            headers: {
              "apikey": key,
              "Authorization": `Bearer ${key}`,
              "Content-Type": "application/json",
              "Prefer": "return=minimal"
            },
            body: JSON.stringify({
              id: team.id,
              nome: team.nome || team.name,
              empresa_id: '00000000-0000-0000-0000-000000000001',
              meta_total: team.meta_total || 100000,
              criado_em: new Date().toISOString()
            })
          });
            
          if (!insertResponse.ok) {
            console.error("Erro ao inserir equipe no Supabase:", await insertResponse.text());
          } else {
            console.log(`Equipe ${team.nome || team.name} sincronizada com Supabase`);
          }
        }
      }
      
      console.log("Sincronização de equipes com Supabase concluída");
      return true;
    } catch (error) {
      console.error("Erro ao sincronizar equipes com Supabase:", error);
      return false;
    }
  }
}
