
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Download, Bell } from "lucide-react";

export const ReportsTabsNavigation: React.FC = () => {
  return (
    <TabsList className="mb-2">
      <TabsTrigger value="dashboard" className="flex items-center gap-2">
        <BarChart3 className="h-4 w-4" />
        Dashboard
      </TabsTrigger>
      <TabsTrigger value="relatorios-avancados" className="flex items-center gap-2">
        <Download className="h-4 w-4" />
        Reports
      </TabsTrigger>
      <TabsTrigger value="notificacoes" className="flex items-center gap-2">
        <Bell className="h-4 w-4" />
        Notifications
      </TabsTrigger>
      <TabsTrigger value="habitos">Habits</TabsTrigger>
    </TabsList>
  );
};
