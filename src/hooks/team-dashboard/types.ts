
export interface TeamData {
  id: string;
  name: string; // Changed from 'nome' to 'name'
  empresa_id: string;
  meta_total?: number;
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
  // Portuguese compatibility properties
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
  equipe_id: string;
  vendas_total: number;
  meta_atual: number;
  taxa_conversao: number;
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
  equipe_id: string;
}

export interface HabitData {
  id: string;
  title: string;
  completed: boolean;
  equipe_id: string;
}
