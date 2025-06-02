
import { useLanguage } from './index';

export const useTranslation = () => {
  const { t, language } = useLanguage();
  return { t, language };
};
