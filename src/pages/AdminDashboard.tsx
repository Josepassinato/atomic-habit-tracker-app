
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSupabase } from "@/hooks/use-supabase";
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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { supabase } = useSupabase();
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
    systemEmailAddress: "admin@habitus.com",
    allowTrialAccounts: true,
    trialDurationDays: 14,
    defaultTokenLimit: 50000
  });

  // Check if current user is admin
  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!supabase) return;
      
      const user = localStorage.getItem("user");
      if (!user) {
        navigate("/login");
        return;
      }
      
      try {
        const userObj = JSON.parse(user);
        
        // Simple check - in production, use Supabase RLS or edge function
        const isAdminUser = userObj.role === "admin";
        setIsAdmin(isAdminUser);
        
        if (!isAdminUser) {
          navigate("/dashboard");
          toast.error("Você não tem permissão para acessar esta página");
        } else {
          // Load admin data if user is admin
          await fetchAdminData();
        }
      } catch (error) {
        console.error("Erro ao verificar permissões:", error);
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminAccess();
  }, [navigate, supabase]);

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

    // Mock settings - in production, fetch from Supabase
    const savedSettings = localStorage.getItem("adminSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  };

  // Save settings
  const saveSettings = (newSettings: AdminSettingsType) => {
    setSettings(newSettings);
    localStorage.setItem("adminSettings", JSON.stringify(newSettings));
    toast.success("Configurações salvas com sucesso");
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
