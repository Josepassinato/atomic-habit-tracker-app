
import { TeamMetrics, TeamData } from "./types";
import { TeamMetricsCalculator } from "./team-metrics-calculator";

export class SupabaseTeamService {
  constructor(private supabase: any) {}

  async syncTeamsToSupabase(teams: any[]): Promise<void> {
    if (!this.supabase) return;
    
    try {
      console.log("Sincronizando equipes com o Supabase...");
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;
      
      if (!user) {
        console.warn("Usuário não encontrado, não é possível sincronizar com Supabase");
        return;
      }
      
      // Para cada equipe no array
      for (const team of teams) {
        // Verifica se a equipe já existe no Supabase
        const { data: existingTeam, error: checkError } = await this.supabase
          .from('equipes')
          .select('*')
          .eq('id', team.id)
          .single();
          
        if (checkError && checkError.code !== 'PGRST116') {
          console.error("Erro ao verificar equipe:", checkError);
          continue;
        }
        
        // Se a equipe não existir, insere
        if (!existingTeam) {
          const { error: insertError } = await this.supabase
            .from('equipes')
            .insert({
              id: team.id,
              nome: team.nome || team.name, // Compatibilidade com diferentes formatos
              empresa_id: user.empresa_id || '1',
              criado_em: new Date().toISOString()
            });
            
          if (insertError) {
            console.error("Erro ao inserir equipe no Supabase:", insertError);
          } else {
            console.log(`Equipe ${team.nome || team.name} sincronizada com Supabase`);
          }
        }
      }
      
      console.log("Sincronização com Supabase concluída");
    } catch (error) {
      console.error("Erro ao sincronizar com Supabase:", error);
    }
  }

  async fetchTeamMetrics(user: any): Promise<TeamMetrics[]> {
    // Fetch teams
    let query = this.supabase.from('equipes').select('*');
    
    // Se o usuário não for admin, filtra apenas para sua empresa
    if (user.role !== 'admin' && user.empresa_id) {
      query = query.eq('empresa_id', user.empresa_id);
    }
    
    const { data: equipes, error: equipeError } = await query;
      
    if (equipeError) {
      console.error("Erro ao buscar equipes:", equipeError);
      throw equipeError;
    }
    
    console.log("Equipes encontradas:", equipes);
    
    // Se não houver equipes no Supabase mas houver no localStorage, vamos sincronizá-las
    if ((!equipes || equipes.length === 0) && user.teams && user.teams.length > 0) {
      console.log("Sincronizando equipes do localStorage para o Supabase...");
      await this.syncTeamsToSupabase(user.teams);
      
      // Busca novamente após sincronização
      const { data: syncedEquipes, error: syncError } = await query;
      
      if (syncError) {
        console.error("Erro ao buscar equipes sincronizadas:", syncError);
        throw syncError;
      }
      
      if (syncedEquipes && syncedEquipes.length > 0) {
        console.log("Equipes sincronizadas encontradas:", syncedEquipes);
        return this.processTeams(syncedEquipes);
      }
    }
    
    if (!equipes || equipes.length === 0) {
      console.log("Nenhuma equipe encontrada");
      return [];
    }
    
    return this.processTeams(equipes);
  }

  private async processTeams(equipes: TeamData[]): Promise<TeamMetrics[]> {
    const metrics: TeamMetrics[] = [];
    
    // Fetch data for each team
    for (const equipe of equipes) {
      // Get vendedores for the team
      const { data: vendedoresData, error: vendedoresError } = await this.supabase
        .from('vendedores')
        .select('*')
        .eq('equipe_id', equipe.id);
        
      if (vendedoresError) throw vendedoresError;
      
      const vendedores = vendedoresData || [];
      console.log(`Vendedores para equipe ${equipe.nome}:`, vendedores);
      
      // Get habits for the team
      const { data: habitosData, error: habitosError } = await this.supabase
        .from('habitos_equipe')
        .select('*')
        .eq('equipe_id', equipe.id);
        
      if (habitosError) throw habitosError;
      
      const habitos = habitosData || [];
      
      // Calculate team metrics
      const teamMetrics = TeamMetricsCalculator.calculateTeamMetrics(equipe, vendedores, habitos);
      metrics.push(teamMetrics);
    }
    
    return metrics;
  }
}
