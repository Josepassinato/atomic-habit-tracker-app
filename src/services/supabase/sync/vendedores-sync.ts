
import { supabaseConfigService } from "../supabase-config";

/**
 * Service for syncing vendedores data with Supabase
 */
export class VendedoresSyncService {
  /**
   * Sincroniza vendedores do localStorage para o Supabase
   */
  async syncToSupabase(vendedores: any[]): Promise<boolean> {
    const url = supabaseConfigService.getUrl();
    const key = supabaseConfigService.getApiKey();
    
    if (!url || !key || !vendedores || vendedores.length === 0) {
      console.log("Dados incompletos, não é possível sincronizar vendedores");
      return false;
    }
    
    try {
      console.log("Sincronizando vendedores com o Supabase...");
      
      // Para cada vendedor no array
      for (const vendedor of vendedores) {
        // Verificar se o vendedor já existe no Supabase
        const checkResponse = await fetch(`${url}/rest/v1/vendedores?id=eq.${vendedor.id}`, {
          method: "GET",
          headers: {
            "apikey": key,
            "Authorization": `Bearer ${key}`
          }
        });
        
        const existingVendedor = await checkResponse.json();
          
        // Se o vendedor não existir, inserir
        if (!existingVendedor || existingVendedor.length === 0) {
          const insertResponse = await fetch(`${url}/rest/v1/vendedores`, {
            method: "POST",
            headers: {
              "apikey": key,
              "Authorization": `Bearer ${key}`,
              "Content-Type": "application/json",
              "Prefer": "return=minimal"
            },
            body: JSON.stringify({
              id: vendedor.id,
              nome: vendedor.nome,
              email: vendedor.email || `vendedor${vendedor.id}@exemplo.com`,
              equipe_id: vendedor.equipe_id,
              empresa_id: '00000000-0000-0000-0000-000000000001',
              vendas_total: vendedor.vendas_total || 0,
              meta_atual: vendedor.meta_atual || 100000,
              taxa_conversao: vendedor.taxa_conversao || 0.3,
              criado_em: new Date().toISOString()
            })
          });
            
          if (!insertResponse.ok) {
            console.error("Erro ao inserir vendedor no Supabase:", await insertResponse.text());
          } else {
            console.log(`Vendedor ${vendedor.nome} sincronizado com Supabase`);
          }
        }
      }
      
      console.log("Sincronização de vendedores com Supabase concluída");
      return true;
    } catch (error) {
      console.error("Erro ao sincronizar vendedores com Supabase:", error);
      return false;
    }
  }
}
