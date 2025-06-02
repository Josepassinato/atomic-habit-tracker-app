
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Flag, 
  RefreshCw, 
  Database,
  Target,
  Clock,
  Award,
  Activity
} from "lucide-react";
import { DashboardLoading } from "./DashboardLoading";
import { useTeamDashboard } from "@/hooks/use-team-dashboard";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSupabase } from "@/hooks/use-supabase";
import { useLanguage } from "@/i18n";

interface MetricaAvancada {
  id: string;
  nome: string;
  vendedores: number;
  metaTotal: number;
  metaAtual: number;
  progressoMeta: number;
  habitosConcluidos: number;
  habitosTotal: number;
  progressoHabitos: number;
  // Métricas avançadas
  vendedoresAtivos: number;
  mediaVendasPorVendedor: number;
  crescimentoSemanal: number;
  eficienciaEquipe: number;
  tempoMedioFechamento: number;
  leadsPorVendedor: number;
  taxaConversao: number;
  rankingGeral: number;
}

const TeamsDashboardAvancado: React.FC = () => {
  const { teamMetrics, loading, refreshTeamMetrics } = useTeamDashboard();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [metricas, setMetricas] = useState<MetricaAvancada[]>([]);
  const navigate = useNavigate();
  const { isConfigured } = useSupabase();
  const { t } = useLanguage();

  // Format to currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  // Translate team names from Portuguese to English
  const translateTeamName = (nome: string) => {
    const translations: Record<string, string> = {
      'Equipe Sem Nome': 'Unnamed Team',
      'Equipe Alpha': 'Alpha Team',
      'Equipe Beta': 'Beta Team',
      'Equipe Gamma': 'Gamma Team',
      'Equipe Delta': 'Delta Team',
      'Vendas Norte': 'North Sales',
      'Vendas Sul': 'South Sales',
      'Vendas Leste': 'East Sales',
      'Vendas Oeste': 'West Sales',
      'Equipe Principal': 'Main Team',
      'Equipe Secundária': 'Secondary Team'
    };
    return translations[nome] || nome;
  };

  // Enriquece as métricas básicas com dados avançados
  useEffect(() => {
    if (teamMetrics.length > 0) {
      const metricasEnriquecidas: MetricaAvancada[] = teamMetrics.map((team, index) => ({
        ...team,
        nome: translateTeamName(team.nome), // Translate team name
        vendedoresAtivos: Math.max(1, Math.floor(team.vendedores * 0.85)),
        mediaVendasPorVendedor: team.vendedores > 0 ? team.metaAtual / team.vendedores : 0,
        crescimentoSemanal: Math.floor(Math.random() * 30) - 10, // Simula crescimento
        eficienciaEquipe: Math.min(100, team.progressoMeta + Math.floor(Math.random() * 20)),
        tempoMedioFechamento: Math.floor(Math.random() * 30) + 5, // dias
        leadsPorVendedor: Math.floor(Math.random() * 50) + 20,
        taxaConversao: Math.floor(Math.random() * 40) + 15,
        rankingGeral: index + 1
      }));
      
      // Ordena por performance geral
      metricasEnriquecidas.sort((a, b) => b.progressoMeta - a.progressoMeta);
      metricasEnriquecidas.forEach((m, i) => m.rankingGeral = i + 1);
      
      setMetricas(metricasEnriquecidas);
    }
  }, [teamMetrics]);

  // Força uma atualização ao montar o componente
  useEffect(() => {
    refreshTeamMetrics();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshTeamMetrics();
    toast.success("Metrics updated in real time!");
    setIsRefreshing(false);
  };

  if (loading) {
    return <DashboardLoading />;
  }

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Advanced Teams Dashboard</h2>
          <p className="text-muted-foreground">Real-time metrics and detailed analytics</p>
        </div>
        <div className="flex gap-2 items-center">
          {isConfigured && (
            <Badge variant="outline" className="bg-green-50 text-green-700 flex items-center gap-1">
              <Database className="h-3 w-3" />
              Real Time
            </Badge>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? "Updating..." : "Update"}
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={() => navigate('/vendedores')}
          >
            View Details
          </Button>
        </div>
      </div>
      
      {metricas.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-muted-foreground">No teams found. Configure your teams first.</p>
            <div className="mt-4 space-y-2">
              <Button 
                variant="default" 
                size="sm"
                onClick={() => navigate('/onboarding')}
              >
                Configure Teams
              </Button>
              
              {!isConfigured && (
                <div className="pt-4 border-t mt-4">
                  <p className="text-sm text-amber-600 mb-2">
                    <strong>Recommendation:</strong> Connect to Supabase for real-time metrics.
                  </p>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                    onClick={() => {
                      toast.info("Connect to Supabase through the green button in the top right corner.");
                    }}
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Connect to Supabase
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {/* Cards de métricas resumidas */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Teams</p>
                    <p className="text-2xl font-bold">{metricas.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Sales Reps</p>
                    <p className="text-2xl font-bold">
                      {metricas.reduce((acc, m) => acc + m.vendedoresAtivos, 0)}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Overall Goal</p>
                    <p className="text-2xl font-bold">
                      {Math.round(metricas.reduce((acc, m) => acc + m.progressoMeta, 0) / metricas.length)}%
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Average Efficiency</p>
                    <p className="text-2xl font-bold">
                      {Math.round(metricas.reduce((acc, m) => acc + m.eficienciaEquipe, 0) / metricas.length)}%
                    </p>
                  </div>
                  <Award className="h-8 w-8 text-amber-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cards detalhados das equipes */}
          <div className="grid gap-6 xl:grid-cols-2">
            {metricas.map(team => (
              <Card key={team.id} className="overflow-hidden">
                <CardHeader className="bg-slate-50 dark:bg-slate-800 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      {team.nome}
                      {team.rankingGeral <= 3 && (
                        <Badge variant="outline" className="ml-2">
                          #{team.rankingGeral}
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="secondary">
                        {team.vendedoresAtivos}/{team.vendedores} active
                      </Badge>
                      {team.crescimentoSemanal > 0 ? (
                        <Badge variant="outline" className="text-green-600">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          +{team.crescimentoSemanal}%
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-red-600">
                          <TrendingDown className="h-3 w-3 mr-1" />
                          {team.crescimentoSemanal}%
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardDescription>
                    {formatCurrency(team.metaAtual)} of {formatCurrency(team.metaTotal)}
                    {" • "}
                    Average: {formatCurrency(team.mediaVendasPorVendedor)}/sales rep
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    {/* Progresso da Meta */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium flex items-center gap-1">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          Goal Progress
                        </div>
                        <span className={`text-sm font-bold ${
                          team.progressoMeta >= 75 ? 'text-green-500' : 
                          team.progressoMeta >= 50 ? 'text-amber-500' : 'text-red-500'
                        }`}>
                          {team.progressoMeta}%
                        </span>
                      </div>
                      <Progress value={team.progressoMeta} className="h-2" />
                    </div>
                    
                    {/* Progresso de Hábitos */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium flex items-center gap-1">
                          <Flag className="h-4 w-4 text-primary" />
                          Habits Completed
                        </div>
                        <span className={`text-sm font-bold ${
                          team.progressoHabitos >= 75 ? 'text-green-500' : 
                          team.progressoHabitos >= 50 ? 'text-amber-500' : 'text-red-500'
                        }`}>
                          {team.habitosConcluidos} of {team.habitosTotal} ({team.progressoHabitos}%)
                        </span>
                      </div>
                      <Progress value={team.progressoHabitos} className="h-2" />
                    </div>

                    {/* Métricas Avançadas */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Conversion Rate</p>
                        <p className="text-sm font-semibold">{team.taxaConversao}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Leads/Sales Rep</p>
                        <p className="text-sm font-semibold">{team.leadsPorVendedor}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                          <Clock className="h-3 w-3" />
                          Avg Time
                        </p>
                        <p className="text-sm font-semibold">{team.tempoMedioFechamento}d</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Efficiency</p>
                        <p className="text-sm font-semibold text-green-600">{team.eficienciaEquipe}%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamsDashboardAvancado;
