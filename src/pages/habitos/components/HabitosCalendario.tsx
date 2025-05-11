
import React from "react";
import { Card } from "@/components/ui/card";
import CalendarioHabitos from "@/components/habitos/CalendarioHabitos";
import GamificacaoCard from "@/components/habitos/GamificacaoCard";
import { Habito } from "@/components/habitos/types";

interface HabitosCalendarioProps {
  habitos: Habito[];
  habitosPorDia: Record<string, { total: number; completos: number }>;
  onSelectDay: (date: Date) => void;
  conquistasRecentes: any[];
  pontos: number;
  nivel: number;
}

const HabitosCalendario: React.FC<HabitosCalendarioProps> = ({
  habitos,
  habitosPorDia,
  onSelectDay,
  conquistasRecentes,
  pontos,
  nivel
}) => {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2">
        <CalendarioHabitos 
          habitos={habitos}
          habitosPorDia={habitosPorDia}
          onSelectDay={onSelectDay}
        />
      </div>
      <div>
        <GamificacaoCard 
          pontos={pontos}
          nivel={nivel}
          proximoNivel={250}
          conquistasRecentes={conquistasRecentes}
        />
      </div>
    </div>
  );
};

export default HabitosCalendario;
