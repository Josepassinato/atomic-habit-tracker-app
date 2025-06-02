
import { commonTranslations } from './common';
import { authTranslations } from './auth';
import { dashboardTranslations } from './dashboard';
import { passwordRecoveryTranslations } from './passwordRecovery';
import { landingPageTranslations } from './landingPage';
import { adminTranslations } from './admin';
import { teamsTranslations } from './teams';
import { notFoundTranslations } from './notFound';

// Combine all translation modules
const combineTranslations = (language: 'en' | 'es' | 'pt') => ({
  ...commonTranslations[language],
  ...authTranslations[language],
  ...dashboardTranslations[language],
  ...passwordRecoveryTranslations[language],
  ...landingPageTranslations[language],
  ...adminTranslations[language],
  ...teamsTranslations[language],
  ...notFoundTranslations[language],
});

// Create the complete translations object
export const enTranslations = combineTranslations('en');
export const esTranslations = combineTranslations('es');
export const ptTranslations = combineTranslations('pt');

// Create a type based on the English translations
export type TranslationKey = keyof typeof enTranslations;

// Export all translations
export const translations = {
  en: enTranslations,
  es: esTranslations,
  pt: ptTranslations,
};

// Define available languages
export type Language = keyof typeof translations;
