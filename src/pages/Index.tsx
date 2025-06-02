
import React, { useEffect, useRef } from "react";
import Header from "@/components/Header";
import DashboardSummary from "@/components/DashboardSummary";
import HabitosTracker from "@/components/HabitosTracker";
import MetasVendas from "@/components/MetasVendas";
import IntegracoesCRM from "@/components/IntegracoesCRM";
import ConsultoriaIA from "@/components/ConsultoriaIA";
import { Toaster } from "sonner";
import { NotificacoesBadge, useNotificacoes } from "@/components/notificacoes/NotificacoesProvider";
import { useLanguage } from "@/i18n";

const Index = () => {
  const { adicionarNotificacao } = useNotificacoes();
  const { t } = useLanguage();
  const notificacaoExibida = useRef(false);
  
  useEffect(() => {
    // Demonstração do sistema de notificações - em um app real, seria baseado em eventos
    // Apenas adiciona a notificação se ainda não foi exibida
    if (!notificacaoExibida.current) {
      const welcomeMessage = t('welcomeMessage').replace('{{role}}', 'user') || "Welcome back!";
      const habitsMessage = t('atomicHabits') + " - " + (t('dailyCompletion') || "You have 3 habits to complete today.");
      
      adicionarNotificacao({
        titulo: welcomeMessage,
        mensagem: habitsMessage,
        tipo: "info"
      });
      notificacaoExibida.current = true;
    }
  }, [adicionarNotificacao, t]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Toaster richColors closeButton position="top-right" />
      <Header />
      <main className="container flex-1 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{t('dashboard')}</h1>
          <NotificacoesBadge />
        </div>
        
        <DashboardSummary />
        
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h2 className="mb-3 text-xl font-semibold">{t('goals')}</h2>
                <MetasVendas />
              </div>
              <div>
                <h2 className="mb-3 text-xl font-semibold">{t('atomicHabits')}</h2>
                <HabitosTracker />
              </div>
            </div>
          </div>
          <div>
            <h2 className="mb-3 text-xl font-semibold">{t('settings')}</h2>
            <ConsultoriaIA />
            <div className="mt-6">
              <IntegracoesCRM />
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t bg-card py-4">
        <div className="container text-center text-sm text-muted-foreground">
          Habitus © 2025 - The future of sales automation and performance
        </div>
      </footer>
    </div>
  );
};

export default Index;
