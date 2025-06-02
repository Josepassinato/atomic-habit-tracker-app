
import { supabaseConfigService } from "../supabase-config";

/**
 * Service for syncing empresas data with Supabase
 */
export class EmpresasSyncService {
  /**
   * Sincroniza empresas do localStorage para o Supabase
   */
  async syncToSupabase(): Promise<boolean> {
    const url = supabaseConfigService.getUrl();
    const key = supabaseConfigService.getApiKey();
    
    if (!url || !key) {
      console.log("Supabase não configurado, não é possível sincronizar empresas");
      return false;
    }
    
    try {
      console.log("Sincronizando empresa padrão com o Supabase...");
      
      // Verificar se a empresa padrão já existe
      const checkResponse = await fetch(`${url}/rest/v1/empresas?id=eq.00000000-0000-0000-0000-000000000001`, {
        method: "GET",
        headers: {
          "apikey": key,
          "Authorization": `Bearer ${key}`
        }
      });
      
      const existingEmpresa = await checkResponse.json();
      
      if (!existingEmpresa || existingEmpresa.length === 0) {
        // Inserir empresa padrão se não existir
        const insertResponse = await fetch(`${url}/rest/v1/empresas`, {
          method: "POST",
          headers: {
            "apikey": key,
            "Authorization": `Bearer ${key}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
          },
          body: JSON.stringify({
            id: '00000000-0000-0000-0000-000000000001',
            nome: 'Empresa Padrão',
            segmento: 'Vendas',
            tamanho_equipe: 'Pequeno'
          })
        });
        
        if (!insertResponse.ok) {
          console.error("Erro ao inserir empresa padrão:", await insertResponse.text());
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error("Erro ao sincronizar empresas:", error);
      return false;
    }
  }
}
