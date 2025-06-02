
export interface Team {
  id: string;
  name: string;
  metas: {
    mensal: string;
    diaria: string;
  };
  habitos: string[];
  recompensas: {
    descricao: string;
    tipo: string;
  }[];
  comissoes: {
    base: string;
    habitos: string;
  };
}

export interface TeamFormInput {
  name: string;
}
