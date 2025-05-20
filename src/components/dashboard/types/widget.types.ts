
export interface Widget {
  id: string;
  tipo: string;
  titulo: string;
  tamanho: "pequeno" | "medio" | "grande";
  ativo: boolean;
  ordem: number;
}

export const defaultWidgets: Widget[] = [
  { id: "habitos", tipo: "habitos", titulo: "Hábitos Atômicos", tamanho: "medio", ativo: true, ordem: 1 },
  { id: "metas", tipo: "metas", titulo: "Metas de Vendas", tamanho: "medio", ativo: true, ordem: 2 },
  { id: "consultoria", tipo: "consultoria", titulo: "Consultoria IA", tamanho: "grande", ativo: true, ordem: 3 },
  { id: "crm", tipo: "crm", titulo: "Integrações CRM", tamanho: "pequeno", ativo: true, ordem: 4 },
  { id: "relatorios", tipo: "relatorios", titulo: "Relatórios Rápidos", tamanho: "medio", ativo: false, ordem: 5 },
  { id: "calendario", tipo: "calendario", titulo: "Calendário de Atividades", tamanho: "pequeno", ativo: false, ordem: 6 },
];
