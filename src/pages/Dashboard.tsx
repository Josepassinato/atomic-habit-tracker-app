
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
    // Simple authentication check
    const user = localStorage.getItem("user");
    if (!user) {
      // For development purposes, create a temporary user
      localStorage.setItem("user", JSON.stringify({ id: 1, nome: "Test User" }));
    }
    
    // Control if page has been loaded to show notification only once
    if (!carregado) {
      setCarregado(true);
      
      // Only add notification if not already shown
      if (!notificacaoExibida.current) {
        // Small delay to avoid multiple notifications
        const timer = setTimeout(() => {
          const welcomeMessage = t('welcomeMessage').replace('{{role}}', 'user') || "Welcome back!";
          const habitsMessage = language === 'pt' ? "Você tem 3 hábitos para concluir hoje." : 
                                language === 'es' ? "Tienes 3 hábitos para completar hoy." : 
                                "You have 3 habits to complete today.";
          
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
  }, [navigate, adicionarNotificacao, carregado, language, t]);

  // Get localized content
  const getSectionTitles = () => {
    switch(language) {
      case 'pt':
        return {
          salesPerformance: 'Desempenho de Vendas',
          atomicHabits: 'Hábitos Atômicos',
          aiAssistant: 'Assistente IA'
        };
      case 'es':
        return {
          salesPerformance: 'Rendimiento de Ventas',
          atomicHabits: 'Hábitos Atómicos',
          aiAssistant: 'Asistente IA'
        };
      case 'en':
      default:
        return {
          salesPerformance: 'Sales Performance',
          atomicHabits: 'Atomic Habits',
          aiAssistant: 'AI Assistant'
        };
    }
  };

  const sectionTitles = getSectionTitles();

  return (
    <div className="flex min-h-screen flex-col">
      <main className="container flex-1 py-6">
        <DashboardPersonalizavel>
          <DashboardSummary />
          
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h2 className="mb-3 text-xl font-semibold">{sectionTitles.salesPerformance}</h2>
                  <MetasVendas />
                </div>
                <div>
                  <h2 className="mb-3 text-xl font-semibold">{sectionTitles.atomicHabits}</h2>
                  <HabitosTracker />
                </div>
              </div>
            </div>
            <div>
              <h2 className="mb-3 text-xl font-semibold">{sectionTitles.aiAssistant}</h2>
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
