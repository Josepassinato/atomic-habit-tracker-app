
import React, { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLoading } from "./DashboardLoading";
import { useTeamDashboard } from "@/hooks/use-team-dashboard";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const TeamsDashboard: React.FC = () => {
  const { teamMetrics, loading, refreshTeamMetrics } = useTeamDashboard();
  const navigate = useNavigate();

  // Format to Brazilian Real
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  // Força uma atualização ao montar o componente
  useEffect(() => {
    refreshTeamMetrics();
  }, []);

  if (loading) {
    return <DashboardLoading />;
  }

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Desempenho das Equipes</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={refreshTeamMetrics}
          >
            Atualizar
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={() => navigate('/vendedores')}
          >
            Ver Detalhes
          </Button>
        </div>
      </div>
      
      {teamMetrics.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-muted-foreground">Nenhuma equipe encontrada. Verifique sua configuração de equipes.</p>
            <Button 
              variant="outline" 
              size="sm"
              className="mt-4"
              onClick={() => {
                toast.info("Para configurar equipes, acesse a página de vendedores.");
                navigate('/vendedores');
              }}
            >
              Configurar Equipes
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {teamMetrics.map(team => (
            <Card key={team.id} className="overflow-hidden">
              <CardHeader className="bg-slate-50 dark:bg-slate-800 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    {team.nome}
                  </CardTitle>
                  <Badge variant="secondary">{team.vendedores} vendedores</Badge>
                </div>
                <CardDescription>
                  {formatCurrency(team.metaAtual)} de {formatCurrency(team.metaTotal)}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        Progresso da Meta
                      </div>
                      <span className={`text-sm font-bold ${team.progressoMeta >= 75 ? 'text-green-500' : team.progressoMeta >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                        {team.progressoMeta}%
                      </span>
                    </div>
                    <Progress value={team.progressoMeta} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium flex items-center gap-1">
                        <Flag className="h-4 w-4 text-primary" />
                        Hábitos Completados
                      </div>
                      <span className={`text-sm font-bold ${team.progressoHabitos >= 75 ? 'text-green-500' : team.progressoHabitos >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                        {team.habitosConcluidos} de {team.habitosTotal} ({team.progressoHabitos}%)
                      </span>
                    </div>
                    <Progress value={team.progressoHabitos} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamsDashboard;
