
import { AdminMetrics } from "@/types/admin";
import { supabase } from "@/integrations/supabase/client";

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
    try {
      // Buscar empresas reais do Supabase
      const { data: companies, error: companiesError } = await supabase
        .from('companies')
        .select('*');

      if (companiesError) {
        console.error("Erro ao buscar empresas:", companiesError);
        throw companiesError;
      }

      // Buscar dados de usuários/profiles para completar as informações
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*');

      if (profilesError) {
        console.error("Erro ao buscar profiles:", profilesError);
      }

      // Mapear dados reais para o formato esperado
      const empresasReais: EmpresaAdmin[] = (companies || []).map(company => ({
        id: company.id,
        nome: company.name || 'Empresa sem nome',
        segmento: company.segment || 'Não definido',
        plano: 'Professional', // Por enquanto, usar um plano padrão
        data_cadastro: new Date(company.created_at).toISOString().split('T')[0],
        tokens_consumidos: 0, // Será implementado quando tivermos sistema de tokens
        tokens_limite: 100000, // Limite padrão
        status: "ativo" as const
      }));

      // Calcular estatísticas reais
      const totalEmpresas = empresasReais.length;
      const empresasAtivas = empresasReais.filter(e => e.status === "ativo").length;
      const empresasInativas = empresasReais.filter(e => e.status === "inativo").length;
      const empresasTrial = empresasReais.filter(e => e.status === "trial").length;
      const tokensTotais = empresasReais.reduce((acc, emp) => acc + emp.tokens_consumidos, 0);

      // Cálculo simplificado da receita baseado nos planos ativos
      const receitaMensal = empresasAtivas * 497; // Assumindo plano Professional

      const estatisticas: AdminMetrics = {
        totalEmpresas,
        empresasAtivas,
        empresasInativas,
        empresasTrial,
        tokensTotais,
        receitaMensal
      };

      return { empresas: empresasReais, estatisticas };

    } catch (error) {
      console.error("Erro ao carregar dados administrativos:", error);
      
      // Em caso de erro, retornar dados vazios
      const estatisticasVazias: AdminMetrics = {
        totalEmpresas: 0,
        empresasAtivas: 0,
        empresasInativas: 0,
        empresasTrial: 0,
        tokensTotais: 0,
        receitaMensal: 0
      };

      return { empresas: [], estatisticas: estatisticasVazias };
    }
  }
};
