
import { useState, useEffect } from "react";
import { useSupabase } from "./use-supabase";
import { toast } from "sonner";
import { TeamMetrics } from "./team-dashboard/types";
import { SupabaseTeamService } from "./team-dashboard/supabase-team-service";
import { OfflineTeamService } from "./team-dashboard/offline-team-service";

export const useTeamDashboard = () => {
  const { supabase, isConfigured } = useSupabase();
  const [teamMetrics, setTeamMetrics] = useState<TeamMetrics[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTeamMetrics = async () => {
    try {
      setLoading(true);
      console.log("Buscando métricas de equipes...");
      
      // Obtém o usuário atual do localStorage
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      if (!user) {
        console.warn("Usuário não encontrado no localStorage");
        toast.error("Usuário não encontrado. Faça login novamente.");
        setTeamMetrics([]);
        return;
      }
      
      console.log("Usuário encontrado:", user);
      
      if (supabase && isConfigured) {
        const supabaseService = new SupabaseTeamService(supabase);
        const metrics = await supabaseService.fetchTeamMetrics(user);
        setTeamMetrics(metrics);
      } else {
        // Modo offline ou sem conexão com Supabase
        console.log("Supabase não está configurado ou conectado");
        
        const equipesData = OfflineTeamService.loadTeamsFromStorage(user);
        
        const vendedores = localStorage.getItem('vendedores') 
          ? JSON.parse(localStorage.getItem('vendedores')!) 
          : [];
          
        const habitos = localStorage.getItem('habitos_equipe') 
          ? JSON.parse(localStorage.getItem('habitos_equipe')!) 
          : [];
          
        if (equipesData.length === 0) {
          console.log("Nenhuma equipe encontrada no localStorage");
          setTeamMetrics([]);
          return;
        }
          
        const metrics = OfflineTeamService.processTeamsOffline(equipesData, vendedores, habitos, user);
        setTeamMetrics(metrics);
      }
    } catch (error) {
      console.error("Erro ao buscar métricas das equipes:", error);
      toast.error("Não foi possível carregar as métricas das equipes");
      setTeamMetrics([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Sincroniza equipes quando o componente monta
  useEffect(() => {
    // Primeiro busca as métricas
    fetchTeamMetrics();
    
    // Se Supabase estiver configurado, tenta sincronizar as equipes do localStorage
    if (supabase && isConfigured) {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      if (user && user.teams && user.teams.length > 0) {
        const supabaseService = new SupabaseTeamService(supabase);
        supabaseService.syncTeamsToSupabase(user.teams);
      }
    }
  }, [supabase, isConfigured]);
  
  return {
    teamMetrics,
    loading,
    refreshTeamMetrics: fetchTeamMetrics
  };
};
