
export interface TeamMetrics {
  id: string;
  nome: string;
  vendedores: number;
  metaTotal: number;
  metaAtual: number;
  progressoMeta: number;
  habitosConcluidos: number;
  habitosTotal: number;
  progressoHabitos: number;
}

export interface TeamData {
  id: string;
  nome: string;
  empresa_id: string;
  criado_em: string;
}

export interface VendedorData {
  id: string;
  equipe_id: string;
  meta_atual: number;
  vendas_total: number;
}

export interface HabitoData {
  id: string;
  equipe_id: string;
  concluido: boolean;
}
