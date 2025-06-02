
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useSupabase } from "@/hooks/use-supabase";
import { toast } from "sonner";
import { useLanguage } from "@/i18n";

const DashboardSummary = () => {
  const { supabase, isConfigured } = useSupabase();
  const { t } = useLanguage();
  const [metaVendas, setMetaVendas] = useState<number>(85);
  const [habitosCumpridos, setHabitosCumpridos] = useState<number>(72);
  const [bonusTotal, setBonusTotal] = useState<number>(2.5);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        if (supabase && isConfigured) {
          // Buscar dados de vendas do usuário atual
          const userId = localStorage.getItem("user") 
            ? JSON.parse(localStorage.getItem("user")!).id 
            : null;
            
          if (!userId) {
            console.log("User not found, using default data");
            return;
          }
          
          // Buscar metas de vendas
          const { data: metasData, error: metasError } = await supabase
            .from('vendedores')
            .select('meta_atual, vendas_total')
            .eq('id', userId)
            .single();
            
          if (metasError) {
            console.log("No sales data found, using defaults");
            return;
          }
          
          if (metasData) {
            const meta = metasData.meta_atual || 0;
            const vendas = metasData.vendas_total || 0;
            const percentual = meta > 0 ? Math.min(Math.round((vendas / meta) * 100), 100) : 85;
            setMetaVendas(percentual);
          }
          
          // Buscar hábitos
          const { data: habitosData, error: habitosError } = await supabase
            .from('habitos')
            .select('*')
            .eq('usuario_id', userId);
            
          if (habitosError) {
            console.log("No habits data found, using defaults");
            return;
          }
          
          if (habitosData && habitosData.length > 0) {
            const totalHabitos = habitosData.length;
            const concluidos = habitosData.filter(h => h.concluido).length;
            const percentualHabitos = Math.round((concluidos / totalHabitos) * 100);
            setHabitosCumpridos(percentualHabitos);
          }
          
          // Calcular bônus
          const bonusMetas = metaVendas >= 100 ? 3 : metaVendas >= 80 ? 1.5 : 0;
          const bonusHabitos = habitosCumpridos >= 90 ? 2 : habitosCumpridos >= 70 ? 1 : 0;
          setBonusTotal(bonusMetas + bonusHabitos);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        // Continue with default values instead of showing error
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [supabase, isConfigured, metaVendas, habitosCumpridos]);

  const getSalesGoalText = () => {
    if (metaVendas >= 100) return "Complete";
    if (metaVendas >= 80) return "On Track";
    return "In Progress";
  };

  const getHabitsText = () => {
    if (habitosCumpridos >= 90) return "Excellent";
    if (habitosCumpridos >= 70) return "Good";
    return "Needs Improvement";
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Sales Goal</CardTitle>
          <CardDescription>Current month progress</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{metaVendas}%</div>
                <Badge variant={metaVendas >= 100 ? "default" : metaVendas >= 80 ? "secondary" : "outline"}>
                  {getSalesGoalText()}
                </Badge>
              </div>
              <Progress className="mt-2" value={metaVendas} />
              <p className="mt-2 text-sm text-muted-foreground">
                Current bonus: {metaVendas >= 100 ? "3%" : metaVendas >= 80 ? "1.5%" : "0%"}
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Atomic Habits</CardTitle>
          <CardDescription>Daily completion</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{habitosCumpridos}%</div>
                <Badge variant={habitosCumpridos >= 90 ? "default" : habitosCumpridos >= 70 ? "secondary" : "outline"}>
                  {getHabitsText()}
                </Badge>
              </div>
              <Progress className="mt-2" value={habitosCumpridos} />
              <p className="mt-2 text-sm text-muted-foreground">
                Current bonus: {habitosCumpridos >= 90 ? "2%" : habitosCumpridos >= 70 ? "1%" : "0%"}
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Total Bonus</CardTitle>
          <CardDescription>Accumulated reward</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{bonusTotal}%</div>
                <Badge>Monthly Reward</Badge>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Sales Goal</span>
                  <span className="font-medium">{metaVendas >= 100 ? "3.0%" : metaVendas >= 80 ? "1.5%" : "0.0%"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Habits Completion</span>
                  <span className="font-medium">{habitosCumpridos >= 90 ? "2.0%" : habitosCumpridos >= 70 ? "1.0%" : "0.0%"}</span>
                </div>
                <div className="flex items-center justify-between border-t pt-2 font-medium">
                  <span>Total</span>
                  <span>{bonusTotal}%</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSummary;
