
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardCardProps {
  title: string;
  value: string | number;
  isLoading?: boolean;
}

const DashboardCard = ({ title, value, isLoading = false }: DashboardCardProps) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">Carregando...</span>
        </div>
      ) : (
        <div className="text-2xl font-bold">{value}</div>
      )}
    </CardContent>
  </Card>
);

interface RelatorioDashboardCardsProps {
  totalVendas: number;
  totalMetas: number;
  percentualMeta: number;
  mediaConversao: number;
  isLoading?: boolean;
}

export const RelatorioDashboardCards: React.FC<RelatorioDashboardCardsProps> = ({
  totalVendas,
  totalMetas,
  percentualMeta,
  mediaConversao,
  isLoading = false,
}) => {
  return (
    <div className="grid gap-6 md:grid-cols-4">
      <DashboardCard 
        title="Vendas Totais" 
        value={`R$ ${totalVendas.toLocaleString('pt-BR')}`}
        isLoading={isLoading}
      />
      
      <DashboardCard 
        title="Meta Total" 
        value={`R$ ${totalMetas.toLocaleString('pt-BR')}`}
        isLoading={isLoading} 
      />
      
      <DashboardCard 
        title="% da Meta" 
        value={`${percentualMeta}%`}
        isLoading={isLoading} 
      />
      
      <DashboardCard 
        title="Taxa de Conversão" 
        value={`${mediaConversao}%`}
        isLoading={isLoading} 
      />
    </div>
  );
};
