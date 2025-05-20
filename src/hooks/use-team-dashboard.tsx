
import { useState, useEffect } from "react";
import { useSupabase } from "./use-supabase";
import { toast } from "sonner";

interface TeamMetrics {
  id: string;
  nome: string;
  vendedores: number;
  metaTotal: number;
  metaAtual: number;
  progressoMeta: number;
  habitosConcluidos: number;
  habitosTotal: number;
  progressoHabitos: number;
}

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
        // Fetch teams
        let query = supabase.from('equipes').select('*');
        
        // Se o usuário não for admin, filtra apenas para sua empresa
        if (user.role !== 'admin' && user.empresa_id) {
          query = query.eq('empresa_id', user.empresa_id);
        }
        
        const { data: equipes, error: equipeError } = await query;
          
        if (equipeError) {
          console.error("Erro ao buscar equipes:", equipeError);
          throw equipeError;
        }
        
        console.log("Equipes encontradas:", equipes);
        
        if (!equipes || equipes.length === 0) {
          console.log("Nenhuma equipe encontrada");
          setTeamMetrics([]);
          return;
        }
        
        const metrics: TeamMetrics[] = [];
        
        // Fetch data for each team
        for (const equipe of equipes) {
          // Get vendedores for the team
          const { data: vendedoresData, error: vendedoresError } = await supabase
            .from('vendedores')
            .select('*')
            .eq('equipe_id', equipe.id);
            
          if (vendedoresError) throw vendedoresError;
          
          const vendedores = vendedoresData || [];
          console.log(`Vendedores para equipe ${equipe.nome}:`, vendedores);
          
          // Get habits for the team
          const { data: habitosData, error: habitosError } = await supabase
            .from('habitos_equipe')
            .select('*')
            .eq('equipe_id', equipe.id);
            
          if (habitosError) throw habitosError;
          
          const habitos = habitosData || [];
          const habitosConcluidos = habitos.filter(h => h.concluido).length;
          
          // Calculate team metrics
          let metaTotal = 0;
          let metaAtual = 0;
          
          vendedores.forEach((v) => {
            metaTotal += v.meta_atual || 0;
            metaAtual += v.vendas_total || 0;
          });
          
          const progressoMeta = metaTotal > 0 ? Math.round((metaAtual / metaTotal) * 100) : 0;
          const progressoHabitos = habitos.length > 0 ? Math.round((habitosConcluidos / habitos.length) * 100) : 0;
          
          metrics.push({
            id: equipe.id,
            nome: equipe.nome,
            vendedores: vendedores.length,
            metaTotal,
            metaAtual,
            progressoMeta,
            habitosConcluidos,
            habitosTotal: habitos.length,
            progressoHabitos
          });
        }
        
        console.log("Métricas calculadas:", metrics);
        setTeamMetrics(metrics);
      } else {
        // Modo offline ou sem conexão com Supabase
        console.log("Supabase não está configurado ou conectado");
        
        // Se não temos Supabase, tentamos usar dados do localStorage
        const equipes = localStorage.getItem('equipes') 
          ? JSON.parse(localStorage.getItem('equipes')!) 
          : [];
          
        const vendedores = localStorage.getItem('vendedores') 
          ? JSON.parse(localStorage.getItem('vendedores')!) 
          : [];
          
        const habitos = localStorage.getItem('habitos_equipe') 
          ? JSON.parse(localStorage.getItem('habitos_equipe')!) 
          : [];
          
        if (equipes.length === 0) {
          setTeamMetrics([]);
          return;
        }
          
        const metrics: TeamMetrics[] = [];
        
        for (const equipe of equipes) {
          const vendedoresEquipe = vendedores.filter((v: any) => v.equipe_id === equipe.id);
          const habitosEquipe = habitos.filter((h: any) => h.equipe_id === equipe.id);
          const habitosConcluidos = habitosEquipe.filter((h: any) => h.concluido).length;
          
          let metaTotal = 0;
          let metaAtual = 0;
          
          vendedoresEquipe.forEach((v: any) => {
            metaTotal += v.meta_atual || 0;
            metaAtual += v.vendas_total || 0;
          });
          
          const progressoMeta = metaTotal > 0 ? Math.round((metaAtual / metaTotal) * 100) : 0;
          const progressoHabitos = habitosEquipe.length > 0 
            ? Math.round((habitosConcluidos / habitosEquipe.length) * 100) 
            : 0;
            
          metrics.push({
            id: equipe.id,
            nome: equipe.nome,
            vendedores: vendedoresEquipe.length,
            metaTotal,
            metaAtual,
            progressoMeta,
            habitosConcluidos,
            habitosTotal: habitosEquipe.length,
            progressoHabitos
          });
        }
        
        console.log("Métricas calculadas do localStorage:", metrics);
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
  
  useEffect(() => {
    fetchTeamMetrics();
  }, [supabase, isConfigured]);
  
  return {
    teamMetrics,
    loading,
    refreshTeamMetrics: fetchTeamMetrics
  };
};
