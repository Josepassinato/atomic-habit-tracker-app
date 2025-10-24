
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import FeedbackIA from "../habitos/FeedbackIA";
import SugestaoHabitosDialog from "../habitos/SugestaoHabitosDialog";
import HabitsStats from "./HabitsStats";
import HabitosList from "./HabitosList";
import HabitsActions from "./HabitsActions";
import { useHabitosTracker } from "./useHabitosTracker";
import { HabitosTrackerProps } from "./types";
import { useLanguage } from "@/i18n";

const HabitsTracker: React.FC<HabitosTrackerProps> = ({ className }) => {
  const { t } = useLanguage();
  const {
    habitos: habits,
    feedback,
    carregandoFeedback: loadingFeedback,
    animateProgress,
    dialogAberto: dialogOpen,
    setDialogAberto: setDialogOpen,
    modeloNegocio: businessModel,
    carregandoSugestoes: loadingSuggestions,
    habitosSugeridos: suggestedHabits,
    habitosCumpridos: completedHabits,
    habitosVerificados: verifiedHabits,
    progresso: progress,
    marcarComoConcluido: markAsCompleted,
    reiniciarHabitos: restartHabits,
    solicitarFeedbackIA: requestAIFeedback,
    handleInputChange,
    sugerirHabitosPersonalizados: suggestPersonalizedHabits,
    adicionarHabitosSugeridos: addSuggestedHabits,
    handleEvidenciaSubmitted: handleEvidenceSubmitted
  } = useHabitosTracker();

  return (
    <Card className={`h-full ${className || ''}`}>
      <CardHeader>
        <CardTitle>{t('dailyAtomicHabitsCard')}</CardTitle>
        <CardDescription>
          <HabitsStats 
            habits={habits}
            completedHabits={completedHabits}
            verifiedHabits={verifiedHabits}
            progress={progress}
            animateProgress={animateProgress}
          />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <HabitosList 
          habitos={habits}
          onEvidenciaSubmitted={handleEvidenceSubmitted}
          onMarcarConcluido={markAsCompleted}
          onAbrirDialogoSugestao={() => setDialogOpen(true)}
        />
        
        <FeedbackIA feedback={feedback} />
        
        <SugestaoHabitosDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          modeloNegocio={businessModel}
          onInputChange={handleInputChange}
          habitosSugeridos={suggestedHabits}
          onSugerirHabitos={suggestPersonalizedHabits}
          onAdicionarHabitos={addSuggestedHabits}
          carregandoSugestoes={loadingSuggestions}
        />
      </CardContent>
      <CardFooter>
        <HabitsActions 
          onReiniciar={restartHabits}
          onSolicitarFeedback={requestAIFeedback}
          carregandoFeedback={loadingFeedback}
        />
      </CardFooter>
    </Card>
  );
};

export default HabitsTracker;
