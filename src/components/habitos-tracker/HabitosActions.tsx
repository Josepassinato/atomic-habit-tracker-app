
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { HabitosActionsProps } from "./types";
import { useLanguage } from "@/i18n";

const HabitosActions: React.FC<HabitosActionsProps> = ({ 
  onReiniciar, 
  onSolicitarFeedback, 
  carregandoFeedback 
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex justify-between">
      <Button 
        variant="outline" 
        size="sm"
        onClick={onReiniciar}
        className="hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
      >
        {t('restartHabits')}
      </Button>
      <Button 
        size="sm" 
        onClick={onSolicitarFeedback} 
        disabled={carregandoFeedback}
        className="relative overflow-hidden"
      >
        {carregandoFeedback ? (
          <span className="flex items-center">
            <Loader className="h-4 w-4 mr-2 animate-spin" />
            {t('analyzing')}
          </span>
        ) : (
          t('requestAiFeedback')
        )}
      </Button>
    </div>
  );
};

export default HabitosActions;
