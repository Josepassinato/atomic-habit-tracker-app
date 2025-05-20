
import React from "react";
import { Progress } from "@/components/ui/progress";
import { HabitosStatsProps } from "./types";

const HabitosStats: React.FC<HabitosStatsProps> = ({
  habitos,
  habitosCumpridos,
  habitosVerificados,
  progresso,
  animateProgress
}) => {
  return (
    <>
      <div>
        Progresso de hoje: {habitosCumpridos} de {habitos.length} hábitos
        {habitosVerificados > 0 && (
          <span className="text-green-600 ml-1">
            ({habitosVerificados} verificado{habitosVerificados > 1 ? 's' : ''})
          </span>
        )}
      </div>
      <Progress 
        value={progresso} 
        className={`h-2 transition-all duration-700 ${animateProgress ? 'scale-y-150' : ''}`} 
      />
    </>
  );
};

export default HabitosStats;
