import { contentModulesByLocale } from '@/content/generated';

import { AppLocale } from '@/store/useLocaleStore';

export type ComposerLanguage = AppLocale;
export type RoleKey = 'sun' | 'moon' | 'asc';
export type DegreeBandKey = 'early' | 'mid' | 'late';

export interface SignCoreEntry {
  id: string;
  name: string;
  element: string;
  modality: string;
  segments: Record<string, { text: string[] }>;
  bullets: {
    strengths: string[];
    risks: string[];
    recommendations: string[];
  };
}

export interface ModuleBundle {
  roleOverlays: (typeof contentModulesByLocale)['en']['roleOverlays'];
  degreeModifiers: (typeof contentModulesByLocale)['en']['degreeModifiers'];
  dominantOverlays: (typeof contentModulesByLocale)['en']['dominantOverlays'];
  pairDynamics: (typeof contentModulesByLocale)['en']['pairDynamics'];
  signCore: (typeof contentModulesByLocale)['en']['signCore'];
  decanOverlays: (typeof contentModulesByLocale)['en']['decanOverlays'];
  cuspOverlays: (typeof contentModulesByLocale)['en']['cuspOverlays'];
}

const MODULES_BY_LANGUAGE: Record<ComposerLanguage, ModuleBundle> = {
  en: contentModulesByLocale.en,
  pl: contentModulesByLocale.pl,
};

function warnMissing(path: string, language: ComposerLanguage): void {
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.warn(`[moduleRepo] Missing module key (${language}): ${path}`);
  }
}

function readPath(source: unknown, segments: string[]): unknown {
  let current = source;
  for (let i = 0; i < segments.length; i += 1) {
    const segment = segments[i];
    if (!current || typeof current !== 'object' || !(segment in current)) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[segment];
  }
  return current;
}

export function getModuleBundle(language: ComposerLanguage): ModuleBundle {
  return MODULES_BY_LANGUAGE[language];
}

export function getModuleStringArray(language: ComposerLanguage, path: string): string[] {
  const value = readPath(getModuleBundle(language), path.split('.'));
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string');
  }
  warnMissing(path, language);
  return [];
}

export function getModuleObject<T>(language: ComposerLanguage, path: string): T | null {
  const value = readPath(getModuleBundle(language), path.split('.'));
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as T;
  }
  warnMissing(path, language);
  return null;
}

export function getModuleArray<T>(language: ComposerLanguage, path: string): T[] {
  const value = readPath(getModuleBundle(language), path.split('.'));
  if (Array.isArray(value)) {
    if (__DEV__ && path === 'pairDynamics.templates') {
      // eslint-disable-next-line no-console
      console.log(`[moduleRepo] Loaded ${path} for locale=${language} (count=${value.length})`);
    }
    return value as T[];
  }
  warnMissing(path, language);
  return [];
}

export function getSignCore(language: ComposerLanguage, signKey: string): SignCoreEntry | null {
  const signs = getModuleObject<Record<string, SignCoreEntry>>(language, 'signCore.signs');
  if (!signs || !(signKey in signs)) {
    warnMissing(`signCore.signs.${signKey}`, language);
    return null;
  }
  return signs[signKey];
}
