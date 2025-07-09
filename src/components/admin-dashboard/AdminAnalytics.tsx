
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminMetrics } from "@/types/admin";
import { BarChart, Users, PieChart } from "lucide-react";

interface AdminAnalyticsProps {
  metrics: AdminMetrics;
}

const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({ metrics }) => {
  // Format to Brazilian Real
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Companies
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalEmpresas}</div>
          <p className="text-xs text-muted-foreground">
            {metrics.empresasAtivas} active, {metrics.empresasTrial} on trial, {metrics.empresasInativas} inactive
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Monthly Recurring Revenue
          </CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(metrics.receitaMensal)}</div>
          <p className="text-xs text-muted-foreground">
            +5% from previous month
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Tokens Consumed
          </CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.tokensTotais.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Approximately {Math.round(metrics.tokensTotais / 1000)} thousand tokens
          </p>
        </CardContent>
      </Card>
      
      {/* Monthly revenue chart would go here */}
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Crescimento Mensal</CardTitle>
          <CardDescription>
            Novos clientes e receitas dos últimos 6 meses
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Gráfico de crescimento aqui
          </div>
        </CardContent>
      </Card>
      
      {/* Plan distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Planos</CardTitle>
          <CardDescription>
            Distribuição de clientes por plano de assinatura
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Gráfico de pizza aqui
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
