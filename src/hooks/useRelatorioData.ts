
import { useState, useEffect } from "react";
import { useTeams, useSalesReps } from "@/hooks/use-supabase";

export const useRelatorioData = () => {
  const { teams, loading: teamsLoading } = useTeams();
  const { salesReps, loading: salesRepsLoading } = useSalesReps();
  
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "quarter" | "year">("month");
  const [teamId, setTeamId] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const isLoading = teamsLoading || salesRepsLoading;
  
  // Calculate metrics using correct English property names
  const totalSales = salesReps.reduce((sum, rep) => sum + rep.total_sales, 0);
  const totalGoals = salesReps.reduce((sum, rep) => sum + rep.current_goal, 0);
  const goalPercentage = totalGoals > 0 ? Math.round((totalSales / totalGoals) * 100) : 0;
  const averageConversion = salesReps.length > 0 
    ? salesReps.reduce((sum, rep) => sum + rep.conversion_rate, 0) / salesReps.length 
    : 0;

  // Filter sales reps by team if selected
  const filteredSalesReps = teamId 
    ? salesReps.filter(rep => rep.team_id === teamId)
    : salesReps;

  const generateReport = () => {
    console.log("Generating report for period:", selectedPeriod);
  };

  // Convert to expected format for Portuguese component names
  const vendedoresFiltrados = filteredSalesReps.map(rep => ({
    id: rep.id,
    nome: rep.name,
    equipe: teams.find(t => t.id === rep.team_id)?.name || 'Unknown',
    vendas: rep.total_sales,
    meta: rep.current_goal,
    conversao: rep.conversion_rate
  }));

  const equipes = teams.map(team => ({
    id: team.id,
    nome: team.name
  }));

  return {
    // English names
    teams,
    salesReps,
    filteredSalesReps,
    selectedPeriod,
    setSelectedPeriod,
    teamId,
    setTeamId,
    date,
    setDate,
    totalSales,
    totalGoals,
    goalPercentage,
    averageConversion,
    generateReport,
    isLoading,
    
    // Portuguese names for backward compatibility
    equipes,
    vendedoresFiltrados,
    periodoSelecionado: selectedPeriod,
    setPeriodoSelecionado: setSelectedPeriod,
    equipeId: teamId,
    setEquipeId: setTeamId,
    totalVendas: totalSales,
    totalMetas: totalGoals,
    percentualMeta: goalPercentage,
    mediaConversao: averageConversion
  };
};
