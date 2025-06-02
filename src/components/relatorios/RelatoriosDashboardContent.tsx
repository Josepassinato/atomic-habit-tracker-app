
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { RelatorioDashboardCards } from "./RelatorioDashboardCards";
import { RelatorioFiltros } from "./RelatorioFiltros";
import { RelatorioTabs } from "./RelatorioTabs";

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

interface RelatoriosDashboardContentProps {
  totalVendas: number;
  totalMetas: number;
  percentualMeta: number;
  mediaConversao: number;
  isLoading: boolean;
  periodoSelecionado: "semana" | "mes" | "trimestre" | "ano";
  setPeriodoSelecionado: (periodo: "semana" | "mes" | "trimestre" | "ano") => void;
  equipeId: string;
  setEquipeId: (id: string) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  equipes: Equipe[];
  onGenerateReport: () => void;
  vendedoresFiltrados: Vendedor[];
}

export const RelatoriosDashboardContent: React.FC<RelatoriosDashboardContentProps> = ({
  totalVendas,
  totalMetas,
  percentualMeta,
  mediaConversao,
  isLoading,
  periodoSelecionado,
  setPeriodoSelecionado,
  equipeId,
  setEquipeId,
  date,
  setDate,
  equipes,
  onGenerateReport,
  vendedoresFiltrados,
}) => {
  return (
    <TabsContent value="dashboard" className="space-y-6">
      {/* Card de resumo */}
      <RelatorioDashboardCards 
        totalVendas={totalVendas}
        totalMetas={totalMetas}
        percentualMeta={percentualMeta}
        mediaConversao={mediaConversao}
        isLoading={isLoading}
      />

      {/* Filtros de relatório */}
      <RelatorioFiltros 
        periodoSelecionado={periodoSelecionado}
        setPeriodoSelecionado={setPeriodoSelecionado}
        equipeId={equipeId}
        setEquipeId={setEquipeId}
        date={date}
        setDate={setDate}
        equipes={equipes}
        onGenerateReport={onGenerateReport}
      />

      {/* Tabs para diferentes visões */}
      <RelatorioTabs 
        vendedoresFiltrados={vendedoresFiltrados}
        equipes={equipes}
      />
    </TabsContent>
  );
};
