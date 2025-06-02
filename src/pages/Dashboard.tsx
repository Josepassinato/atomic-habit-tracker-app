
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
  const { t } = useLanguage();
  const notificacaoExibida = useRef(false);
  const [carregado, setCarregado] = useState(false);
  
  useEffect(() => {
    // Simple authentication check
    const user = localStorage.getItem("user");
    if (!user) {
      // For development purposes, create a temporary user with English role
      localStorage.setItem("user", JSON.stringify({ 
        id: 1, 
        nome: "Test User",
        role: "salesperson" // Changed from "vendedor" to "salesperson"
      }));
    } else {
      // Update existing user data to use English role
      const userData = JSON.parse(user);
      if (userData.role === "vendedor") {
        userData.role = "salesperson";
        localStorage.setItem("user", JSON.stringify(userData));
      }
    }
    
    // Control if page has been loaded to show notification only once
    if (!carregado) {
      setCarregado(true);
      
      // Only add notification if not already shown
      if (!notificacaoExibida.current) {
        // Small delay to avoid multiple notifications
        const timer = setTimeout(() => {
          const welcomeMessage = t('welcomeMessage').replace('{{role}}', 'salesperson') || "Welcome back!";
          const habitsMessage = t('atomicHabits') + " - " + (t('dailyCompletion') || "You have 3 habits to complete today.");
          
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
  }, [navigate, adicionarNotificacao, carregado, t]);

  return (
    <div className="flex min-h-screen flex-col">
      <main className="container flex-1 py-6">
        <DashboardPersonalizavel>
          <DashboardSummary />
          
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h2 className="mb-3 text-xl font-semibold">Sales Goals</h2>
                  <MetasVendas />
                </div>
                <div>
                  <h2 className="mb-3 text-xl font-semibold">Atomic Habits</h2>
                  <HabitosTracker />
                </div>
              </div>
            </div>
            <div>
              <h2 className="mb-3 text-xl font-semibold">AI Consulting</h2>
              <ConsultoriaIA />
              <div className="mt-6">
                <h3 className="mb-3 text-lg font-semibold">CRM Integrations</h3>
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
