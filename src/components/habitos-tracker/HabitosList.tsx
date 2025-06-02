
import React from "react";
import { HabitoEvidenciaType } from "../habitos/HabitoEvidencia";
import HabitoItem from "../habitos/HabitoItem";
import { Habito } from "../habitos/types";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

interface HabitosListProps {
  habitos: Habito[];
  onEvidenciaSubmitted: (habitoId: number, evidencia: HabitoEvidenciaType) => void;
  onMarcarConcluido: (id: number) => void;
  onAbrirDialogoSugestao: () => void;
}

const HabitosList: React.FC<HabitosListProps> = ({
  habitos,
  onEvidenciaSubmitted,
  onMarcarConcluido,
  onAbrirDialogoSugestao
}) => {
  return (
    <div className="space-y-4">
      {habitos.map((habito) => (
        <HabitoItem
          key={habito.id}
          habito={habito}
          onEvidenciaSubmitted={onEvidenciaSubmitted}
          onMarcarConcluido={onMarcarConcluido}
        />
      ))}
      
      {habitos.length === 0 && (
        <div className="py-6 text-center text-muted-foreground">
          <p>No habits created yet. Start building your success!</p>
        </div>
      )}
      
      <Button 
        variant="outline" 
        size="sm" 
        className="mt-4 w-full flex items-center justify-center hover:bg-slate-50 hover:text-slate-900 transition-all"
        onClick={onAbrirDialogoSugestao}
      >
        <Plus className="h-4 w-4 mr-2" /> Suggest Personalized Habits
      </Button>
    </div>
  );
};

export default HabitosList;
