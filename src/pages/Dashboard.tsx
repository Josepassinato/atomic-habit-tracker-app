
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardSummary from "@/components/DashboardSummary";
import HabitosTracker from "@/components/HabitosTracker";
import MetasVendas from "@/components/MetasVendas";
import IntegracoesCRM from "@/components/IntegracoesCRM";
import ConsultoriaIA from "@/components/ConsultoriaIA";
import DashboardPersonalizavel from "@/components/dashboard/DashboardPersonalizavel";
import TeamsDashboardAvancado from "@/components/dashboard/TeamsDashboardAvancado";
import { useNotificacoes } from "@/components/notificacoes/NotificacoesProvider";
import { useLanguage } from "@/i18n";

const Dashboard = () => {
  const navigate = useNavigate();
  const { adicionarNotificacao } = useNotificacoes();
  const { t, language } = useLanguage();
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
          const welcomeMessage = language === 'pt' ? "Bem-vindo de volta!" : language === 'es' ? "¡Bienvenido de vuelta!" : "Welcome back!";
          const habitsMessage = language === 'pt' ? "Você tem 3 hábitos para concluir hoje." : language === 'es' ? "Tienes 3 hábitos para completar hoy." : "You have 3 habits to complete today.";
          
          adicionarNotificacao({
            titulo: welcomeMessage,
            mensagem: habitsMessage,
            tipo: "info"
          });
          notificacaoExibida.current = true;
        }, 1000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [navigate, adicionarNotificacao, carregado, language]);

  const getContent = () => {
    switch(language) {
      case 'pt':
        return {
          salesPerformanceTitle: 'Desempenho de Vendas',
          atomicHabitsTitle: 'Hábitos Atômicos',
          aiAssistantTitle: 'Assistente IA'
        };
      case 'es':
        return {
          salesPerformanceTitle: 'Rendimiento de Ventas',
          atomicHabitsTitle: 'Hábitos Atómicos',
          aiAssistantTitle: 'Asistente IA'
        };
      case 'en':
      default:
        return {
          salesPerformanceTitle: 'Sales Performance',
          atomicHabitsTitle: 'Atomic Habits',
          aiAssistantTitle: 'AI Assistant'
        };
    }
  };

  const content = getContent();

  return (
    <div className="flex min-h-screen flex-col">
      <main className="container flex-1 py-6">
        <DashboardPersonalizavel>
          <DashboardSummary />
          
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h2 className="mb-3 text-xl font-semibold">{content.salesPerformanceTitle}</h2>
                  <MetasVendas />
                </div>
                <div>
                  <h2 className="mb-3 text-xl font-semibold">{content.atomicHabitsTitle}</h2>
                  <HabitosTracker />
                </div>
              </div>
            </div>
            <div>
              <h2 className="mb-3 text-xl font-semibold">{content.aiAssistantTitle}</h2>
              <ConsultoriaIA />
              <div className="mt-6">
                <IntegracoesCRM />
              </div>
            </div>
          </div>
          
          <TeamsDashboardAvancado />
        </DashboardPersonalizavel>
      </main>
    </div>
  );
};

export default Dashboard;
