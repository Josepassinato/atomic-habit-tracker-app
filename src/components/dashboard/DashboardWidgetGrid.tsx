
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Widget } from "./types/widget.types";

interface DashboardWidgetGridProps {
  widgetsAtivos: Widget[];
}

export const DashboardWidgetGrid: React.FC<DashboardWidgetGridProps> = ({ widgetsAtivos }) => {
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
                <CardTitle>{widget.titulo}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-40 flex items-center justify-center border border-dashed rounded-md">
                  <span className="text-muted-foreground">Conteúdo do widget {widget.tipo}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
};
