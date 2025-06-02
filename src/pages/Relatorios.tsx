
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import RelatoriosAvancados from "@/components/relatorios/RelatoriosAvancados";
import NotificacoesEmpresa from "@/components/notificacoes/NotificacoesEmpresa";
import VerificacaoHabitos from "@/components/habitos/VerificacaoHabitos";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useRelatorioData } from "@/hooks/useRelatorioData";
import { RelatoriosHeader } from "@/components/relatorios/RelatoriosHeader";
import { RelatoriosEmailDialog } from "@/components/relatorios/RelatoriosEmailDialog";
import { RelatoriosTabsNavigation } from "@/components/relatorios/RelatoriosTabsNavigation";
import { RelatoriosDashboardContent } from "@/components/relatorios/RelatoriosDashboardContent";
import { RelatoriosFooter } from "@/components/relatorios/RelatoriosFooter";
import { downloadRelatorio } from "@/services/relatorios-service";

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
    generateReport,
    isLoading
  } = useRelatorioData();
  
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);

  useEffect(() => {
    // Aqui faremos a integração com Supabase para verificar autenticação
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  const handleDownloadRelatorio = () => {
    downloadRelatorio(
      periodoSelecionado,
      equipeId,
      totalVendas,
      totalMetas,
      percentualMeta,
      mediaConversao,
      vendedoresFiltrados,
      equipes
    );
  };

  // Convert between English and Portuguese period types
  const convertPeriodToPortuguese = (period: "week" | "month" | "quarter" | "year"): "semana" | "mes" | "trimestre" | "ano" => {
    const mapping = {
      "week": "semana",
      "month": "mes", 
      "quarter": "trimestre",
      "year": "ano"
    } as const;
    return mapping[period];
  };

  const convertPeriodToEnglish = (period: "semana" | "mes" | "trimestre" | "ano"): "week" | "month" | "quarter" | "year" => {
    const mapping = {
      "semana": "week",
      "mes": "month",
      "trimestre": "quarter", 
      "ano": "year"
    } as const;
    return mapping[period];
  };

  const handleSetPeriodo = (periodo: "semana" | "mes" | "trimestre" | "ano") => {
    const englishPeriod = convertPeriodToEnglish(periodo);
    setPeriodoSelecionado(englishPeriod);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="container flex-1 py-6">
        <RelatoriosHeader
          onDownloadRelatorio={handleDownloadRelatorio}
          onOpenEmailDialog={() => setEmailDialogOpen(true)}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <RelatoriosTabsNavigation />
          
          <RelatoriosDashboardContent
            totalVendas={totalVendas}
            totalMetas={totalMetas}
            percentualMeta={percentualMeta}
            mediaConversao={mediaConversao}
            isLoading={isLoading}
            periodoSelecionado={convertPeriodToPortuguese(periodoSelecionado)}
            setPeriodoSelecionado={handleSetPeriodo}
            equipeId={equipeId}
            setEquipeId={setEquipeId}
            date={date}
            setDate={setDate}
            equipes={equipes}
            onGenerateReport={generateReport}
            vendedoresFiltrados={vendedoresFiltrados}
          />

          <TabsContent value="relatorios-avancados">
            <RelatoriosAvancados />
          </TabsContent>

          <TabsContent value="notificacoes">
            <NotificacoesEmpresa />
          </TabsContent>
          
          <TabsContent value="habitos">
            <VerificacaoHabitos />
          </TabsContent>
        </Tabs>
      </main>
      
      <RelatoriosFooter />

      <RelatoriosEmailDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        periodoSelecionado={convertPeriodToPortuguese(periodoSelecionado)}
        equipeId={equipeId}
        date={date}
        totalVendas={totalVendas}
        totalMetas={totalMetas}
        percentualMeta={percentualMeta}
        mediaConversao={mediaConversao}
      />
    </div>
  );
};

export default Relatorios;
