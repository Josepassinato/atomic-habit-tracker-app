
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Flag, RefreshCw, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLoading } from "./DashboardLoading";
import { useTeamDashboard } from "@/hooks/use-team-dashboard";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSupabase } from "@/hooks/use-supabase";

const TeamsDashboard: React.FC = () => {
  const { teamMetrics, loading, refreshTeamMetrics } = useTeamDashboard();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();
  const { isConfigured } = useSupabase();

  // Format to USD currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  // Force update when component mounts
  useEffect(() => {
    refreshTeamMetrics();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshTeamMetrics();
    toast.success("Data updated successfully!");
    setIsRefreshing(false);
  };

  if (loading) {
    return <DashboardLoading />;
  }

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Team Performance</h2>
        <div className="flex gap-2 items-center">
          {isConfigured && (
            <Badge variant="outline" className="bg-green-50 text-green-700 flex items-center gap-1">
              <Database className="h-3 w-3" />
              Synchronized
            </Badge>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? "Updating..." : "Refresh"}
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
      
      {teamMetrics.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-muted-foreground">No teams found. Check your team configuration.</p>
            <div className="mt-4 space-y-2">
              <Button 
                variant="default" 
                size="sm"
                onClick={() => {
                  navigate('/onboarding');
                }}
              >
                Configure Teams
              </Button>
              
              {!isConfigured && (
                <div className="pt-4 border-t mt-4">
                  <p className="text-sm text-amber-600 mb-2">
                    <strong>Recommendation:</strong> Connect to Supabase to ensure your teams are saved in the cloud.
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
        <div className="grid gap-4 md:grid-cols-2">
          {teamMetrics.map(team => (
            <Card key={team.id} className="overflow-hidden">
              <CardHeader className="bg-slate-50 dark:bg-slate-800 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    {team.nome}
                  </CardTitle>
                  <Badge variant="secondary">{team.vendedores} sales reps</Badge>
                </div>
                <CardDescription>
                  {formatCurrency(team.metaAtual)} of {formatCurrency(team.metaTotal)}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        Goal Progress
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
                        Habits Completed
                      </div>
                      <span className={`text-sm font-bold ${team.progressoHabitos >= 75 ? 'text-green-500' : team.progressoHabitos >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                        {team.habitosConcluidos} of {team.habitosTotal} ({team.progressoHabitos}%)
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
