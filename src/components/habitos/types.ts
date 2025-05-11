
import { HabitoEvidenciaType } from "./HabitoEvidencia";

export interface Habito {
  id: number;
  titulo: string;
  descricao: string;
  cumprido: boolean;
  horario: string;
  evidencia?: HabitoEvidenciaType;
  verificacaoNecessaria?: boolean;
  verificado?: boolean;
}

export interface ModeloNegocio {
  segmento: string;
  cicloVenda: string;
  tamEquipe: string;
  objetivoPrincipal: string;
}
