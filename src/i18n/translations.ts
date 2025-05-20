export type Language = 'en' | 'es' | 'pt';

export interface Translations {
  // Common
  dashboard: string;
  habits: string;
  goals: string;
  reports: string;
  settings: string;
  onboarding: string;
  logout: string;
  
  // Admin
  adminDashboard: string;
  adminUsers: string;
  adminPlans: string;
  adminSettings: string;
  adminAnalytics: string;
}

export type TranslationKey = keyof Translations;

export const translations: { [key in Language]: Translations } = {
  en: {
    // Common
    dashboard: 'Dashboard',
    habits: 'Habits',
    goals: 'Goals',
    reports: 'Reports',
    settings: 'Settings',
    onboarding: 'Onboarding',
    logout: 'Logout',

    // Admin
    adminDashboard: 'Admin Dashboard',
    adminUsers: 'Users',
    adminPlans: 'Plans',
    adminSettings: 'Settings',
    adminAnalytics: 'Analytics',
  },
  es: {
    // Common
    dashboard: 'Panel',
    habits: 'Hábitos',
    goals: 'Metas',
    reports: 'Informes',
    settings: 'Ajustes',
    onboarding: 'Incorporación',
    logout: 'Cerrar sesión',

    // Admin
    adminDashboard: 'Panel de Administrador',
    adminUsers: 'Usuarios',
    adminPlans: 'Planes',
    adminSettings: 'Ajustes',
    adminAnalytics: 'Analítica',
  },
  pt: {
    // Common
    dashboard: 'Painel',
    habits: 'Hábitos',
    goals: 'Metas',
    reports: 'Relatórios',
    settings: 'Configurações',
    onboarding: 'Integração',
    logout: 'Sair',

    // Admin
    adminDashboard: 'Painel de Administração',
    adminUsers: 'Usuários',
    adminPlans: 'Planos',
    adminSettings: 'Configurações',
    adminAnalytics: 'Análise',
  },
};
