
import React from "react";
import { Progress } from "@/components/ui/progress";
import { HabitosStatsProps } from "./types";
import { useLanguage } from "@/i18n";

const HabitosStats: React.FC<HabitosStatsProps> = ({
  habitos,
  habitosCumpridos,
  habitosVerificados,
  progresso,
  animateProgress
}) => {
  const { t } = useLanguage();
  
  return (
    <>
      <div>
        {t('todayProgress')}: {habitosCumpridos} {t('habitsOf')} {habitos.length} {t('habits').toLowerCase()}
        {habitosVerificados > 0 && (
          <span className="text-green-600 ml-1">
            ({habitosVerificados} {t('verified')}{habitosVerificados > 1 ? 's' : ''})
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
