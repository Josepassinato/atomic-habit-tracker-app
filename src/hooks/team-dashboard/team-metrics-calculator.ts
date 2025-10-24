
import { TeamMetrics, TeamData, VendedorData, HabitoData } from "./types";

export class TeamMetricsCalculator {
  static calculateTeamMetrics(
    equipe: TeamData,
    vendedores: VendedorData[],
    habitos: HabitoData[]
  ): TeamMetrics {
    const habitosConcluidos = habitos.filter(h => h.concluido).length;
    
    let metaTotal = 0;
    let metaAtual = 0;
    
    vendedores.forEach((v) => {
      metaTotal += v.meta_atual || 0;
      metaAtual += v.vendas_total || 0;
    });
    
    const progressoMeta = metaTotal > 0 ? Math.round((metaAtual / metaTotal) * 100) : 0;
    const progressoHabitos = habitos.length > 0 ? Math.round((habitosConcluidos / habitos.length) * 100) : 0;
    
    return {
      id: equipe.id,
      name: equipe.name,
      salesRepsCount: vendedores.length,
      totalSales: metaAtual,
      goalTarget: metaTotal,
      goalPercentage: progressoMeta,
      averageConversion: 0,
      completedHabits: habitosConcluidos,
      totalHabits: habitos.length,
      habitsPercentage: progressoHabitos,
      // Portuguese compatibility
      nome: equipe.name,
      vendedores: vendedores.length,
      metaTotal,
      metaAtual,
      progressoMeta,
      habitosConcluidos,
      habitosTotal: habitos.length,
      progressoHabitos
    };
  }

  static calculateOfflineTeamMetrics(
    equipe: TeamData,
    vendedoresEquipe: VendedorData[],
    habitosEquipe: HabitoData[],
    user: any
  ): TeamMetrics {
    const habitosConcluidos = habitosEquipe.filter((h: any) => h.concluido).length;
    
    let metaTotal = 0;
    let metaAtual = 0;
    
    vendedoresEquipe.forEach((v: any) => {
      metaTotal += v.meta_atual || 0;
      metaAtual += v.vendas_total || 0;
    });
    
    // Se não temos vendedores ainda, usamos valores de meta do objeto de time (onboarding)
    if (metaTotal === 0 && user.teams) {
      const teamConfig = user.teams.find((t: any) => t.id === equipe.id);
      if (teamConfig && teamConfig.metas) {
        metaTotal = Number(teamConfig.metas.mensal) || 100000;
        metaAtual = 0;
      } else {
        metaTotal = equipe.total_goal || 100000;
        metaAtual = 75000;
      }
    }
    
    const progressoMeta = metaTotal > 0 ? Math.round((metaAtual / metaTotal) * 100) : 0;
    const progressoHabitos = habitosEquipe.length > 0 
      ? Math.round((habitosConcluidos / habitosEquipe.length) * 100) 
      : 0;
    
    // Quantidade padrão de vendedores se não houver dados
    const numVendedores = vendedoresEquipe.length > 0 ? vendedoresEquipe.length : 2;
      
    return {
      id: equipe.id,
      name: equipe.name || "Equipe Sem Nome",
      salesRepsCount: numVendedores,
      totalSales: metaAtual,
      goalTarget: metaTotal,
      goalPercentage: progressoMeta,
      averageConversion: 0,
      completedHabits: habitosConcluidos,
      totalHabits: habitosEquipe.length || 0,
      habitsPercentage: progressoHabitos,
      // Portuguese compatibility
      nome: equipe.name || "Equipe Sem Nome",
      vendedores: numVendedores,
      metaTotal,
      metaAtual,
      progressoMeta,
      habitosConcluidos,
      habitosTotal: habitosEquipe.length || 0,
      progressoHabitos
    };
  }
}
