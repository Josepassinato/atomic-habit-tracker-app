
import React, { useEffect, useRef } from "react";

import DashboardSummary from "@/components/DashboardSummary";
import HabitosTracker from "@/components/HabitosTracker";
import MetasVendas from "@/components/MetasVendas";
import IntegracoesCRM from "@/components/IntegracoesCRM";
import ConsultoriaIA from "@/components/ConsultoriaIA";
import DashboardPersonalizavel from "@/components/dashboard/DashboardPersonalizavel";
import TeamsDashboardAvancado from "@/components/dashboard/TeamsDashboardAvancado";
import { ROIBusinessDashboard } from "@/components/dashboard/ROIBusinessDashboard";
import { GamificationDashboard } from "@/components/gamification/GamificationDashboard";
import PageNavigation from "@/components/PageNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotificacoes } from "@/components/notificacoes/NotificacoesProvider";
import { useRealtimeHabits } from "@/hooks/useRealtimeHabits";
import { useRealtimeGoals } from "@/hooks/useRealtimeGoals";
import { useLanguage } from "@/i18n";
import { useAuth } from "@/components/auth/AuthProvider";

const Dashboard = () => {
  const { adicionarNotificacao } = useNotificacoes();
  const { t } = useLanguage();
  const notificationShown = useRef(false);
  
  // Auth context
  const { user, userProfile } = useAuth();
  const teamId = (userProfile as any)?.team_ids?.[0];
  const userId = user?.id;
  
  // Enable realtime updates
  const { habits, loading: habitsLoading } = useRealtimeHabits(teamId, userId);
  const { goals, loading: goalsLoading } = useRealtimeGoals(teamId, userId);
  
  console.log('Realtime habits:', habits.length, 'goals:', goals.length);
  
  useEffect(() => {
    if (!notificationShown.current) {
      const timer = setTimeout(() => {
        const welcomeMessage = t('welcomeMessage').replace('{{role}}', 'salesperson') || "Welcome back!";
        const habitsMessage = t('atomicHabits') + " - " + (t('dailyCompletion') || "You have 3 habits to complete today.");
        
        adicionarNotificacao({
          titulo: welcomeMessage,
          mensagem: habitsMessage,
          tipo: "info"
        });
        
        notificationShown.current = true;
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [adicionarNotificacao, t]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PageNavigation />
      <main className="container flex-1 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
            <TabsTrigger value="gamification">{t('achievements')}</TabsTrigger>
            <TabsTrigger value="roi">ROI</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
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
          </TabsContent>
          
          <TabsContent value="gamification">
            <GamificationDashboard />
          </TabsContent>
          
          <TabsContent value="roi">
            <ROIBusinessDashboard />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
