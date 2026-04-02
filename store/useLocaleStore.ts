import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

export type AppLocale = 'en' | 'pl';

const LOCALE_STORAGE_KEY = 'birthcode.locale';

interface LocaleState {
  language: AppLocale;
  hydrated: boolean;
}

interface LocaleActions {
  hydrateLanguage: () => Promise<void>;
  setLanguage: (language: AppLocale) => Promise<void>;
}

type LocaleStore = LocaleState & LocaleActions;

export const useLocaleStore = create<LocaleStore>((set, get) => ({
  language: 'en',
  hydrated: false,
  hydrateLanguage: async () => {
    if (get().hydrated) {
      return;
    }
    try {
      const saved = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);
      if (saved === 'en' || saved === 'pl') {
        set({ language: saved, hydrated: true });
        return;
      }
    } catch {
      // keep default English on storage read error
    }
    set({ hydrated: true });
  },
  setLanguage: async (language: AppLocale) => {
    set({ language });
    try {
      await AsyncStorage.setItem(LOCALE_STORAGE_KEY, language);
    } catch {
      // keep runtime language even if persistence fails
    }
  },
}));
