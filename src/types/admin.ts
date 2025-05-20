
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
  supabaseApiKey?: string;
  supabaseUrl?: string;
  systemEmailAddress?: string;
  allowTrialAccounts: boolean;
  trialDurationDays: number;
  defaultTokenLimit: number;
}

// Novas interfaces para os limites dos planos
export interface PlanLimits {
  tokensLimit: number;
  usersLimit: number;
  features: PlanFeatures;
  price: number;
}

export interface PlanFeatures {
  aiConsulting: boolean;
  crmIntegrations: number;
  advancedReports: boolean;
  prioritySupport: boolean;
  customApi: boolean;
}

export interface PlansConfiguration {
  starter: PlanLimits;
  professional: PlanLimits;
  enterprise: PlanLimits;
  trial: PlanLimits;
}
