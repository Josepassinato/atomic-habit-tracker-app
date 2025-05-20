
export type Integracao = {
  id: number;
  nome: string;
  conectado: boolean;
  integracoes: string[];
  apiUrl?: string;
  apiKey?: string;
  empresa_id?: string;
};

export const integracoesIniciais: Integracao[] = [
  {
    id: 1,
    nome: "HubSpot",
    conectado: false,
    integracoes: ["Contatos", "Negócios", "Atividades"],
  },
  {
    id: 2,
    nome: "Pipedrive",
    conectado: false,
    integracoes: ["Contatos", "Negócios", "Atividades"],
  },
  {
    id: 3,
    nome: "WhatsApp",
    conectado: false,
    integracoes: ["Mensagens", "Notificações"],
  },
  {
    id: 4,
    nome: "Slack",
    conectado: false,
    integracoes: ["Mensagens", "Notificações"],
  },
  {
    id: 5,
    nome: "Zapier",
    conectado: false,
    integracoes: ["Automações Personalizadas"],
  },
];
