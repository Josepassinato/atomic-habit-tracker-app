
import { supabaseConfigService } from "../supabase-config";

/**
 * Service for syncing metas data with Supabase
 */
export class MetasSyncService {
  /**
   * Sincroniza metas do localStorage para o Supabase
   */
  async syncToSupabase(metas: any[]): Promise<boolean> {
    const url = supabaseConfigService.getUrl();
    const key = supabaseConfigService.getApiKey();
    
    if (!url || !key || !metas || metas.length === 0) {
      console.log("Dados incompletos, não é possível sincronizar metas");
      return false;
    }
    
    try {
      console.log("Sincronizando metas com o Supabase...");
      
      // Para cada meta no array
      for (const meta of metas) {
        // Verificar se a meta já existe no Supabase
        const checkResponse = await fetch(`${url}/rest/v1/metas?id=eq.${meta.id}`, {
          method: "GET",
          headers: {
            "apikey": key,
            "Authorization": `Bearer ${key}`
          }
        });
        
        const existingMeta = await checkResponse.json();
          
        // Se a meta não existir, inserir
        if (!existingMeta || existingMeta.length === 0) {
          const insertResponse = await fetch(`${url}/rest/v1/metas`, {
            method: "POST",
            headers: {
              "apikey": key,
              "Authorization": `Bearer ${key}`,
              "Content-Type": "application/json",
              "Prefer": "return=minimal"
            },
            body: JSON.stringify({
              id: meta.id,
              nome: meta.nome,
              valor: meta.valor,
              atual: meta.atual,
              percentual: meta.percentual,
              tipo: meta.tipo || 'vendas',
              usuario_id: meta.usuario_id || '1',
              equipe_id: meta.equipe_id || null,
              criado_em: new Date().toISOString(),
              atualizado_em: new Date().toISOString()
            })
          });
            
          if (!insertResponse.ok) {
            console.error("Erro ao inserir meta no Supabase:", await insertResponse.text());
          } else {
            console.log(`Meta ${meta.nome} sincronizada com Supabase`);
          }
        }
      }
      
      console.log("Sincronização de metas com Supabase concluída");
      return true;
    } catch (error) {
      console.error("Erro ao sincronizar metas com Supabase:", error);
      return false;
    }
  }
}
