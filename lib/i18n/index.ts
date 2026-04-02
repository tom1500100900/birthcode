import { AppLocale } from '@/store/useLocaleStore';

type TranslationLeaf = string;
type TranslationTree = {
  [key: string]: TranslationLeaf | TranslationTree;
};

const en = require('../../locales/en.json') as TranslationTree;
const pl = require('../../locales/pl.json') as TranslationTree;

const resources: Record<AppLocale, TranslationTree> = {
  en,
  pl,
};

function getNestedValue(source: TranslationTree, path: string): string | undefined {
  const parts = path.split('.');
  let current: TranslationTree | TranslationLeaf | undefined = source;

  for (let i = 0; i < parts.length; i += 1) {
    if (!current || typeof current === 'string') {
      return undefined;
    }
    current = current[parts[i]];
  }

  return typeof current === 'string' ? current : undefined;
}

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) {
    return template;
  }
  return Object.keys(params).reduce((text, key) => {
    const value = String(params[key]);
    return text.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), value);
  }, template);
}

export function translate(
  language: AppLocale,
  key: string,
  params?: Record<string, string | number>
): string {
  const primary = getNestedValue(resources[language], key);
  const fallback = getNestedValue(resources.en, key);
  const raw = primary ?? fallback ?? key;
  return interpolate(raw, params);
}
