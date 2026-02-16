import enBigThree from '../../content/en/big_three.json';
import enDefinitions from '../../content/en/definitions.json';
import enTraits from '../../content/en/traits.json';
import enUi from '../../content/en/ui.json';
import plBigThree from '../../content/pl/big_three.json';
import plDefinitions from '../../content/pl/definitions.json';
import plTraits from '../../content/pl/traits.json';
import plUi from '../../content/pl/ui.json';

import { ContentLanguage, ContentLanguageModules, ContentModuleData, ContentModuleName, ContentRepo } from './types';

const CONTENT_BY_LANGUAGE: Record<ContentLanguage, ContentLanguageModules> = {
  en: {
    definitions: enDefinitions,
    big_three: enBigThree,
    traits: enTraits,
    ui: enUi,
  },
  pl: {
    definitions: plDefinitions,
    big_three: plBigThree,
    traits: plTraits,
    ui: plUi,
  },
};

function readPath(source: unknown, pathSegments: string[]): unknown {
  let current: unknown = source;
  for (let i = 0; i < pathSegments.length; i += 1) {
    const segment = pathSegments[i];
    if (typeof current !== 'object' || current === null || !(segment in current)) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[segment];
  }
  return current;
}

function resolveValue(language: ContentLanguage, key: string): unknown {
  const segments = key.split('.').filter(Boolean);
  if (segments.length === 0) {
    return undefined;
  }

  const moduleName = segments[0] as ContentModuleName;
  const localModules = CONTENT_BY_LANGUAGE[language];
  const localModule = localModules[moduleName] as ContentModuleData | undefined;
  const nestedPath = segments.slice(1);

  if (!localModule) {
    return undefined;
  }

  const localValue = readPath(localModule, nestedPath);
  if (localValue !== undefined) {
    return localValue;
  }

  return undefined;
}

function missingString(key: string, language: ContentLanguage): string {
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.warn(`[contentRepo] Missing content key (${language}): ${key}`);
  }
  return `[missing:${key}]`;
}

function warnMissingKey(key: string, language: ContentLanguage): void {
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.warn(`[contentRepo] Missing content key (${language}): ${key}`);
  }
}

export function getContentRepo(language: ContentLanguage): ContentRepo {
  return {
    getString: (key: string): string => {
      const value = resolveValue(language, key);
      return typeof value === 'string' ? value : missingString(key, language);
    },
    getObject: <T>(key: string): T | null => {
      const value = resolveValue(language, key);
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return value as T;
      }
      warnMissingKey(key, language);
      return null;
    },
    getArray: <T>(key: string): T[] => {
      const value = resolveValue(language, key);
      if (Array.isArray(value)) {
        return value as T[];
      }
      warnMissingKey(key, language);
      return [];
    },
  };
}

export function getContent(language: ContentLanguage): ContentRepo {
  return getContentRepo(language);
}

export function tContent(key: string, language: ContentLanguage): string {
  return getContent(language).getString(key);
}

export function getObject<T>(key: string, language: ContentLanguage): T | null {
  return getContent(language).getObject<T>(key);
}

export function getArray<T>(key: string, language: ContentLanguage): T[] {
  return getContent(language).getArray<T>(key);
}
