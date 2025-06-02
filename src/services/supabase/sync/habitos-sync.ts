
import { supabaseConfigService } from "../supabase-config";

/**
 * Service for syncing habitos data with Supabase
 */
export class HabitosSyncService {
  /**
   * Sincroniza hábitos do localStorage para o Supabase
   */
  async syncToSupabase(habitos: any[]): Promise<boolean> {
    const url = supabaseConfigService.getUrl();
    const key = supabaseConfigService.getApiKey();
    
    if (!url || !key || !habitos || habitos.length === 0) {
      console.log("Dados incompletos, não é possível sincronizar hábitos");
      return false;
    }
    
    try {
      console.log("Sincronizando hábitos com o Supabase...");
      
      // Para cada hábito no array
      for (const habito of habitos) {
        const tableName = habito.equipe_id ? 'habitos_equipe' : 'habitos';
        
        // Verificar se o hábito já existe no Supabase
        const checkResponse = await fetch(`${url}/rest/v1/${tableName}?id=eq.${habito.id}`, {
          method: "GET",
          headers: {
            "apikey": key,
            "Authorization": `Bearer ${key}`
          }
        });
        
        const existingHabito = await checkResponse.json();
          
        // Se o hábito não existir, inserir
        if (!existingHabito || existingHabito.length === 0) {
          let habitoData: any = {
            id: habito.id,
            titulo: habito.titulo || habito.nome,
            descricao: habito.descricao || '',
            concluido: habito.concluido || false,
            recorrencia: habito.recorrencia || 'diario',
            data_criacao: habito.data_criacao || new Date().toISOString(),
            data_conclusao: habito.data_conclusao || null
          };

          if (habito.equipe_id) {
            // Para hábitos de equipe
            habitoData.equipe_id = habito.equipe_id;
          } else {
            // Para hábitos individuais
            habitoData.usuario_id = habito.usuario_id || '1';
            habitoData.verificado = habito.verificado || false;
            habitoData.verificacao_necessaria = habito.verificacao_necessaria || false;
            habitoData.horario = habito.horario || null;
            habitoData.evidencia = habito.evidencia || null;
          }

          const insertResponse = await fetch(`${url}/rest/v1/${tableName}`, {
            method: "POST",
            headers: {
              "apikey": key,
              "Authorization": `Bearer ${key}`,
              "Content-Type": "application/json",
              "Prefer": "return=minimal"
            },
            body: JSON.stringify(habitoData)
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
}
