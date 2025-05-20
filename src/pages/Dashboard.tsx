
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardSummary from "@/components/DashboardSummary";
import HabitosTracker from "@/components/HabitosTracker";
import MetasVendas from "@/components/MetasVendas";
import IntegracoesCRM from "@/components/IntegracoesCRM";
import ConsultoriaIA from "@/components/ConsultoriaIA";
import DashboardPersonalizavel from "@/components/dashboard/DashboardPersonalizavel";
import TeamsDashboard from "@/components/dashboard/TeamsDashboard";
import { useNotificacoes } from "@/components/notificacoes/NotificacoesProvider";

const Dashboard = () => {
  const navigate = useNavigate();
  const { adicionarNotificacao } = useNotificacoes();
  const notificacaoExibida = useRef(false);
  const [carregado, setCarregado] = useState(false);
  
  useEffect(() => {
    // Verificação simples de autenticação
    const user = localStorage.getItem("user");
    if (!user) {
      // Para fins de desenvolvimento, vamos apenas criar um usuário temporário
      localStorage.setItem("user", JSON.stringify({ id: 1, nome: "Usuário de Teste" }));
    }
    
    // Usamos o estado para controlar se a página já foi carregada
    // e apenas mostrar a notificação na primeira vez
    if (!carregado) {
      setCarregado(true);
      
      // Demonstração do sistema de notificações - em um app real, seria baseado em eventos
      // Apenas adiciona a notificação se ainda não foi exibida
      if (!notificacaoExibida.current) {
        // Pequeno delay para evitar múltiplas notificações
        const timer = setTimeout(() => {
          adicionarNotificacao({
            titulo: "Bem-vindo de volta!",
            mensagem: "Você tem 3 hábitos para concluir hoje.",
            tipo: "info"
          });
          notificacaoExibida.current = true;
        }, 1000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [navigate, adicionarNotificacao, carregado]);

  return (
    <div className="flex min-h-screen flex-col">
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
          
          <TeamsDashboard />
        </DashboardPersonalizavel>
      </main>
    </div>
  );
};

export default Dashboard;
