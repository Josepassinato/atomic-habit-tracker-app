
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Check, Loader } from "lucide-react";
import { Habito } from "./types";
import HabitoEvidencia, { HabitoEvidenciaType } from "./HabitoEvidencia";

interface HabitoItemProps {
  habito: Habito;
  onEvidenciaSubmitted: (habitoId: number, evidencia: HabitoEvidenciaType) => void;
  onMarcarConcluido: (id: number) => void;
}

const HabitoItem: React.FC<HabitoItemProps> = ({
  habito,
  onEvidenciaSubmitted,
  onMarcarConcluido,
}) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleMarcarConcluido = async () => {
    setIsCompleting(true);
    // Simulate a small delay to show visual feedback
    await new Promise(resolve => setTimeout(resolve, 600));
    onMarcarConcluido(habito.id);
    setIsCompleting(false);
  };

  return (
    <div className={`flex items-start gap-3 border-b pb-3 last:border-0 transition-all duration-300 
      ${isCompleting ? 'bg-green-50/50' : ''}`}>
      <div className="mt-0.5">
        {habito.completed ? (
          <div className={`flex h-6 w-6 items-center justify-center rounded-full 
            ${habito.verified 
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
               onClick={handleMarcarConcluido}>
            <span className="sr-only">Not completed</span>
          </div>
        )}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">{habito.title}</h4>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-3 w-3" />
            {habito.schedule}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{habito.description}</p>
        
        {habito.verificationRequired && (
          <div className="flex items-center mt-1">
            {habito.evidence ? (
              <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-200">
                Evidence submitted
              </span>
            ) : (
              <HabitoEvidencia 
                habitoId={habito.id}
                titulo={habito.title}
                onEvidenciaSubmitted={onEvidenciaSubmitted}
              />
            )}
          </div>
        )}
        
        {!habito.completed && (
          <Button 
            size="sm" 
            className="mt-1 relative overflow-hidden" 
            onClick={handleMarcarConcluido}
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
        
        {habito.completed && habito.evidence && !habito.verified && (
          <p className="text-xs text-amber-600 mt-1 flex items-center">
            <Loader className="h-3 w-3 mr-1 animate-spin" />
            Awaiting manager verification
          </p>
        )}
        
        {habito.verified && (
          <p className="text-xs text-green-600 mt-1 flex items-center animate-fade-in">
            <Check className="h-3 w-3 mr-1" />
            Verified by manager
          </p>
        )}
      </div>
    </div>
  );
};

export default HabitoItem;
