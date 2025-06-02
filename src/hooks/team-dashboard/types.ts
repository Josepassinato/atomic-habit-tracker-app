
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

export interface HabitData {
  id: string;
  title: string;
  completed: boolean;
  equipe_id: string;
}
