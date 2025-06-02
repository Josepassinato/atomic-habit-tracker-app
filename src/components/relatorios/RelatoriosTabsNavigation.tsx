
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Download, Bell } from "lucide-react";
import { useLanguage } from "@/i18n";

export const RelatoriosTabsNavigation: React.FC = () => {
  const { language } = useLanguage();
  
  // Tab labels based on language
  const getTabLabels = () => {
    switch(language) {
      case 'pt':
        return {
          dashboard: 'Dashboard',
          reports: 'Relatórios Avançados',
          notifications: 'Notificações',
          habits: 'Verificação de Hábitos'
        };
      case 'es':
        return {
          dashboard: 'Panel',
          reports: 'Informes Avanzados',
          notifications: 'Notificaciones',
          habits: 'Verificación de Hábitos'
        };
      case 'en':
      default:
        return {
          dashboard: 'Dashboard',
          reports: 'Advanced Reports',
          notifications: 'Notifications',
          habits: 'Habits Verification'
        };
    }
  };
  
  const labels = getTabLabels();
  
  return (
    <TabsList className="mb-2">
      <TabsTrigger value="dashboard" className="flex items-center gap-2">
        <BarChart3 className="h-4 w-4" />
        {labels.dashboard}
      </TabsTrigger>
      <TabsTrigger value="relatorios-avancados" className="flex items-center gap-2">
        <Download className="h-4 w-4" />
        {labels.reports}
      </TabsTrigger>
      <TabsTrigger value="notificacoes" className="flex items-center gap-2">
        <Bell className="h-4 w-4" />
        {labels.notifications}
      </TabsTrigger>
      <TabsTrigger value="habitos">{labels.habits}</TabsTrigger>
    </TabsList>
  );
};
