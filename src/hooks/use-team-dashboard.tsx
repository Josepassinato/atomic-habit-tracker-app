
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
      
      if (supabase && isConfigured) {
        // Fetch teams
        const { data: equipes, error: equipeError } = await supabase
          .from('equipes')
          .select('*');
          
        if (equipeError) throw equipeError;
        
        if (!equipes || equipes.length === 0) {
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
        
        setTeamMetrics(metrics);
      } else {
        setTeamMetrics([]);
        toast.error("Configuração do Supabase não encontrada. Conecte-se para visualizar dados.");
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
