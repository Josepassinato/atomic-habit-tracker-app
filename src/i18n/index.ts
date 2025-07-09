import React from 'react';
import { translations, Language, TranslationKey } from './locales';

// Enhanced i18n system with separate language files
export const useLanguage = () => {
  // Default to English as primary language
  const currentLanguage: Language = 'en';
  
  return {
    t: (key: string, options?: { name?: string }) => {
      // Get translation from current language, fallback to English
      const currentTranslations = translations[currentLanguage];
      const fallbackTranslations = translations.en;
      
      let translation = (currentTranslations as any)[key] || (fallbackTranslations as any)[key] || key;
      
      // Handle dynamic replacements like {{name}} and {{role}}
      if (options?.name) {
        translation = translation.replace('{{name}}', options.name);
        translation = translation.replace('{{role}}', options.name);
      }
      
      return translation;
    },
    language: currentLanguage as 'en' | 'pt' | 'es'
  };
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  return React.createElement(React.Fragment, null, children);
};