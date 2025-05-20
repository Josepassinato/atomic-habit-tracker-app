import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { RelatorioDashboardCards } from "@/components/relatorios/RelatorioDashboardCards";
import { RelatorioFiltros } from "@/components/relatorios/RelatorioFiltros";
import { RelatorioTabs } from "@/components/relatorios/RelatorioTabs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRelatorioData } from "@/hooks/useRelatorioData";
import VerificacaoHabitos from "@/components/habitos/VerificacaoHabitos";
import { Button } from "@/components/ui/button";
import { Download, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

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
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailDestino, setEmailDestino] = useState("");

  useEffect(() => {
    // Aqui faremos a integração com Supabase para verificar autenticação
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  const handleDownloadRelatorio = () => {
    // Simula o download de um relatório
    const relatorioData = {
      data: new Date().toLocaleDateString(),
      periodo: periodoSelecionado,
      equipe: equipeId === "todas" ? "Todas as equipes" : equipes.find(e => e.id === equipeId)?.nome,
      vendedores: vendedoresFiltrados,
      metricas: {
        totalVendas,
        totalMetas,
        percentualMeta,
        mediaConversao
      }
    };

    // Converte dados para JSON string
    const jsonString = JSON.stringify(relatorioData, null, 2);
    
    // Cria um blob com os dados
    const blob = new Blob([jsonString], { type: "application/json" });
    
    // Cria um URL do blob
    const url = URL.createObjectURL(blob);
    
    // Cria um link para download
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-vendas-${new Date().toISOString().split('T')[0]}.json`;
    
    // Simula um clique no link
    document.body.appendChild(a);
    a.click();
    
    // Limpa depois do download
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);

    toast.success("Relatório baixado com sucesso!");
  };

  const handleEnviarEmail = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simula o envio do email - em produção seria integrado com backend
    if (!emailDestino || !emailDestino.includes('@')) {
      toast.error("Por favor, insira um e-mail válido.");
      return;
    }

    // Em uma aplicação real, aqui seria feita uma chamada para o backend
    console.log(`Enviando relatório para: ${emailDestino}`);
    console.log({
      periodo: periodoSelecionado,
      equipe: equipeId,
      data: date,
      metricas: {
        totalVendas,
        totalMetas,
        percentualMeta,
        mediaConversao
      }
    });
    
    // Fecha o dialog e mostra feedback
    setEmailDialogOpen(false);
    setEmailDestino("");
    toast.success(`Relatório enviado para ${emailDestino}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="container flex-1 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Relatórios e Acompanhamento</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownloadRelatorio} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Baixar Relatório
            </Button>
            <Button onClick={() => setEmailDialogOpen(true)} className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Enviar por Email
            </Button>
          </div>
        </div>

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

      {/* Dialog para envio por email */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar relatório por email</DialogTitle>
            <DialogDescription>
              Insira o endereço de email para enviar o relatório de desempenho de vendas.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEnviarEmail}>
            <div className="py-4">
              <Input
                placeholder="exemplo@email.com"
                value={emailDestino}
                onChange={(e) => setEmailDestino(e.target.value)}
                type="email"
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEmailDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Enviar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Relatorios;
