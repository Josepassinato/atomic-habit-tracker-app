
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import DashboardSummary from "@/components/DashboardSummary";
import HabitosTracker from "@/components/HabitosTracker";
import MetasVendas from "@/components/MetasVendas";
import IntegracoesCRM from "@/components/IntegracoesCRM";
import ConsultoriaIA from "@/components/ConsultoriaIA";
import { Toaster } from "@/components/ui/sonner";
import DashboardPersonalizavel from "@/components/dashboard/DashboardPersonalizavel";
import { useNotificacoes } from "@/components/notificacoes/NotificacoesProvider";

const Dashboard = () => {
  const navigate = useNavigate();
  const { adicionarNotificacao } = useNotificacoes();
  
  useEffect(() => {
    // Verificação simples de autenticação
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    }
    
    // Demonstração do sistema de notificações - em um app real, seria baseado em eventos
    adicionarNotificacao({
      titulo: "Bem-vindo de volta!",
      mensagem: "Você tem 3 hábitos para concluir hoje.",
      tipo: "info"
    });
  }, [navigate, adicionarNotificacao]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Toaster />
      <Header isLoggedIn={true} />
      <main className="container flex-1 py-6">
        <DashboardPersonalizavel>
          <DashboardSummary />
          
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h2 className="mb-3 text-xl font-semibold">Desempenho de Vendas</h2>
                  <MetasVendas />
                </div>
                <div>
                  <h2 className="mb-3 text-xl font-semibold">Hábitos Atômicos</h2>
                  <HabitosTracker />
                </div>
              </div>
            </div>
            <div>
              <h2 className="mb-3 text-xl font-semibold">Assistente IA</h2>
              <ConsultoriaIA />
              <div className="mt-6">
                <IntegracoesCRM />
              </div>
            </div>
          </div>
        </DashboardPersonalizavel>
      </main>
      <footer className="border-t bg-card py-4">
        <div className="container text-center text-sm text-muted-foreground">
          Habitus © 2025 - O futuro da automação de vendas e performance
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
