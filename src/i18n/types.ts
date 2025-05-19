
import { ReactNode } from 'react';
import { Language, TranslationKey } from './translations';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

export interface LanguageProviderProps {
  children: ReactNode;
}
