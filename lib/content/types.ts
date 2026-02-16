import { AppLocale } from '@/store/useLocaleStore';

export type ContentLanguage = AppLocale;

export type ContentModuleName = 'definitions' | 'big_three' | 'traits' | 'ui';

export type ContentModuleData = Record<string, unknown>;

export type ContentLanguageModules = Record<ContentModuleName, ContentModuleData>;

export interface ContentRepo {
  getString: (key: string) => string;
  getObject: <T>(key: string) => T | null;
  getArray: <T>(key: string) => T[];
}
