
import { supabaseConfigService } from "./supabase-config";
import { toast } from "sonner";

/**
 * Serviço para sincronizar dados entre o localStorage e o Supabase
 */
class SupabaseDataSyncService {
  /**
   * Sincroniza equipes do localStorage para o Supabase
   */
  async syncTeamsToSupabase(teams: any[]): Promise<boolean> {
    const url = supabaseConfigService.getUrl();
    const key = supabaseConfigService.getApiKey();
    
    if (!url || !key || !teams || teams.length === 0) {
      console.log("Dados incompletos, não é possível sincronizar equipes");
      return false;
    }
    
    try {
      console.log("Sincronizando equipes com o Supabase...");
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;
      
      if (!user) {
        console.warn("Usuário não encontrado, não é possível sincronizar com Supabase");
        return false;
      }
      
      // Para cada equipe no array
      for (const team of teams) {
        // Verifica se a equipe já existe no Supabase
        const checkResponse = await fetch(`${url}/rest/v1/equipes?id=eq.${team.id}`, {
          method: "GET",
          headers: {
            "apikey": key,
            "Authorization": `Bearer ${key}`
          }
        });
        
        const existingTeam = await checkResponse.json();
          
        // Se a equipe não existir, insere
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
              nome: team.nome || team.name, // Compatibilidade com diferentes formatos
              empresa_id: user.empresa_id || '1',
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

  /**
   * Sincroniza vendedores do localStorage para o Supabase
   */
  async syncVendedoresToSupabase(vendedores: any[]): Promise<boolean> {
    const url = supabaseConfigService.getUrl();
    const key = supabaseConfigService.getApiKey();
    
    if (!url || !key || !vendedores || vendedores.length === 0) {
      console.log("Dados incompletos, não é possível sincronizar vendedores");
      return false;
    }
    
    try {
      console.log("Sincronizando vendedores com o Supabase...");
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;
      
      if (!user) {
        console.warn("Usuário não encontrado, não é possível sincronizar vendedores com Supabase");
        return false;
      }
      
      // Para cada vendedor no array
      for (const vendedor of vendedores) {
        // Verifica se o vendedor já existe no Supabase
        const checkResponse = await fetch(`${url}/rest/v1/vendedores?id=eq.${vendedor.id}`, {
          method: "GET",
          headers: {
            "apikey": key,
            "Authorization": `Bearer ${key}`
          }
        });
        
        const existingVendedor = await checkResponse.json();
          
        // Se o vendedor não existir, insere
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

  /**
   * Sincroniza hábitos do localStorage para o Supabase
   */
  async syncHabitosToSupabase(habitos: any[]): Promise<boolean> {
    const url = supabaseConfigService.getUrl();
    const key = supabaseConfigService.getApiKey();
    
    if (!url || !key || !habitos || habitos.length === 0) {
      console.log("Dados incompletos, não é possível sincronizar hábitos");
      return false;
    }
    
    try {
      console.log("Sincronizando hábitos com o Supabase...");
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;
      
      if (!user) {
        console.warn("Usuário não encontrado, não é possível sincronizar hábitos com Supabase");
        return false;
      }
      
      // Para cada hábito no array
      for (const habito of habitos) {
        // Verifica se o hábito já existe no Supabase
        const checkResponse = await fetch(`${url}/rest/v1/habitos${habito.equipe_id ? '_equipe' : ''}?id=eq.${habito.id}`, {
          method: "GET",
          headers: {
            "apikey": key,
            "Authorization": `Bearer ${key}`
          }
        });
        
        const existingHabito = await checkResponse.json();
          
        // Se o hábito não existir, insere
        if (!existingHabito || existingHabito.length === 0) {
          const tableName = habito.equipe_id ? 'habitos_equipe' : 'habitos';
          const insertResponse = await fetch(`${url}/rest/v1/${tableName}`, {
            method: "POST",
            headers: {
              "apikey": key,
              "Authorization": `Bearer ${key}`,
              "Content-Type": "application/json",
              "Prefer": "return=minimal"
            },
            body: JSON.stringify({
              id: habito.id,
              titulo: habito.titulo || habito.nome,
              descricao: habito.descricao || '',
              concluido: habito.concluido || false,
              recorrencia: habito.recorrencia || 'diario',
              usuario_id: habito.equipe_id ? null : (habito.usuario_id || user.id),
              equipe_id: habito.equipe_id || null,
              data_criacao: habito.data_criacao || new Date().toISOString(),
              data_conclusao: habito.data_conclusao || null
            })
          });
            
          if (!insertResponse.ok) {
            console.error("Erro ao inserir hábito no Supabase:", await insertResponse.text());
          } else {
            console.log(`Hábito ${habito.titulo || habito.nome} sincronizado com Supabase`);
          }
        }
      }
      
      console.log("Sincronização de hábitos com Supabase concluída");
      return true;
    } catch (error) {
      console.error("Erro ao sincronizar hábitos com Supabase:", error);
      return false;
    }
  }

  /**
   * Sincroniza metas do localStorage para o Supabase
   */
  async syncMetasToSupabase(metas: any[]): Promise<boolean> {
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
        // Verifica se a meta já existe no Supabase
        const checkResponse = await fetch(`${url}/rest/v1/metas?id=eq.${meta.id}`, {
          method: "GET",
          headers: {
            "apikey": key,
            "Authorization": `Bearer ${key}`
          }
        });
        
        const existingMeta = await checkResponse.json();
          
        // Se a meta não existir, insere
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
              criado_em: new Date().toISOString()
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
      
      // Busca dados do localStorage
      const teams = localStorage.getItem('equipes') ? JSON.parse(localStorage.getItem('equipes')!) : [];
      const vendedores = localStorage.getItem('vendedores') ? JSON.parse(localStorage.getItem('vendedores')!) : [];
      const habitos = localStorage.getItem('habitos') ? JSON.parse(localStorage.getItem('habitos')!) : [];
      const habitosEquipe = localStorage.getItem('habitos_equipe') ? JSON.parse(localStorage.getItem('habitos_equipe')!) : [];
      const metas = localStorage.getItem('metas') ? JSON.parse(localStorage.getItem('metas')!) : [];
      
      // Sincroniza todos os dados
      const teamsResult = await this.syncTeamsToSupabase(teams);
      const vendedoresResult = await this.syncVendedoresToSupabase(vendedores);
      const habitosResult = await this.syncHabitosToSupabase(habitos);
      const habitosEquipeResult = await this.syncHabitosToSupabase(habitosEquipe);
      const metasResult = await this.syncMetasToSupabase(metas);
      
      // Verifica se tudo foi sincronizado com sucesso
      const allSuccess = teamsResult && vendedoresResult && habitosResult && habitosEquipeResult && metasResult;
      
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
}

// Exporta uma instância única do serviço
export const supabaseDataSyncService = new SupabaseDataSyncService();
