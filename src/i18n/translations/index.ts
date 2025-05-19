
import { enTranslations } from './en';
import { esTranslations } from './es';
import { ptTranslations } from './pt';

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
