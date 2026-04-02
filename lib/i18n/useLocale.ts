import { useEffect, useMemo } from 'react';

import { useLocaleStore } from '@/store/useLocaleStore';

import { translate } from './index';

type TranslationParams = Record<string, string | number>;

export function useLocale() {
  const language = useLocaleStore((state) => state.language);
  const hydrated = useLocaleStore((state) => state.hydrated);
  const hydrateLanguage = useLocaleStore((state) => state.hydrateLanguage);
  const setLanguage = useLocaleStore((state) => state.setLanguage);

  useEffect(() => {
    void hydrateLanguage();
  }, [hydrateLanguage]);

  const t = useMemo(
    () => (key: string, params?: TranslationParams) => translate(language, key, params),
    [language]
  );

  return {
    language,
    hydrated,
    setLanguage,
    t,
  };
}
