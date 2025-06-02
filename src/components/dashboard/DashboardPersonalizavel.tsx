
import React, { useState } from "react";
import { DashboardCustomizeDialog } from "./DashboardCustomizeDialog";
import { DashboardWidgetGrid } from "./DashboardWidgetGrid";
import { DashboardLoading } from "./DashboardLoading";
import { useDashboardWidgets } from "./hooks/useDashboardWidgets";

interface CustomizableDashboardProps {
  children?: React.ReactNode;
}

const CustomizableDashboard: React.FC<CustomizableDashboardProps> = ({ children }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    widgets,
    widgetsAtivos: activeWidgets,
    loading,
    toggleWidget,
    reordenarWidgets: reorderWidgets,
    moveWidgetUp,
    moveWidgetDown
  } = useDashboardWidgets();
  
  if (loading) {
    return <DashboardLoading />;
  }
  
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <DashboardCustomizeDialog 
          widgets={widgets}
          toggleWidget={toggleWidget}
          moveWidgetUp={moveWidgetUp}
          moveWidgetDown={moveWidgetDown}
          reordenarWidgets={reorderWidgets}
          open={dialogOpen}
          setOpen={setDialogOpen}
        />
      </div>

      <DashboardWidgetGrid widgetsAtivos={activeWidgets} />
      
      {children}
    </>
  );
};

export default CustomizableDashboard;
