const t = (key: string) => key;
export const useTranslation = () => ({ t, i18n: { language: 'en' } });
export const getI18n = () => ({ t });
