
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { HabitosActionsProps } from "./types";

const HabitosActions: React.FC<HabitosActionsProps> = ({ 
  onReiniciar, 
  onSolicitarFeedback, 
  carregandoFeedback 
}) => {
  return (
    <div className="flex justify-between">
      <Button 
        variant="outline" 
        size="sm"
        onClick={onReiniciar}
        className="hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
      >
        Reiniciar Hábitos
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
            Analisando...
          </span>
        ) : (
          "Solicitar Feedback da IA"
        )}
      </Button>
    </div>
  );
};

export default HabitosActions;
