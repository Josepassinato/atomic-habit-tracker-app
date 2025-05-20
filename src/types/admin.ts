
export type PlanType = 'Starter' | 'Professional' | 'Enterprise' | 'Free';
export type StatusType = 'ativo' | 'inativo' | 'trial';

export interface Company {
  id: string;
  nome: string;
  segmento: string;
  plano: PlanType;
  data_cadastro: string;
  status: StatusType;
  email_contato: string;
}

export interface TokenUsage {
  company_id: string;
  tokens_consumidos: number;
  tokens_limite: number;
  ultimo_uso: string;
}

export interface AdminMetrics {
  totalEmpresas: number;
  empresasAtivas: number;
  empresasInativas: number;
  empresasTrial: number;
  tokensTotais: number;
  receitaMensal: number;
}

export interface AdminSettings {
  openAIApiKey?: string;
  systemEmailAddress?: string;
  allowTrialAccounts: boolean;
  trialDurationDays: number;
  defaultTokenLimit: number;
}
