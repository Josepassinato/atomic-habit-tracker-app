
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import FeedbackIA from "../habitos/FeedbackIA";
import SugestaoHabitosDialog from "../habitos/SugestaoHabitosDialog";
import HabitosStats from "./HabitosStats";
import HabitosList from "./HabitosList";
import HabitosActions from "./HabitosActions";
import { useHabitosTracker } from "./useHabitosTracker";
import { HabitosTrackerProps } from "./types";

const HabitosTracker: React.FC<HabitosTrackerProps> = ({ className }) => {
  const {
    habitos,
    feedback,
    carregandoFeedback,
    animateProgress,
    dialogAberto,
    setDialogAberto,
    modeloNegocio,
    carregandoSugestoes,
    habitosSugeridos,
    habitosCumpridos,
    habitosVerificados,
    progresso,
    marcarComoConcluido,
    reiniciarHabitos,
    solicitarFeedbackIA,
    handleInputChange,
    sugerirHabitosPersonalizados,
    adicionarHabitosSugeridos,
    handleEvidenciaSubmitted
  } = useHabitosTracker();

  return (
    <Card className={`h-full ${className || ''}`}>
      <CardHeader>
        <CardTitle>Hábitos Atômicos Diários</CardTitle>
        <CardDescription>
          <HabitosStats 
            habitos={habitos}
            habitosCumpridos={habitosCumpridos}
            habitosVerificados={habitosVerificados}
            progresso={progresso}
            animateProgress={animateProgress}
          />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <HabitosList 
          habitos={habitos}
          onEvidenciaSubmitted={handleEvidenciaSubmitted}
          onMarcarConcluido={marcarComoConcluido}
          onOpenSuggestDialog={() => setDialogAberto(true)}
        />
        
        <FeedbackIA feedback={feedback} />
        
        <SugestaoHabitosDialog
          open={dialogAberto}
          onOpenChange={setDialogAberto}
          modeloNegocio={modeloNegocio}
          onInputChange={handleInputChange}
          habitosSugeridos={habitosSugeridos}
          onSugerirHabitos={sugerirHabitosPersonalizados}
          onAdicionarHabitos={adicionarHabitosSugeridos}
          carregandoSugestoes={carregandoSugestoes}
        />
      </CardContent>
      <CardFooter>
        <HabitosActions 
          onReiniciar={reiniciarHabitos}
          onSolicitarFeedback={solicitarFeedbackIA}
          carregandoFeedback={carregandoFeedback}
        />
      </CardFooter>
    </Card>
  );
};

export default HabitosTracker;
