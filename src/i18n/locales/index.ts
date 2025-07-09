import { en } from './en';
import { pt } from './pt';
import { es } from './es';

export const translations = {
  en,
  pt,
  es
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof en;