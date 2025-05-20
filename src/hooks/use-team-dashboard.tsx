
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

  // Nova função para sincronizar equipes com o Supabase
  const syncTeamsToSupabase = async (teams: any[]) => {
    if (!supabase || !isConfigured) return;
    
    try {
      console.log("Sincronizando equipes com o Supabase...");
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;
      
      if (!user) {
        console.warn("Usuário não encontrado, não é possível sincronizar com Supabase");
        return;
      }
      
      // Para cada equipe no array
      for (const team of teams) {
        // Verifica se a equipe já existe no Supabase
        const { data: existingTeam, error: checkError } = await supabase
          .from('equipes')
          .select('*')
          .eq('id', team.id)
          .single();
          
        if (checkError && checkError.code !== 'PGRST116') {
          console.error("Erro ao verificar equipe:", checkError);
          continue;
        }
        
        // Se a equipe não existir, insere
        if (!existingTeam) {
          const { error: insertError } = await supabase
            .from('equipes')
            .insert({
              id: team.id,
              nome: team.nome || team.name, // Compatibilidade com diferentes formatos
              empresa_id: user.empresa_id || '1',
              criado_em: new Date().toISOString()
            });
            
          if (insertError) {
            console.error("Erro ao inserir equipe no Supabase:", insertError);
          } else {
            console.log(`Equipe ${team.nome || team.name} sincronizada com Supabase`);
          }
        }
      }
      
      console.log("Sincronização com Supabase concluída");
    } catch (error) {
      console.error("Erro ao sincronizar com Supabase:", error);
    }
  };

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
        
        // Se não houver equipes no Supabase mas houver no localStorage, vamos sincronizá-las
        if ((!equipes || equipes.length === 0) && user.teams && user.teams.length > 0) {
          console.log("Sincronizando equipes do localStorage para o Supabase...");
          await syncTeamsToSupabase(user.teams);
          
          // Busca novamente após sincronização
          const { data: syncedEquipes, error: syncError } = await query;
          
          if (syncError) {
            console.error("Erro ao buscar equipes sincronizadas:", syncError);
            throw syncError;
          }
          
          if (syncedEquipes && syncedEquipes.length > 0) {
            console.log("Equipes sincronizadas encontradas:", syncedEquipes);
            // Continua com as equipes sincronizadas
            const metrics = await processTeams(syncedEquipes);
            setTeamMetrics(metrics);
            return;
          }
        }
        
        if (!equipes || equipes.length === 0) {
          console.log("Nenhuma equipe encontrada");
          setTeamMetrics([]);
          return;
        }
        
        const metrics = await processTeams(equipes);
        setTeamMetrics(metrics);
      } else {
        // Modo offline ou sem conexão com Supabase
        console.log("Supabase não está configurado ou conectado");
        
        // Tenta carregar dados do usuário primeiro (onde as equipes são armazenadas durante o onboarding)
        const teamsFromUser = user.teams || [];
        const equipesData = [];
        
        // Se temos equipes no objeto user, convertemos para o formato correto
        if (teamsFromUser.length > 0) {
          equipesData.push(...teamsFromUser.map((team: any) => ({
            id: team.id,
            nome: team.name,
            empresa_id: user.empresa_id || '1', // valor padrão
            criado_em: new Date().toISOString()
          })));
          
          console.log("Equipes carregadas do objeto user:", equipesData);
        }
        
        // Se não temos equipes no user, tentamos carregar do localStorage 'equipes'
        if (equipesData.length === 0) {
          const equipes = localStorage.getItem('equipes') 
            ? JSON.parse(localStorage.getItem('equipes')!) 
            : [];
            
          equipesData.push(...equipes);
          console.log("Equipes carregadas do localStorage 'equipes':", equipesData);
        }
        
        // Salva as equipes carregadas de volta no localStorage para garantir consistência
        if (equipesData.length > 0) {
          localStorage.setItem('equipes', JSON.stringify(equipesData));
          
          // Salva também no objeto user.teams para garantir consistência
          if (!user.teams || user.teams.length === 0) {
            user.teams = equipesData.map((team: any) => ({
              id: team.id,
              name: team.nome,
              members: [],
              metas: { mensal: team.metaTotal || 100000 }
            }));
            localStorage.setItem('user', JSON.stringify(user));
          }
        }
          
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
          
        const metrics = processTeamsOffline(equipesData, vendedores, habitos, user);
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

  // Função auxiliar para processar métricas de equipes online
  const processTeams = async (equipes: any[]) => {
    const metrics: TeamMetrics[] = [];
    
    // Fetch data for each team
    for (const equipe of equipes) {
      // Get vendedores for the team
      const { data: vendedoresData, error: vendedoresError } = await supabase!
        .from('vendedores')
        .select('*')
        .eq('equipe_id', equipe.id);
        
      if (vendedoresError) throw vendedoresError;
      
      const vendedores = vendedoresData || [];
      console.log(`Vendedores para equipe ${equipe.nome}:`, vendedores);
      
      // Get habits for the team
      const { data: habitosData, error: habitosError } = await supabase!
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
    
    return metrics;
  };

  // Função auxiliar para processar métricas de equipes offline
  const processTeamsOffline = (equipesData: any[], vendedores: any[], habitos: any[], user: any) => {
    const metrics: TeamMetrics[] = [];
    
    for (const equipe of equipesData) {
      const vendedoresEquipe = vendedores.filter((v: any) => v.equipe_id === equipe.id);
      const habitosEquipe = habitos.filter((h: any) => h.equipe_id === equipe.id);
      const habitosConcluidos = habitosEquipe.filter((h: any) => h.concluido).length;
      
      let metaTotal = 0;
      let metaAtual = 0;
      
      vendedoresEquipe.forEach((v: any) => {
        metaTotal += v.meta_atual || 0;
        metaAtual += v.vendas_total || 0;
      });
      
      // Se não temos vendedores ainda, usamos valores de meta do objeto de time (onboarding)
      if (metaTotal === 0 && user.teams) {
        const teamConfig = user.teams.find((t: any) => t.id === equipe.id);
        if (teamConfig && teamConfig.metas) {
          metaTotal = Number(teamConfig.metas.mensal) || 100000;
          metaAtual = Math.floor(Math.random() * metaTotal * 0.8); // Valor aleatório para exemplo
        } else {
          metaTotal = 100000;
          metaAtual = 75000;
        }
      }
      
      const progressoMeta = metaTotal > 0 ? Math.round((metaAtual / metaTotal) * 100) : 0;
      const progressoHabitos = habitosEquipe.length > 0 
        ? Math.round((habitosConcluidos / habitosEquipe.length) * 100) 
        : 0;
      
      // Quantidade padrão de vendedores se não houver dados
      const numVendedores = vendedoresEquipe.length > 0 ? vendedoresEquipe.length : 2;
        
      metrics.push({
        id: equipe.id,
        nome: equipe.nome || "Equipe Sem Nome",
        vendedores: numVendedores,
        metaTotal,
        metaAtual,
        progressoMeta,
        habitosConcluidos,
        habitosTotal: habitosEquipe.length || 0,
        progressoHabitos
      });
    }
    
    return metrics;
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
        syncTeamsToSupabase(user.teams);
      }
    }
  }, [supabase, isConfigured]);
  
  return {
    teamMetrics,
    loading,
    refreshTeamMetrics: fetchTeamMetrics
  };
};
