
import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, Language, TranslationKey } from './translations';
import { LanguageContextType, LanguageProviderProps } from './types';

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Always default to English as the official language
  const [language, setLanguage] = useState<Language>(() => {
    // First check localStorage for saved preference
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['en', 'es', 'pt'].includes(savedLanguage)) {
      return savedLanguage;
    }
    
    // If no saved preference, default to English
    return 'en';
  });
  
  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
    console.log('Language set to:', language);
  }, [language]);

  // Ensure English is set as default on first load if no preference exists
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (!savedLanguage) {
      localStorage.setItem('language', 'en');
      console.log('Default language set to English');
    }
  }, []);
  
  // Translation function
  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
