import enPremiumV2Raw from '@/content/packs/en/premium_v2.json';
import plPremiumV2Raw from '@/content/packs/pl/premium_v2.json';
import { useToastStore } from '@/store/useToastStore';

export type ContentBlock = {
  id: string;
  locale: 'pl' | 'en';
  kind: string;
  section: string;
  tier: string;
  title: string;
  body_md: string;
  tags: string[];
  placeholders: Record<string, string | number | boolean | null>;
  version: string;
};

const EXPECTED_COUNT = 84;
const MOJIBAKE_PATTERN = /(?:\u00C3.|\u00C5.|\u00C4.|\u0102.|\u0139.|\u00E2\u20AC|\u00C2|\uFFFD)/;
const REQUIRED_KEYS: Array<keyof ContentBlock> = [
  'id',
  'locale',
  'kind',
  'section',
  'tier',
  'title',
  'body_md',
  'tags',
  'placeholders',
  'version',
];

const RAW_PACKS: Record<'pl' | 'en', unknown> = {
  pl: plPremiumV2Raw,
  en: enPremiumV2Raw,
};

const cache = new Map<'pl' | 'en', ContentBlock[]>();

function notifyDevValidationError(message: string): void {
  try {
    useToastStore.getState().showToast(message);
  } catch {
    // noop
  }
}

function validatePack(locale: 'pl' | 'en', value: unknown): ContentBlock[] {
  if (!Array.isArray(value)) {
    throw new Error(`[premium_v2] locale=${locale} pack is not an array`);
  }

  const blocks = value as ContentBlock[];
  if (blocks.length !== EXPECTED_COUNT) {
    throw new Error(`[premium_v2] locale=${locale} expected ${EXPECTED_COUNT} blocks, got ${blocks.length}`);
  }

  const seen = new Set<string>();
  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];
    if (!block || typeof block !== 'object') {
      throw new Error(`[premium_v2] locale=${locale} block at index=${index} is invalid`);
    }

    for (let keyIndex = 0; keyIndex < REQUIRED_KEYS.length; keyIndex += 1) {
      const key = REQUIRED_KEYS[keyIndex];
      if (!(key in block)) {
        throw new Error(`[premium_v2] locale=${locale} missing key=${key} at index=${index}`);
      }
    }

    if (seen.has(block.id)) {
      throw new Error(`[premium_v2] locale=${locale} duplicate id=${block.id}`);
    }
    seen.add(block.id);

    if (locale === 'pl') {
      if (MOJIBAKE_PATTERN.test(block.title)) {
        throw new Error(`[premium_v2] locale=${locale} mojibake detected in title id=${block.id}`);
      }
      if (MOJIBAKE_PATTERN.test(block.body_md)) {
        throw new Error(`[premium_v2] locale=${locale} mojibake detected in body_md id=${block.id}`);
      }
    }
  }

  return blocks;
}

export function loadPremiumV2(locale: 'pl' | 'en'): ContentBlock[] {
  const cached = cache.get(locale);
  if (cached) {
    return cached;
  }

  const raw = RAW_PACKS[locale];

  try {
    const parsed = validatePack(locale, raw);
    cache.set(locale, parsed);
    return parsed;
  } catch (error) {
    const message = error instanceof Error ? error.message : `[premium_v2] locale=${locale} unknown validation error`;
    if (__DEV__) {
      notifyDevValidationError(message);
      throw new Error(message);
    }
    console.error(message);
    return [];
  }
}
