
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
}

export interface BusinessModel {
  segment: string;
  salesCycle: string;
  teamSize: string;
  mainObjective: string;
}
