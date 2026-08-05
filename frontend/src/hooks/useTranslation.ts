import { useAppStore } from '../store/useAppStore';
import { TRANSLATIONS } from '@zero-delala/shared';

export const useTranslation = () => {
  const { language } = useAppStore();
  const t = TRANSLATIONS[language] || TRANSLATIONS.am;

  return {
    t,
    language,
    isAmharic: language === 'am'
  };
};
