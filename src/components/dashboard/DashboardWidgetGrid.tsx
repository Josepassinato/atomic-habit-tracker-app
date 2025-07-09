
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Widget } from "./types/widget.types";
import { useLanguage } from "@/i18n";
import DashboardSummary from "@/components/DashboardSummary";
import HabitosTracker from "@/components/HabitosTracker";
import MetasVendas from "@/components/MetasVendas";
import IntegracoesCRM from "@/components/IntegracoesCRM";
import RealtimeNotifications from "@/components/dashboard/RealtimeNotifications";
import ConsultoriaIA from "@/components/ConsultoriaIA";

interface DashboardWidgetGridProps {
  widgetsAtivos: Widget[];
}

export const DashboardWidgetGrid: React.FC<DashboardWidgetGridProps> = ({ widgetsAtivos }) => {
  const { t } = useLanguage();
  
  // Translation mapping for widget titles
  const translateWidgetTitle = (titulo: string) => {
    const translations: Record<string, string> = {
      'Hábitos Atômicos': 'Atomic Habits',
      'Metas de Vendas': 'Sales Goals',
      'Consultoria IA': 'AI Consulting',
      'Integrações CRM': 'CRM Integrations',
      'habitos': 'Atomic Habits',
      'metas': 'Sales Goals',
      'consultoria': 'AI Consulting',
      'crm': 'CRM Integrations',
      'realtime': 'Real-time Updates'
    };
    
    return translations[titulo] || titulo;
  };
  
  const renderWidgetContent = (widget: Widget) => {
    switch (widget.tipo) {
      case 'habits':
        return <HabitosTracker />;
      case 'goals':
        return <MetasVendas />;
      case 'ai':
        return <ConsultoriaIA />;
      case 'crm':
        return <IntegracoesCRM />;
      case 'realtime':
        return <RealtimeNotifications />;
      case 'summary':
        return <DashboardSummary />;
      default:
        return (
          <div className="h-40 flex items-center justify-center border border-dashed rounded-md">
            <span className="text-muted-foreground">Widget content {widget.tipo}</span>
          </div>
        );
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {widgetsAtivos.map((widget) => {
        const colSpan = 
          widget.tamanho === "pequeno" ? "md:col-span-1" :
          widget.tamanho === "medio" ? "md:col-span-2" :
          "md:col-span-4";
          
        return (
          <div key={widget.id} className={`${colSpan}`}>
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle>{translateWidgetTitle(widget.titulo)}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {renderWidgetContent(widget)}
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
};
