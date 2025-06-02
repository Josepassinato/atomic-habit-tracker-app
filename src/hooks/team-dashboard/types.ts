
export interface TeamData {
  id: string;
  name: string;
  company_id: string;
  total_goal?: number;
  created_at: string;
}

export interface TeamMetrics {
  id: string;
  name: string;
  salesRepsCount: number;
  totalSales: number;
  goalTarget: number;
  goalPercentage: number;
  averageConversion: number;
  completedHabits: number;
  totalHabits: number;
  habitsPercentage: number;
  // Portuguese compatibility properties (for backward compatibility)
  nome: string;
  vendedores: number;
  metaTotal: number;
  metaAtual: number;
  progressoMeta: number;
  habitosConcluidos: number;
  habitosTotal: number;
  progressoHabitos: number;
}

export interface SalesRepData {
  id: string;
  name: string;
  email: string;
  team_id: string;
  total_sales: number;
  current_goal: number;
  conversion_rate: number;
}

// Add missing type exports for backward compatibility
export interface VendedorData {
  id: string;
  nome: string;
  email: string;
  equipe_id: string;
  vendas_total: number;
  meta_atual: number;
  taxa_conversao: number;
}

export interface HabitoData {
  id: string;
  title: string;
  concluido: boolean;
  team_id: string;
}

export interface HabitData {
  id: string;
  title: string;
  completed: boolean;
  team_id: string;
}
