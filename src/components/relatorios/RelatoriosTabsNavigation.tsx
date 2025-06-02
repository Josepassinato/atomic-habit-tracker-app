
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Download, Bell } from "lucide-react";
import { useLanguage } from "@/i18n";

export const RelatoriosTabsNavigation: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <TabsList className="mb-2">
      <TabsTrigger value="dashboard" className="flex items-center gap-2">
        <BarChart3 className="h-4 w-4" />
        {t('dashboard')}
      </TabsTrigger>
      <TabsTrigger value="relatorios-avancados" className="flex items-center gap-2">
        <Download className="h-4 w-4" />
        {t('reports')}
      </TabsTrigger>
      <TabsTrigger value="notificacoes" className="flex items-center gap-2">
        <Bell className="h-4 w-4" />
        Notifications
      </TabsTrigger>
      <TabsTrigger value="habitos">{t('habits')}</TabsTrigger>
    </TabsList>
  );
};
