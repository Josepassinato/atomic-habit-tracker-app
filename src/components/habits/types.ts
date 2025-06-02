
import { HabitEvidenceType } from "./HabitEvidence";

export interface Habit {
  id: number;
  titulo: string;
  descricao: string;
  cumprido: boolean;
  horario: string;
  evidencia?: HabitEvidenceType;
  verificacaoNecessaria?: boolean;
  verificado?: boolean;
  dataCriacao?: string;
}

export interface BusinessModel {
  segmento: string;
  cicloVenda: string;
  tamEquipe: string;
  objetivoPrincipal: string;
}
