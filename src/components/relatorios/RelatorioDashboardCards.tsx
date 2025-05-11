
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardCardProps {
  title: string;
  value: string | number;
  formatValue?: (value: number) => string;
}

const DashboardCard = ({ title, value }: DashboardCardProps) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

interface RelatorioDashboardCardsProps {
  totalVendas: number;
  totalMetas: number;
  percentualMeta: number;
  mediaConversao: number;
}

export const RelatorioDashboardCards: React.FC<RelatorioDashboardCardsProps> = ({
  totalVendas,
  totalMetas,
  percentualMeta,
  mediaConversao,
}) => {
  return (
    <div className="grid gap-6 md:grid-cols-4">
      <DashboardCard 
        title="Vendas Totais" 
        value={`R$ ${totalVendas.toLocaleString('pt-BR')}`} 
      />
      
      <DashboardCard 
        title="Meta Total" 
        value={`R$ ${totalMetas.toLocaleString('pt-BR')}`} 
      />
      
      <DashboardCard 
        title="% da Meta" 
        value={`${percentualMeta}%`} 
      />
      
      <DashboardCard 
        title="Taxa de Conversão" 
        value={`${mediaConversao}%`} 
      />
    </div>
  );
};
