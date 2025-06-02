
export interface NotificacaoEmpresa {
  id: string;
  tipo: "meta" | "deadline" | "performance" | "equipe";
  titulo: string;
  mensagem: string;
  prioridade: "baixa" | "media" | "alta";
  timestamp: Date;
  lida: boolean;
  dadosExtras?: any;
}
