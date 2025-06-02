
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Check, Loader } from "lucide-react";
import { Habit } from "./types";
import HabitEvidence, { HabitEvidenceType } from "./HabitEvidence";

interface HabitItemProps {
  habit: Habit;
  onEvidenceSubmitted: (habitId: number, evidence: HabitEvidenceType) => void;
  onMarkCompleted: (id: number) => void;
}

const HabitItem: React.FC<HabitItemProps> = ({
  habit,
  onEvidenceSubmitted,
  onMarkCompleted,
}) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleMarkCompleted = async () => {
    setIsCompleting(true);
    // Simulate a small delay to show visual feedback
    await new Promise(resolve => setTimeout(resolve, 600));
    onMarkCompleted(habit.id);
    setIsCompleting(false);
  };

  return (
    <div className={`flex items-start gap-3 border-b pb-3 last:border-0 transition-all duration-300 
      ${isCompleting ? 'bg-green-50/50' : ''}`}>
      <div className="mt-0.5">
        {habit.cumprido ? (
          <div className={`flex h-6 w-6 items-center justify-center rounded-full 
            ${habit.verificado 
              ? "bg-green-100 text-green-700 animate-[pulse_1s_ease-in-out]" 
              : "bg-blue-100 text-blue-700"}`}>
            <Check className="h-4 w-4" />
          </div>
        ) : isCompleting ? (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-700 animate-spin">
            <Loader className="h-4 w-4" />
          </div>
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded-full border hover:bg-slate-50 cursor-pointer"
               onClick={handleMarkCompleted}>
            <span className="sr-only">Not completed</span>
          </div>
        )}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">{habit.titulo}</h4>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-3 w-3" />
            {habit.horario}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{habit.descricao}</p>
        
        {habit.verificacaoNecessaria && (
          <div className="flex items-center mt-1">
            {habit.evidencia ? (
              <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-200">
                Evidence submitted
              </span>
            ) : (
              <HabitEvidence 
                habitId={habit.id}
                title={habit.titulo}
                onEvidenceSubmitted={onEvidenceSubmitted}
              />
            )}
          </div>
        )}
        
        {!habit.cumprido && (
          <Button 
            size="sm" 
            className="mt-1 relative overflow-hidden" 
            onClick={handleMarkCompleted}
            disabled={isCompleting}
          >
            {isCompleting ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Completing...
              </>
            ) : (
              <>Mark as completed</>
            )}
          </Button>
        )}
        
        {habit.cumprido && habit.evidencia && !habit.verificado && (
          <p className="text-xs text-amber-600 mt-1 flex items-center">
            <Loader className="h-3 w-3 mr-1 animate-spin" />
            Awaiting manager verification
          </p>
        )}
        
        {habit.verificado && (
          <p className="text-xs text-green-600 mt-1 flex items-center animate-fade-in">
            <Check className="h-3 w-3 mr-1" />
            Verified by manager
          </p>
        )}
      </div>
    </div>
  );
};

export default HabitItem;
