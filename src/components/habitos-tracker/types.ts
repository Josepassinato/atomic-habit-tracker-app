
import { HabitoEvidenciaType } from "../habitos/HabitoEvidencia";
import { HabitEvidenceType } from "../habits/HabitEvidence";
import { Habito, ModeloNegocio } from "../habitos/types";
import { Habit, BusinessModel } from "../habits/types";

export interface HabitosTrackerProps {
  className?: string;
}

export interface HabitosStatsProps {
  habitos: Habito[];
  habitosCumpridos: number;
  habitosVerificados: number;
  progresso: number;
  animateProgress: boolean;
}

export interface HabitosActionsProps {
  onReiniciar: () => void;
  onSolicitarFeedback: () => void;
  carregandoFeedback: boolean;
}

export interface HabitosSugestaoProps {
  dialogAberto: boolean;
  setDialogAberto: (open: boolean) => void;
  modeloNegocio: ModeloNegocio;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  habitosSugeridos: Habito[];
  onSugerirHabitos: () => void;
  onAdicionarHabitos: () => void;
  carregandoSugestoes: boolean;
}

// English versions
export interface HabitsTrackerProps {
  className?: string;
}

export interface HabitsStatsProps {
  habits: Habit[];
  completedHabits: number;
  verifiedHabits: number;
  progress: number;
  animateProgress: boolean;
}

export interface HabitsActionsProps {
  onRestart: () => void;
  onRequestFeedback: () => void;
  loadingFeedback: boolean;
}
