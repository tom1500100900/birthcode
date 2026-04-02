import { EN_ARCHETYPE_SIGNATURES } from '@/lib/content-packs/en/birthcode/archetypes';
import { EN_BIRTHCODE_SECTION_ORDER, EN_BIRTHCODE_SECTION_TEMPLATES, EN_BIRTHCODE_SECTION_TITLES } from '@/lib/content-packs/en/birthcode/sections';
import { EN_TENSION_SNIPPETS } from '@/lib/content-packs/en/birthcode/tensions';
import { segmentSnippet as enSegmentSnippet } from '@/lib/content-packs/en/birthcode/segments';
import { zodiacRoleSnippet as enZodiacRoleSnippet } from '@/lib/content-packs/en/birthcode/zodiac';
import { EN_MATCH_SECTION_TEMPLATES } from '@/lib/content-packs/en/match/narrative';
import { EN_MATCH_BREAKDOWN_LABELS, EN_MATCH_REASON_TEMPLATES } from '@/lib/content-packs/en/match/scoring';
import { EN_PRACTICES } from '@/lib/content-packs/en/practices/practices';
import { PL_ARCHETYPE_SIGNATURES } from '@/lib/content-packs/pl/birthcode/archetypes';
import { PL_BIRTHCODE_SECTION_ORDER, PL_BIRTHCODE_SECTION_TEMPLATES, PL_BIRTHCODE_SECTION_TITLES } from '@/lib/content-packs/pl/birthcode/sections';
import { PL_TENSION_SNIPPETS } from '@/lib/content-packs/pl/birthcode/tensions';
import { segmentSnippet as plSegmentSnippet } from '@/lib/content-packs/pl/birthcode/segments';
import { zodiacRoleSnippet as plZodiacRoleSnippet } from '@/lib/content-packs/pl/birthcode/zodiac';
import { PL_MATCH_SECTION_TEMPLATES } from '@/lib/content-packs/pl/match/narrative';
import { PL_MATCH_BREAKDOWN_LABELS, PL_MATCH_REASON_TEMPLATES } from '@/lib/content-packs/pl/match/scoring';
import { PL_PRACTICES } from '@/lib/content-packs/pl/practices/practices';
import type { SupportedLang } from '@/lib/content-engine/contracts';

type SectionId = 'hook' | 'who_you_are' | 'tension' | 'how_you_work' | 'stress' | 'relations';

type LoadedPacks = {
  lang: SupportedLang;
  fallbackText: string;
  birthcode: {
    sectionOrder: readonly SectionId[];
    sectionTitles: Record<SectionId, string>;
    sectionTemplates: Record<SectionId, readonly string[]>;
    archetypeSignatures: Record<string, string>;
    tensionSnippets: Record<string, string>;
    zodiacRoleSnippet: (sign: string, role: 'sun' | 'moon' | 'asc') => string;
    segmentSnippet: (role: 'sun' | 'moon' | 'asc', segment: 'early' | 'mid' | 'late') => string;
  };
  practices: {
    list: typeof PL_PRACTICES;
  };
  match: {
    scoring: {
      breakdownLabels: Record<string, string>;
      reasonTemplates: Record<'strong' | 'medium' | 'low', string>;
    };
    narrative: {
      overallTitle: string;
      overallBody: string;
      dynamicTitle: string;
      dynamicBody: string;
      growthTitle: string;
      growthBody: string;
    };
  };
};

function devMissing(lang: SupportedLang, key: string): void {
  if (__DEV__) {
    console.warn(`[content-pack:${lang}] Missing key: ${key}`);
  }
}

function ensureString(lang: SupportedLang, key: string, value: unknown, fallbackText: string): string {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }
  devMissing(lang, key);
  return fallbackText;
}

function ensureStringArray(lang: SupportedLang, key: string, value: unknown, fallbackText: string): string[] {
  if (Array.isArray(value) && value.length > 0 && value.every((item) => typeof item === 'string')) {
    return value as string[];
  }
  devMissing(lang, key);
  return [fallbackText];
}

function buildForLang(lang: SupportedLang): LoadedPacks {
  const fallbackText = lang === 'pl' ? 'Tresc w przygotowaniu.' : 'Content in progress.';
  if (lang === 'pl') {
    return {
      lang,
      fallbackText,
      birthcode: {
        sectionOrder: PL_BIRTHCODE_SECTION_ORDER,
        sectionTitles: PL_BIRTHCODE_SECTION_TITLES,
        sectionTemplates: PL_BIRTHCODE_SECTION_TEMPLATES,
        archetypeSignatures: PL_ARCHETYPE_SIGNATURES,
        tensionSnippets: PL_TENSION_SNIPPETS,
        zodiacRoleSnippet: (sign, role) => {
          const normalizedRole = role === 'sun' ? 'Sun' : role === 'moon' ? 'Moon' : 'Asc';
          return plZodiacRoleSnippet(sign, normalizedRole)?.text ?? fallbackText;
        },
        segmentSnippet: (role, segment) => plSegmentSnippet(role, segment) ?? fallbackText,
      },
      practices: {
        list: PL_PRACTICES,
      },
      match: {
        scoring: {
          breakdownLabels: PL_MATCH_BREAKDOWN_LABELS,
          reasonTemplates: PL_MATCH_REASON_TEMPLATES,
        },
        narrative: PL_MATCH_SECTION_TEMPLATES,
      },
    };
  }

  return {
    lang,
    fallbackText,
    birthcode: {
      sectionOrder: EN_BIRTHCODE_SECTION_ORDER as readonly SectionId[],
      sectionTitles: EN_BIRTHCODE_SECTION_TITLES as Record<SectionId, string>,
      sectionTemplates: EN_BIRTHCODE_SECTION_TEMPLATES as Record<SectionId, readonly string[]>,
      archetypeSignatures: EN_ARCHETYPE_SIGNATURES,
      tensionSnippets: EN_TENSION_SNIPPETS,
      zodiacRoleSnippet: (sign, role) => {
        const normalizedRole = role === 'sun' ? 'Sun' : role === 'moon' ? 'Moon' : 'Asc';
        return enZodiacRoleSnippet(sign, normalizedRole)?.text ?? fallbackText;
      },
      segmentSnippet: (role, segment) => enSegmentSnippet(role, segment) ?? fallbackText,
    },
    practices: {
      list: EN_PRACTICES,
    },
    match: {
      scoring: {
        breakdownLabels: EN_MATCH_BREAKDOWN_LABELS,
        reasonTemplates: EN_MATCH_REASON_TEMPLATES,
      },
      narrative: EN_MATCH_SECTION_TEMPLATES,
    },
  };
}

export function loadPacks(requested: SupportedLang): LoadedPacks {
  const primary = buildForLang(requested);
  const fallback = requested === 'pl' ? buildForLang('en') : buildForLang('pl');

  const mergedSectionTitles = {} as Record<SectionId, string>;
  const mergedSectionTemplates = {} as Record<SectionId, readonly string[]>;
  for (let i = 0; i < primary.birthcode.sectionOrder.length; i += 1) {
    const id = primary.birthcode.sectionOrder[i];
    mergedSectionTitles[id] = ensureString(
      requested,
      `birthcode.sectionTitles.${id}`,
      primary.birthcode.sectionTitles[id] ?? fallback.birthcode.sectionTitles[id],
      primary.fallbackText
    );
    mergedSectionTemplates[id] = ensureStringArray(
      requested,
      `birthcode.sectionTemplates.${id}`,
      primary.birthcode.sectionTemplates[id] ?? fallback.birthcode.sectionTemplates[id],
      primary.fallbackText
    );
  }

  return {
    ...primary,
    birthcode: {
      ...primary.birthcode,
      sectionTitles: mergedSectionTitles,
      sectionTemplates: mergedSectionTemplates,
    },
  };
}
