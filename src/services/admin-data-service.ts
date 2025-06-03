
import { AdminMetrics } from "@/types/admin";

// Tipos para os dados do painel administrativo
export type EmpresaAdmin = {
  id: string;
  nome: string;
  segmento: string;
  plano: string;
  data_cadastro: string;
  tokens_consumidos: number;
  tokens_limite: number;
  status: "ativo" | "inativo" | "trial";
};

export const adminDataService = {
  // Função para carregar os dados do painel administrativo
  async carregarDadosAdmin(): Promise<{ empresas: EmpresaAdmin[]; estatisticas: AdminMetrics }> {
    // Em um app real, estes dados viriam do Supabase
    // Por enquanto, usamos dados fictícios para demonstração
    const dadosFicticios: EmpresaAdmin[] = [
      {
        id: "1",
        nome: "TechSolutions Ltda",
        segmento: "Tecnologia",
        plano: "Enterprise",
        data_cadastro: "2025-02-15",
        tokens_consumidos: 125000,
        tokens_limite: 500000,
        status: "ativo"
      },
      {
        id: "2",
        nome: "Vendas Globais SA",
        segmento: "Varejo",
        plano: "Professional",
        data_cadastro: "2025-03-21",
        tokens_consumidos: 43200,
        tokens_limite: 100000,
        status: "ativo"
      },
      {
        id: "3",
        nome: "Marketing Digital Express",
        segmento: "Marketing",
        plano: "Starter",
        data_cadastro: "2025-04-05",
        tokens_consumidos: 9800,
        tokens_limite: 50000,
        status: "trial"
      },
      {
        id: "4",
        nome: "Consultoria Nexus",
        segmento: "Consultoria",
        plano: "Professional",
        data_cadastro: "2025-03-10",
        tokens_consumidos: 78500,
        tokens_limite: 100000,
        status: "ativo"
      },
      {
        id: "5",
        nome: "Imobiliária Futuro",
        segmento: "Imobiliário",
        plano: "Starter",
        data_cadastro: "2025-02-28",
        tokens_consumidos: 12300,
        tokens_limite: 50000,
        status: "inativo"
      }
    ];

    // Calcula estatísticas
    const ativas = dadosFicticios.filter(e => e.status === "ativo").length;
    const inativas = dadosFicticios.filter(e => e.status === "inativo").length;
    const trial = dadosFicticios.filter(e => e.status === "trial").length;
    const tokens = dadosFicticios.reduce((acc, emp) => acc + emp.tokens_consumidos, 0);
    
    // Cálculo simplificado da receita
    const receita = dadosFicticios.reduce((acc, emp) => {
      if (emp.status !== "ativo") return acc;
      switch(emp.plano) {
        case "Enterprise": return acc + 997;
        case "Professional": return acc + 497;
        case "Starter": return acc + 197;
        default: return acc;
      }
    }, 0);

    const estatisticas: AdminMetrics = {
      totalEmpresas: dadosFicticios.length,
      empresasAtivas: ativas,
      empresasInativas: inativas,
      empresasTrial: trial,
      tokensTotais: tokens,
      receitaMensal: receita
    };

    return { empresas: dadosFicticios, estatisticas };
  }
};
