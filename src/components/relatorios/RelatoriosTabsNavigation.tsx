
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Download, Bell } from "lucide-react";

export const RelatoriosTabsNavigation: React.FC = () => {
  return (
    <TabsList className="mb-2">
      <TabsTrigger value="dashboard" className="flex items-center gap-2">
        <BarChart3 className="h-4 w-4" />
        Dashboard
      </TabsTrigger>
      <TabsTrigger value="relatorios-avancados" className="flex items-center gap-2">
        <Download className="h-4 w-4" />
        Relatórios Avançados
      </TabsTrigger>
      <TabsTrigger value="notificacoes" className="flex items-center gap-2">
        <Bell className="h-4 w-4" />
        Notificações
      </TabsTrigger>
      <TabsTrigger value="habitos">Verificação de Hábitos</TabsTrigger>
    </TabsList>
  );
};
