
export interface TeamHabit {
  id: string;
  equipe_id: string;
  nome: string;
  descricao: string;
  frequencia: "diario" | "semanal" | "mensal";
  concluido: boolean;
  data_criacao: string;
  data_conclusao?: string;
}

export interface TeamGoal {
  id: string;
  equipe_id: string;
  nome: string;
  valor: number;
  atual: number;
  percentual: number;
  periodo: "mensal" | "trimestral" | "anual";
  data_inicio: string;
  data_fim: string;
}

export interface TeamMember {
  id: string;
  equipe_id: string;
  nome: string;
  email: string;
  cargo: string;
  meta_individual: number;
  meta_atual: number;
  habitos_concluidos: number;
}

export const sampleTeamHabits: TeamHabit[] = [
  {
    id: "1",
    equipe_id: "1",
    nome: "Daily Standup",
    descricao: "Reunião diária de 15 minutos",
    frequencia: "diario",
    concluido: true,
    data_criacao: new Date().toISOString(),
  },
  {
    id: "2",
    equipe_id: "1",
    nome: "Feedback de Clientes",
    descricao: "Coletar feedback de pelo menos 3 clientes",
    frequencia: "semanal",
    concluido: false,
    data_criacao: new Date().toISOString(),
  },
  {
    id: "3",
    equipe_id: "2",
    nome: "Revisão de Casos",
    descricao: "Analisar casos de sucesso e insucesso",
    frequencia: "semanal",
    concluido: false,
    data_criacao: new Date().toISOString(),
  }
];
