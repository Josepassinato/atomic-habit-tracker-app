
import { TeamMetrics, TeamData } from "./types";
import { TeamMetricsCalculator } from "./team-metrics-calculator";

export class OfflineTeamService {
  static processTeamsOffline(equipesData: any[], vendedores: any[], habitos: any[], user: any): TeamMetrics[] {
    const metrics: TeamMetrics[] = [];
    
    for (const equipe of equipesData) {
      const vendedoresEquipe = vendedores.filter((v: any) => v.equipe_id === equipe.id);
      const habitosEquipe = habitos.filter((h: any) => h.equipe_id === equipe.id);
      
      const teamMetrics = TeamMetricsCalculator.calculateOfflineTeamMetrics(
        equipe,
        vendedoresEquipe,
        habitosEquipe,
        user
      );
      
      metrics.push(teamMetrics);
    }
    
    return metrics;
  }

  static loadTeamsFromStorage(user: any): any[] {
    const equipesData = [];
    
    // Tenta carregar dados do usuário primeiro (onde as equipes são armazenadas durante o onboarding)
    const teamsFromUser = user.teams || [];
    
    // Se temos equipes no objeto user, convertemos para o formato correto
    if (teamsFromUser.length > 0) {
      equipesData.push(...teamsFromUser.map((team: any) => ({
        id: team.id,
        nome: team.name,
        empresa_id: user.empresa_id || '1', // valor padrão
        criado_em: new Date().toISOString()
      })));
      
      console.log("Equipes carregadas do objeto user:", equipesData);
    }
    
    // Se não temos equipes no user, tentamos carregar do localStorage 'equipes'
    if (equipesData.length === 0) {
      const equipes = localStorage.getItem('equipes') 
        ? JSON.parse(localStorage.getItem('equipes')!) 
        : [];
        
      equipesData.push(...equipes);
      console.log("Equipes carregadas do localStorage 'equipes':", equipesData);
    }
    
    // Salva as equipes carregadas de volta no localStorage para garantir consistência
    if (equipesData.length > 0) {
      localStorage.setItem('equipes', JSON.stringify(equipesData));
      
      // Salva também no objeto user.teams para garantir consistência
      if (!user.teams || user.teams.length === 0) {
        user.teams = equipesData.map((team: any) => ({
          id: team.id,
          name: team.nome,
          members: [],
          metas: { mensal: team.metaTotal || 100000 }
        }));
        localStorage.setItem('user', JSON.stringify(user));
      }
    }
    
    return equipesData;
  }
}
