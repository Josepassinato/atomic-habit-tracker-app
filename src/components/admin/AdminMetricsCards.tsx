
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart, Users } from "lucide-react";
import { AdminMetrics } from "@/types/admin";

interface AdminMetricsCardsProps {
  estatisticas: AdminMetrics;
}

const AdminMetricsCards: React.FC<AdminMetricsCardsProps> = ({ estatisticas }) => {
  // Formatar para real brasileiro
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Empresas
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{estatisticas.totalEmpresas}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {estatisticas.empresasAtivas} ativas, {estatisticas.empresasTrial} em trial
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Receita Mensal
          </CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatarMoeda(estatisticas.receitaMensal)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            MRR atual
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Tokens Consumidos
          </CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{estatisticas.tokensTotais.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Total de tokens usados
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMetricsCards;
