
import React from "react";

export const DashboardLoading: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <span className="ml-3">Carregando dados das equipes...</span>
    </div>
  );
};
