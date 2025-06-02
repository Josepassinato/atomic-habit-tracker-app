
import { HabitoEvidenciaType } from "./HabitoEvidencia";

export interface Habito {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  schedule: string;
  evidence?: HabitoEvidenciaType;
  verificationRequired?: boolean;
  verified?: boolean;
  createdAt?: string;
  recurrence?: string;
  // Portuguese aliases for backward compatibility
  titulo?: string;
  descricao?: string;
  cumprido?: boolean;
  horario?: string;
  evidencia?: HabitoEvidenciaType;
  verificacaoNecessaria?: boolean;
  verificado?: boolean;
  dataCriacao?: string;
}

export interface BusinessModel {
  segment: string;
  salesCycle: string;
  teamSize: string;
  mainObjective: string;
}

export interface ModeloNegocio {
  segmento: string;
  cicloVenda: string;
  tamEquipe: string;
  objetivoPrincipal: string;
}
