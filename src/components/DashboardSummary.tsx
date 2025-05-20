
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useSupabase } from "@/hooks/use-supabase";
import { toast } from "sonner";

const DashboardSummary = () => {
  const { supabase, isConfigured } = useSupabase();
  const [metaVendas, setMetaVendas] = useState<number>(0);
  const [habitosCumpridos, setHabitosCumpridos] = useState<number>(0);
  const [bonusTotal, setBonusTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

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
            toast.error("Usuário não encontrado");
            return;
          }
          
          // Buscar metas de vendas
          const { data: metasData, error: metasError } = await supabase
            .from('vendedores')
            .select('meta_atual, vendas_total')
            .eq('id', userId)
            .single();
            
          if (metasError) throw metasError;
          
          if (metasData) {
            const meta = metasData.meta_atual || 0;
            const vendas = metasData.vendas_total || 0;
            const percentual = meta > 0 ? Math.min(Math.round((vendas / meta) * 100), 100) : 0;
            setMetaVendas(percentual);
          }
          
          // Buscar hábitos
          const { data: habitosData, error: habitosError } = await supabase
            .from('habitos')
            .select('*')
            .eq('usuario_id', userId);
            
          if (habitosError) throw habitosError;
          
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
        } else {
          toast.error("Configuração do Supabase não encontrada");
        }
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
        toast.error("Não foi possível carregar os dados do dashboard");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [supabase, isConfigured]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Meta de Vendas</CardTitle>
          <CardDescription>Progresso do mês atual</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm text-muted-foreground">Carregando...</span>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{metaVendas}%</div>
                <Badge variant={metaVendas >= 100 ? "default" : metaVendas >= 80 ? "secondary" : "outline"}>
                  {metaVendas >= 100 ? "Completo" : metaVendas >= 80 ? "No Caminho" : "Em Progresso"}
                </Badge>
              </div>
              <Progress className="mt-2" value={metaVendas} />
              <p className="mt-2 text-sm text-muted-foreground">
                Bônus atual: {metaVendas >= 100 ? "3%" : metaVendas >= 80 ? "1.5%" : "0%"}
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Hábitos Atômicos</CardTitle>
          <CardDescription>Cumprimento diário</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm text-muted-foreground">Carregando...</span>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{habitosCumpridos}%</div>
                <Badge variant={habitosCumpridos >= 90 ? "default" : habitosCumpridos >= 70 ? "secondary" : "outline"}>
                  {habitosCumpridos >= 90 ? "Excelente" : habitosCumpridos >= 70 ? "Bom" : "Precisa Melhorar"}
                </Badge>
              </div>
              <Progress className="mt-2" value={habitosCumpridos} />
              <p className="mt-2 text-sm text-muted-foreground">
                Bônus atual: {habitosCumpridos >= 90 ? "2%" : habitosCumpridos >= 70 ? "1%" : "0%"}
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Bônus Total</CardTitle>
          <CardDescription>Premiação acumulada</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm text-muted-foreground">Carregando...</span>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{bonusTotal}%</div>
                <Badge>Premiação Mensal</Badge>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Meta de Vendas</span>
                  <span className="font-medium">{metaVendas >= 100 ? "3.0%" : metaVendas >= 80 ? "1.5%" : "0.0%"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Cumprimento de Hábitos</span>
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
