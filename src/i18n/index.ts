import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language, TranslationKey } from './locales';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: { name?: string }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Detect browser language and map to supported languages
const detectBrowserLanguage = (): Language => {
  const browserLang = navigator.language.toLowerCase();
  
  if (browserLang.startsWith('pt')) return 'pt';
  if (browserLang.startsWith('es')) return 'es';
  return 'en'; // Default fallback
};

// Get initial language: saved preference > browser language > 'pt'
const getInitialLanguage = (): Language => {
  const saved = localStorage.getItem('language') as Language;
  if (saved && ['pt', 'en', 'es'].includes(saved)) return saved;
  
  return detectBrowserLanguage();
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback for components outside provider
    const language = getInitialLanguage();
    return {
      t: (key: string, options?: { name?: string }) => {
        const currentTranslations = translations[language];
        const fallbackTranslations = translations.en;
        
        let translation = (currentTranslations as any)[key] || (fallbackTranslations as any)[key] || key;
        
        if (options?.name) {
          translation = translation.replace('{{name}}', options.name);
          translation = translation.replace('{{role}}', options.name);
        }
        
        return translation;
      },
      language,
      setLanguage: () => {}
    };
  }
  return context;
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    // Auto-detect on first load if no preference saved
    const saved = localStorage.getItem('language');
    if (!saved) {
      const detected = detectBrowserLanguage();
      setLanguageState(detected);
      localStorage.setItem('language', detected);
      console.log(`Auto-detected language: ${detected} (from browser: ${navigator.language})`);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string, options?: { name?: string }) => {
    const currentTranslations = translations[language];
    const fallbackTranslations = translations.en;
    
    let translation = (currentTranslations as any)[key] || (fallbackTranslations as any)[key] || key;
    
    if (options?.name) {
      translation = translation.replace('{{name}}', options.name);
      translation = translation.replace('{{role}}', options.name);
    }
    
    return translation;
  };

  return React.createElement(LanguageContext.Provider, { value: { language, setLanguage, t } }, children);
};