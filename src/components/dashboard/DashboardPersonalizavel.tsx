
import React, { useState } from "react";
import { DashboardCustomizeDialog } from "./DashboardCustomizeDialog";
import { DashboardWidgetGrid } from "./DashboardWidgetGrid";
import { DashboardLoading } from "./DashboardLoading";
import { useDashboardWidgets } from "./hooks/useDashboardWidgets";
import { useLanguage } from "@/i18n";

interface DashboardPersonalizavelProps {
  children?: React.ReactNode;
}

const DashboardPersonalizavel: React.FC<DashboardPersonalizavelProps> = ({ children }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { t } = useLanguage();
  const {
    widgets,
    widgetsAtivos,
    loading,
    toggleWidget,
    reordenarWidgets,
    moveWidgetUp,
    moveWidgetDown
  } = useDashboardWidgets();
  
  if (loading) {
    return <DashboardLoading />;
  }
  
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{t('dashboard')}</h1>
        <DashboardCustomizeDialog 
          widgets={widgets}
          toggleWidget={toggleWidget}
          moveWidgetUp={moveWidgetUp}
          moveWidgetDown={moveWidgetDown}
          reordenarWidgets={reordenarWidgets}
          open={dialogOpen}
          setOpen={setDialogOpen}
        />
      </div>

      <DashboardWidgetGrid widgetsAtivos={widgetsAtivos} />
      
      {children}
    </>
  );
};

export default DashboardPersonalizavel;
