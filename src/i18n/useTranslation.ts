
import { useLanguage } from './LanguageContext';
import { TranslationKey } from './translations';

export const useTranslation = () => {
  const { t } = useLanguage();
  
  return { t };
};
