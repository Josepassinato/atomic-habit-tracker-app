import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import AdminUsers from "@/components/admin-dashboard/AdminUsers";
import AdminPlans from "@/components/admin-dashboard/AdminPlans";
import AdminSettings from "@/components/admin-dashboard/AdminSettings";
import AdminAnalytics from "@/components/admin-dashboard/AdminAnalytics";
import { AdminMetrics, AdminSettings as AdminSettingsType } from "@/types/admin";
import { getCurrentUser } from "@/utils/permissions";
import { openAIService } from "@/services/openai-service";
import { supabaseService } from "@/services/supabase";
import { useAdminData } from "@/hooks/useAdminData";
import PageNavigation from "@/components/PageNavigation";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("analytics");
  
  // Usar o hook para dados reais
  const { empresas, estatisticas, loading: dadosLoading, error } = useAdminData();

  // Admin settings
  const [settings, setSettings] = useState<AdminSettingsType>({
    openAIApiKey: "",
    supabaseApiKey: "",
    supabaseUrl: "",
    systemEmailAddress: "admin@habitus.com",
    allowTrialAccounts: true,
    trialDurationDays: 14,
    defaultTokenLimit: 50000
  });

  // Check if current user is admin
  useEffect(() => {
    const checkAdminAccess = async () => {
      const user = getCurrentUser();
      
      if (!user) {
        toast.error("Você precisa estar logado para acessar esta página");
        navigate("/auth");
        return;
      }
      
      const isAdminUser = user.role === "admin";
      setIsAdmin(isAdminUser);
      
      if (!isAdminUser) {
        toast.error("Você não tem permissão para acessar esta página");
        navigate("/dashboard");
      } else {
        // Load admin settings
        await fetchAdminSettings();
      }
      
      setLoading(false);
    };
    
    checkAdminAccess();
  }, [navigate]);

  // Fetch admin settings (não dados fictícios)
  const fetchAdminSettings = async () => {
    // Carregar configurações de APIs de forma síncrona
    const openAIKey = openAIService.getApiKeySync() || "";
    const supabaseKey = supabaseService.getApiKey() || "";
    const supabaseUrl = supabaseService.getUrl() || "";

    // Tentativa de carregar configurações do banco de dados
    if (supabaseKey && supabaseUrl) {
      try {
        await supabaseService.loadConfigFromDatabase();
        // Após carregar do banco, atualizamos as variáveis locais novamente
        const refreshedOpenAIKey = openAIService.getApiKeySync() || "";
        const refreshedSupabaseKey = supabaseService.getApiKey() || "";
        const refreshedSupabaseUrl = supabaseService.getUrl() || "";
        
        setSettings(prev => ({
          ...prev,
          openAIApiKey: refreshedOpenAIKey,
          supabaseApiKey: refreshedSupabaseKey,
          supabaseUrl: refreshedSupabaseUrl
        }));
        
        console.log("Configurações carregadas do banco de dados");
      } catch (error) {
        console.error("Erro ao carregar configurações do banco:", error);
      }
    } else {
      // Se não há conexão com Supabase, carregamos do localStorage
      const savedSettings = localStorage.getItem("adminSettings");
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({
          ...parsedSettings,
          openAIApiKey: openAIKey,
          supabaseApiKey: supabaseKey,
          supabaseUrl: supabaseUrl
        });
      } else {
        setSettings(prev => ({
          ...prev,
          openAIApiKey: openAIKey,
          supabaseApiKey: supabaseKey,
          supabaseUrl: supabaseUrl
        }));
      }
    }
  };

  // Save settings
  const saveSettings = (newSettings: AdminSettingsType) => {
    setSettings(newSettings);
    localStorage.setItem("adminSettings", JSON.stringify(newSettings));
    
    // Se o Supabase estiver configurado, tentamos salvar no banco também
    if (supabaseService.isConfigured()) {
      supabaseService.saveConfigToDatabase();
      toast.success("Configurações salvas com sucesso no banco de dados");
    } else {
      toast.success("Configurações salvas localmente");
    }
  };

  if (loading || dadosLoading) {
    return (
      <div className="min-h-screen bg-background">
        <PageNavigation />
        <div className="flex items-center justify-center h-screen">Carregando...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Component will be unmounted when navigate is called
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <PageNavigation />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Erro ao carregar dados</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageNavigation />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Painel de Administração</h2>
          {empresas.length === 0 && (
            <div className="text-sm text-amber-600">
              Nenhuma empresa encontrada no banco de dados
            </div>
          )}
        </div>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="plans">Planos</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="analytics" className="space-y-4">
            <AdminAnalytics metrics={estatisticas} />
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <AdminUsers />
          </TabsContent>
          
          <TabsContent value="plans" className="space-y-4">
            <AdminPlans />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <AdminSettings settings={settings} onSaveSettings={saveSettings} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
