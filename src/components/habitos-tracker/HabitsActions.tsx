
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { HabitosActionsProps } from "./types";

const HabitsActions: React.FC<HabitosActionsProps> = ({ 
  onReiniciar: onRestart, 
  onSolicitarFeedback: onRequestFeedback, 
  carregandoFeedback: loadingFeedback 
}) => {
  return (
    <div className="flex justify-between">
      <Button 
        variant="outline" 
        size="sm"
        onClick={onRestart}
        className="hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
      >
        Restart Habits
      </Button>
      <Button 
        size="sm" 
        onClick={onRequestFeedback} 
        disabled={loadingFeedback}
        className="relative overflow-hidden"
      >
        {loadingFeedback ? (
          <span className="flex items-center">
            <Loader className="h-4 w-4 mr-2 animate-spin" />
            Analyzing...
          </span>
        ) : (
          "Request AI Feedback"
        )}
      </Button>
    </div>
  );
};

export default HabitsActions;
