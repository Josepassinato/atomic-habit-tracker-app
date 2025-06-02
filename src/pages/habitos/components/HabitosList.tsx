
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HabitoItem from "@/components/habitos/HabitoItem";
import { Habito } from "@/components/habitos/types";
import { HabitoEvidenciaType } from "@/components/habitos/HabitoEvidencia";
import FeedbackIA from "@/components/habitos/FeedbackIA";
import GamificacaoCard from "@/components/habitos/GamificacaoCard";
import { useLanguage } from "@/i18n";

interface HabitsListProps {
  habitos: Habito[];
  conquistasRecentes: any[];
  pontos: number;
  nivel: number;
  onEvidenciaSubmitted: (habitoId: number, evidencia: HabitoEvidenciaType) => void;
  onMarcarConcluido: (id: number) => void;
}

const HabitosList: React.FC<HabitsListProps> = ({
  habitos,
  conquistasRecentes,
  pontos,
  nivel,
  onEvidenciaSubmitted,
  onMarcarConcluido
}) => {
  const { t } = useLanguage();

  // Example feedback for demonstration
  const feedback = t('aiHabitsFeedback');

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('myHabits')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {habitos.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {t('noHabitsYet')}
              </p>
            ) : (
              <div className="space-y-4">
                {habitos.map((habito) => (
                  <HabitoItem 
                    key={habito.id}
                    habito={habito}
                    onEvidenciaSubmitted={onEvidenciaSubmitted}
                    onMarcarConcluido={onMarcarConcluido}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <FeedbackIA feedback={feedback} />
      </div>
      
      <div>
        <GamificacaoCard 
          pontos={pontos}
          nivel={nivel}
          proximoNivel={250}
          conquistasRecentes={conquistasRecentes}
        />
        <StatsCard />
      </div>
    </div>
  );
};

// Statistics component extracted
const StatsCard = () => {
  const { t } = useLanguage();
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>{t('performance')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>{t('weeklyProgress')}</span>
              <span>67%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full" 
                style={{ width: "67%" }}
              />
            </div>
          </div>
          
          <div className="pt-4">
            <h4 className="font-medium text-sm mb-2">{t('statistics')}</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-100 p-3 rounded-md">
                <div className="text-2xl font-bold">15</div>
                <div className="text-xs text-muted-foreground">{t('completed')}</div>
              </div>
              <div className="bg-slate-100 p-3 rounded-md">
                <div className="text-2xl font-bold">21</div>
                <div className="text-xs text-muted-foreground">{t('total')}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitosList;
