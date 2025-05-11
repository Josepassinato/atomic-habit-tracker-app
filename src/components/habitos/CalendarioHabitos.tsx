
import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";
import { format, isSameDay } from "date-fns";
import { Habito } from "./types";
import { Badge } from "@/components/ui/badge";
import { Check, Calendar as CalendarIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CalendarioHabitosProps {
  habitos: Habito[];
  habitosPorDia: Record<string, { total: number; completos: number }>;
  onSelectDay: (date: Date) => void;
}

const CalendarioHabitos: React.FC<CalendarioHabitosProps> = ({
  habitos,
  habitosPorDia,
  onSelectDay,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Usamos useMemo para evitar recálculos desnecessários
  const habitosParaExibir = useMemo(() => {
    return habitos.filter(habito => 
      !habito.dataCriacao || isSameDay(new Date(habito.dataCriacao), selectedDate));
  }, [habitos, selectedDate]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      onSelectDay(date);
    }
  };

  // Destacar datas com memoization
  const highlightedDates = useMemo(() => 
    Object.entries(habitosPorDia).map(([dateStr]) => new Date(dateStr)),
  [habitosPorDia]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <CalendarIcon className="h-5 w-5" />
          Calendário de Hábitos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          locale={ptBR}
          className="p-3 pointer-events-auto"
          modifiers={{
            highlighted: highlightedDates,
          }}
          modifiersStyles={{
            highlighted: { fontWeight: "bold" }
          }}
          components={{
            DayContent: ({ date, ...props }) => {
              const dateKey = format(date, "yyyy-MM-dd");
              const dayData = habitosPorDia[dateKey];

              if (!dayData) return <div {...props}>{date.getDate()}</div>;

              const percentComplete = Math.round((dayData.completos / dayData.total) * 100);
              const bgColor = 
                percentComplete === 100 ? "bg-green-500" : 
                percentComplete >= 70 ? "bg-amber-500" : 
                percentComplete > 0 ? "bg-blue-500" : "bg-slate-300";

              return (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative" {...props}>
                        <span>{date.getDate()}</span>
                        <span 
                          className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-4 rounded-sm ${bgColor}`}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {dayData.completos} de {dayData.total} hábitos concluídos
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            }
          }}
        />

        {selectedDate && (
          <div className="mt-4 border-t pt-4">
            <h3 className="text-sm font-medium mb-2">
              {format(selectedDate, "dd 'de' MMMM, yyyy", { locale: ptBR })}
            </h3>
            
            <div className="space-y-1">
              {habitosParaExibir.length > 0 ? (
                habitosParaExibir.map(habito => (
                  <div key={habito.id} className="flex items-center text-sm gap-2">
                    {habito.cumprido ? (
                      <Badge variant="outline" className="flex gap-1 bg-green-50 text-green-700 border-green-200">
                        <Check className="h-3 w-3" /> Concluído
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-slate-50">Pendente</Badge>
                    )}
                    <span>{habito.titulo}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-2">
                  Não há hábitos registrados para esta data.
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CalendarioHabitos;
