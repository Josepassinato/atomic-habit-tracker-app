
import { useState } from "react";

interface Vendedor {
  id: string;
  nome: string;
  equipe: string;
  vendas: number;
  meta: number;
  conversao: number;
}

interface Equipe {
  id: string;
  nome: string;
}

export const useRelatorioData = () => {
  // Dados fictícios - serão substituídos por dados do Supabase
  const equipes: Equipe[] = [
    { id: "1", nome: "Equipe Alfa" },
    { id: "2", nome: "Equipe Beta" },
    { id: "3", nome: "Equipe Delta" }
  ];

  const vendedores: Vendedor[] = [
    { id: "1", nome: "João Silva", equipe: "1", vendas: 120000, meta: 150000, conversao: 28 },
    { id: "2", nome: "Maria Santos", equipe: "1", vendas: 180000, meta: 150000, conversao: 35 },
    { id: "3", nome: "Pedro Costa", equipe: "2", vendas: 90000, meta: 100000, conversao: 22 },
    { id: "4", nome: "Ana Oliveira", equipe: "2", vendas: 110000, meta: 100000, conversao: 29 },
    { id: "5", nome: "Carlos Mendes", equipe: "3", vendas: 130000, meta: 120000, conversao: 31 }
  ];

  // Estado para filtros
  const [periodoSelecionado, setPeriodoSelecionado] = useState<"semana" | "mes" | "trimestre" | "ano">("mes");
  const [equipeId, setEquipeId] = useState<string>("todas");
  const [date, setDate] = useState<Date | undefined>(undefined);

  // Filtragem de vendedores por equipe
  const vendedoresFiltrados = equipeId === "todas" 
    ? vendedores 
    : vendedores.filter(vendedor => vendedor.equipe === equipeId);

  // Totais para dashboard
  const totalVendas = vendedores.reduce((acc, v) => acc + v.vendas, 0);
  const totalMetas = vendedores.reduce((acc, v) => acc + v.meta, 0);
  const percentualMeta = Math.round((totalVendas / totalMetas) * 100);
  const mediaConversao = Math.round(vendedores.reduce((acc, v) => acc + v.conversao, 0) / vendedores.length);

  // Função para gerar relatório (a ser implementada com Supabase)
  const generateReport = () => {
    console.log('Gerando relatório com os seguintes filtros:', {
      periodo: periodoSelecionado,
      equipe: equipeId,
      data: date
    });
    // Implementação futura com Supabase
  };

  return {
    equipes,
    vendedores,
    vendedoresFiltrados,
    periodoSelecionado,
    setPeriodoSelecionado,
    equipeId,
    setEquipeId,
    date,
    setDate,
    totalVendas,
    totalMetas,
    percentualMeta,
    mediaConversao,
    generateReport
  };
};
