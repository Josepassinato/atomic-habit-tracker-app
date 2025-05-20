
import { HabitoEvidenciaType } from "../habitos/HabitoEvidencia";
import { Habito, ModeloNegocio } from "../habitos/types";

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
