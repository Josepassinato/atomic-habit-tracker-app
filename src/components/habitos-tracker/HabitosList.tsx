
import React from "react";
import { HabitoEvidenciaType } from "../habitos/HabitoEvidencia";
import HabitoItem from "../habitos/HabitoItem";
import { Habito } from "../habitos/types";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useLanguage } from "@/i18n";

interface HabitosListProps {
  habitos: Habito[];
  onEvidenciaSubmitted: (habitoId: number, evidencia: HabitoEvidenciaType) => void;
  onMarcarConcluido: (id: number) => void;
  onOpenSuggestDialog: () => void;
}

const HabitosList: React.FC<HabitosListProps> = ({
  habitos,
  onEvidenciaSubmitted,
  onMarcarConcluido,
  onOpenSuggestDialog
}) => {
  const { t } = useLanguage();
  
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
          <p>{t('noHabitsYet')}</p>
        </div>
      )}
      
      <Button 
        variant="outline" 
        size="sm" 
        className="mt-4 w-full flex items-center justify-center hover:bg-slate-50 hover:text-slate-900 transition-all"
        onClick={onOpenSuggestDialog}
      >
        <Plus className="h-4 w-4 mr-2" /> {t('suggestPersonalizedHabits')}
      </Button>
    </div>
  );
};

export default HabitosList;
