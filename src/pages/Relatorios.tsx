
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { RelatorioDashboardCards } from "@/components/relatorios/RelatorioDashboardCards";
import { RelatorioFiltros } from "@/components/relatorios/RelatorioFiltros";
import { RelatorioTabs } from "@/components/relatorios/RelatorioTabs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRelatorioData } from "@/hooks/useRelatorioData";
import VerificacaoHabitos from "@/components/habitos/VerificacaoHabitos";

const Relatorios = () => {
  const navigate = useNavigate();
  const { 
    equipes,
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
  } = useRelatorioData();
  
  const [activeTab, setActiveTab] = useState<string>("desempenho");

  useEffect(() => {
    // Aqui faremos a integração com Supabase para verificar autenticação
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header isLoggedIn={true} />
      <main className="container flex-1 py-6">
        <h1 className="mb-6 text-3xl font-bold">Relatórios e Acompanhamento</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="mb-2">
            <TabsTrigger value="desempenho">Desempenho de Vendas</TabsTrigger>
            <TabsTrigger value="habitos">Verificação de Hábitos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="desempenho" className="space-y-6">
            {/* Card de resumo */}
            <RelatorioDashboardCards 
              totalVendas={totalVendas}
              totalMetas={totalMetas}
              percentualMeta={percentualMeta}
              mediaConversao={mediaConversao}
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
              onGenerateReport={generateReport}
            />

            {/* Tabs para diferentes visões */}
            <RelatorioTabs 
              vendedoresFiltrados={vendedoresFiltrados}
              equipes={equipes}
            />
          </TabsContent>
          
          <TabsContent value="habitos">
            <VerificacaoHabitos />
          </TabsContent>
        </Tabs>
      </main>
      <footer className="border-t bg-white py-4">
        <div className="container text-center text-sm text-muted-foreground">
          Habitus © 2025 - O futuro da automação de vendas e performance
        </div>
      </footer>
    </div>
  );
};

export default Relatorios;
