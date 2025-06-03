
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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("analytics");

  // Admin metrics
  const [metrics, setMetrics] = useState<AdminMetrics>({
    totalEmpresas: 0,
    empresasAtivas: 0, 
    empresasInativas: 0,
    empresasTrial: 0,
    tokensTotais: 0,
    receitaMensal: 0
  });

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
        navigate("/login");
        return;
      }
      
      const isAdminUser = user.role === "admin";
      setIsAdmin(isAdminUser);
      
      if (!isAdminUser) {
        toast.error("Você não tem permissão para acessar esta página");
        navigate("/dashboard");
      } else {
        // Load admin data if user is admin
        await fetchAdminData();
      }
      
      setLoading(false);
    };
    
    checkAdminAccess();
  }, [navigate]);

  // Fetch admin data
  const fetchAdminData = async () => {
    // In a real app, this would fetch from Supabase
    // For now, using mock data
    
    // Mock metrics
    setMetrics({
      totalEmpresas: 12,
      empresasAtivas: 8,
      empresasInativas: 2,
      empresasTrial: 2,
      tokensTotais: 456000,
      receitaMensal: 3988
    });

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

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  if (!isAdmin) {
    return null; // Component will be unmounted when navigate is called
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Painel de Administração</h2>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="plans">Planos</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analytics" className="space-y-4">
          <AdminAnalytics metrics={metrics} />
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
  );
};

export default AdminDashboard;
