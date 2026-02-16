import { AstroResult, Placement } from '@/types/astro';

import {
  ComposerLanguage,
  DegreeBandKey,
  getModuleBundle,
  getModuleArray,
  getModuleObject,
  getModuleStringArray,
  getSignCore,
  RoleKey,
  SignCoreEntry,
} from '@/lib/content/moduleRepo';
import { deriveProfileContextFromChart } from '@/src/lib/engine/derive';

export interface EngineProfileOutput {
  bigThree: {
    title: string;
    intro: string;
    cards: Array<{
      role: RoleKey;
      heading: string;
      paragraphs: string[];
    }>;
  };
  dominants: {
    title: string;
    paragraphs: string[];
    bullets: {
      watchOut: string[];
      microRecs: string[];
    };
  };
  traits: {
    title: string;
    paragraphs: string[];
    bullets: {
      strengths: string[];
      risks: string[];
      recommendations: string[];
    };
  };
}

const ROLE_SEGMENT_KEYS: Record<RoleKey, string[]> = {
  sun: ['core_motive', 'work_pattern'],
  moon: ['needs_language', 'cbt_loop_bias'],
  asc: ['strength_expression', 'relationship_pattern'],
};

const BAND_LABELS: Record<ComposerLanguage, Record<DegreeBandKey, string>> = {
  en: {
    early: 'Early',
    mid: 'Mid',
    late: 'Late',
  },
  pl: {
    early: 'Wczesny',
    mid: 'Srodkowy',
    late: 'Pozny',
  },
};

const FALLBACK_OUTPUT: EngineProfileOutput = {
  bigThree: {
    title: 'Big Three',
    intro: '',
    cards: [],
  },
  dominants: {
    title: 'Dominants',
    paragraphs: [],
    bullets: {
      watchOut: [],
      microRecs: [],
    },
  },
  traits: {
    title: 'Traits',
    paragraphs: [],
    bullets: {
      strengths: [],
      risks: [],
      recommendations: [],
    },
  },
};

function toSignKey(sign: string | undefined): string {
  return (sign ?? '').trim().toLowerCase();
}

function dedupeMax(items: string[], max = 6): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < items.length; i += 1) {
    const normalized = items[i].trim();
    if (!normalized || seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    out.push(normalized);
    if (out.length >= max) {
      break;
    }
  }
  return out;
}

function flattenSegment(signCore: SignCoreEntry | null, segmentKey: string): string[] {
  if (!signCore || !signCore.segments || !(segmentKey in signCore.segments)) {
    return [];
  }
  const segment = signCore.segments[segmentKey];
  return Array.isArray(segment?.text) ? segment.text : [];
}

function toBandFromSegment(segment: Placement['segment']): DegreeBandKey {
  if (segment === 'early') {
    return 'early';
  }
  if (segment === 'mid') {
    return 'mid';
  }
  return 'late';
}

function roleLabel(language: ComposerLanguage, role: RoleKey): string {
  if (language === 'pl') {
    if (role === 'sun') return 'Slonce';
    if (role === 'moon') return 'Ksiezyc';
    return 'Ascendent';
  }
  if (role === 'sun') return 'Sun';
  if (role === 'moon') return 'Moon';
  return 'Ascendant';
}

function relationType(a: string, b: string): 'synergy' | 'tension' {
  return a && b && a === b ? 'synergy' : 'tension';
}

function modalityType(a: string, b: string): 'harmony' | 'clash' {
  return a && b && a === b ? 'harmony' : 'clash';
}

function createRoleCard(
  astroPlacement: Placement,
  role: RoleKey,
  language: ComposerLanguage
): { role: RoleKey; heading: string; paragraphs: string[]; signCore: SignCoreEntry | null } {
  const moduleBundle = getModuleBundle(language);
  const roleData = moduleBundle.roleOverlays.roles?.[role];
  const signKey = toSignKey(astroPlacement.sign);
  const signCore = getSignCore(language, signKey);
  const signName = signCore?.name ?? astroPlacement.sign;
  const band = toBandFromSegment(astroPlacement.segment);
  const bandLabel = BAND_LABELS[language][band];

  const selectedSegments = ROLE_SEGMENT_KEYS[role]
    .flatMap((segmentKey) => flattenSegment(signCore, segmentKey))
    .slice(0, 3);

  const degreeParagraph = getModuleStringArray(language, `degreeModifiers.bands.${band}.byRole.${role}`)[0];
  const decanParagraph = getModuleStringArray(
    language,
    `decanOverlays.decans.${astroPlacement.decan}.byRole.${role}`
  )[0];
  const segmentOverlay = getModuleStringArray(
    language,
    `decanOverlays.segments.${astroPlacement.segment}.byRole.${role}`
  )[0];
  const cuspShared = getModuleStringArray(
    language,
    astroPlacement.isCusp ? 'cuspOverlays.cusp.shared' : 'cuspOverlays.nonCusp.shared'
  )[0];
  const cuspRole = astroPlacement.isCusp
    ? getModuleStringArray(language, `cuspOverlays.cusp.byRole.${role}`)[0]
    : undefined;
  const cuspSuffix = astroPlacement.isCusp ? ' • Cusp' : '';
  const heading = `${roleLabel(language, role)} - ${signName} (${bandLabel})${cuspSuffix}`;
  const paragraphs = [
    ...(Array.isArray(roleData?.templates?.opening) ? roleData.templates.opening : []),
    ...selectedSegments,
    ...(degreeParagraph ? [degreeParagraph] : []),
    ...(decanParagraph ? [decanParagraph] : []),
    ...(segmentOverlay ? [segmentOverlay] : []),
    ...(cuspShared ? [cuspShared] : []),
    ...(cuspRole ? [cuspRole] : []),
    ...(Array.isArray(roleData?.templates?.anchors) && roleData.templates.anchors.length > 0
      ? [roleData.templates.anchors[0]]
      : []),
    ...(Array.isArray(roleData?.templates?.integrationCue) ? roleData.templates.integrationCue : []),
  ].filter(Boolean);

  return {
    role,
    heading,
    paragraphs,
    signCore,
  };
}

function findTemplateParagraphs(
  templates: Array<{ selector?: { compatibility?: string; modalityRelation?: string }; text?: string[] }>,
  selector: { compatibility?: string; modalityRelation?: string }
): string[] {
  for (let i = 0; i < templates.length; i += 1) {
    const candidate = templates[i];
    const matchCompatibility =
      selector.compatibility === undefined
      || candidate.selector?.compatibility === selector.compatibility;
    const matchModality =
      selector.modalityRelation === undefined
      || candidate.selector?.modalityRelation === selector.modalityRelation;
    if (matchCompatibility && matchModality) {
      return Array.isArray(candidate.text) ? candidate.text : [];
    }
  }
  return [];
}

function computeDominantFromPlacements(
  placements: Array<{ sign: string }>
): { element: string | null; modality: string | null } {
  const elementCounts: Record<string, number> = {};
  const modalityCounts: Record<string, number> = {};
  for (let i = 0; i < placements.length; i += 1) {
    const key = toSignKey(placements[i].sign);
    const core = getSignCore('en', key);
    if (!core) {
      continue;
    }
    elementCounts[core.element] = (elementCounts[core.element] ?? 0) + 1;
    modalityCounts[core.modality] = (modalityCounts[core.modality] ?? 0) + 1;
  }

  const topElement = Object.entries(elementCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const topModality = Object.entries(modalityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  return { element: topElement, modality: topModality };
}

function safeBullets(values: string[] | undefined): string[] {
  return Array.isArray(values) ? values.filter((item) => typeof item === 'string' && item.trim().length > 0) : [];
}

export function composeProfile(astroResult: AstroResult | null | undefined, language: ComposerLanguage): EngineProfileOutput {
  if (!astroResult?.chart) {
    return FALLBACK_OUTPUT;
  }
  const context = astroResult.context ?? deriveProfileContextFromChart(
    {
      dateISO: '2000-01-01',
      timeHHmm: '12:00',
      placeName: 'Unknown',
      timezone: 'UTC',
    },
    astroResult.chart
  );

  const sunPlacement = context.placements.sun;
  const moonPlacement = context.placements.moon;
  const ascPlacement = context.placements.asc;

  const sunCard = createRoleCard(sunPlacement, 'sun', language);
  const moonCard = createRoleCard(moonPlacement, 'moon', language);
  const ascCard = createRoleCard(ascPlacement, 'asc', language);
  const signCores = [sunCard.signCore, moonCard.signCore, ascCard.signCore].filter((item): item is SignCoreEntry => Boolean(item));

  const dominantElementFromChart = astroResult.chart.dominantElement?.toLowerCase?.() ?? null;
  const dominantModalityFromChart = astroResult.chart.dominantModality?.toLowerCase?.() ?? null;
  const computedDominants = computeDominantFromPlacements([
    { sign: sunPlacement.sign },
    { sign: moonPlacement.sign },
    ...(Array.isArray(astroResult.chart.planets) ? astroResult.chart.planets : []),
  ]);
  const dominantElement = dominantElementFromChart ?? computedDominants.element;
  const dominantModality = dominantModalityFromChart ?? computedDominants.modality;

  const dominantElementText = dominantElement
    ? getModuleStringArray(language, `dominantOverlays.elements.${dominantElement}.text`)
    : [];
  const dominantModalityText = dominantModality
    ? getModuleStringArray(language, `dominantOverlays.modalities.${dominantModality}.text`)
    : [];
  const dominantWatchOut = dedupeMax([
    ...(dominantElement ? getModuleStringArray(language, `dominantOverlays.elements.${dominantElement}.watchOut`) : []),
    ...(dominantModality ? getModuleStringArray(language, `dominantOverlays.modalities.${dominantModality}.watchOut`) : []),
  ]);
  const dominantMicroRecs = dedupeMax([
    ...(dominantElement ? getModuleStringArray(language, `dominantOverlays.elements.${dominantElement}.microRecs`) : []),
    ...(dominantModality ? getModuleStringArray(language, `dominantOverlays.modalities.${dominantModality}.microRecs`) : []),
  ]);

  const pairTemplates = getModuleArray<{ selector?: { compatibility?: string; modalityRelation?: string }; text?: string[] }>(
    language,
    'pairDynamics.templates'
  );
  const pairClosers = getModuleStringArray(language, 'pairDynamics.integration_closers');
  const pairParagraphs = dedupeMax([
    ...findTemplateParagraphs(pairTemplates, {
      compatibility: relationType(sunCard.signCore?.element ?? '', moonCard.signCore?.element ?? ''),
    }),
    ...findTemplateParagraphs(pairTemplates, {
      compatibility: relationType(moonCard.signCore?.element ?? '', ascCard.signCore?.element ?? ''),
    }),
    ...findTemplateParagraphs(pairTemplates, {
      modalityRelation: modalityType(sunCard.signCore?.modality ?? '', moonCard.signCore?.modality ?? ''),
    }),
    ...findTemplateParagraphs(pairTemplates, {
      modalityRelation: modalityType(moonCard.signCore?.modality ?? '', ascCard.signCore?.modality ?? ''),
    }),
    ...pairClosers,
  ], 6);

  const traitsParagraphs = [
    language === 'pl'
      ? `Poniewaz Twoje Slonce jest w ${sunCard.signCore?.name ?? sunPlacement.sign}, glowny kierunek dzialania wynika z tego, jak zamieniasz intencje w decyzje.`
      : `Because your Sun is in ${sunCard.signCore?.name ?? sunPlacement.sign}, your direction is shaped by how intention becomes decision.`,
    language === 'pl'
      ? `Poniewaz Twoj Ksiezyc jest w ${moonCard.signCore?.name ?? moonPlacement.sign}, regulacja emocji zalezy od tego, jak szybko nazywasz potrzeby i zamykasz petle stresu.`
      : `Because your Moon is in ${moonCard.signCore?.name ?? moonPlacement.sign}, emotional regulation depends on how early you name needs and close stress loops.`,
    language === 'pl'
      ? `Poniewaz Twoj Ascendent jest w ${ascCard.signCore?.name ?? ascPlacement.sign}, styl pierwszego kontaktu ustawia tempo relacji i przejsc.`
      : `Because your Ascendant is in ${ascCard.signCore?.name ?? ascPlacement.sign}, your first-contact style sets the tempo of interactions and transitions.`,
    ...pairParagraphs,
  ];

  return {
    bigThree: {
      title: language === 'pl' ? 'Wielka Trojka' : 'Big Three',
      intro: language === 'pl'
        ? 'Wielka Trojka laczy warstwe tozsamosci, regulacji emocji i styl wejscia w nowe sytuacje.'
        : 'The Big Three combines identity, emotional regulation, and first-contact style.',
      cards: [
        { role: sunCard.role, heading: sunCard.heading, paragraphs: sunCard.paragraphs },
        { role: moonCard.role, heading: moonCard.heading, paragraphs: moonCard.paragraphs },
        { role: ascCard.role, heading: ascCard.heading, paragraphs: ascCard.paragraphs },
      ],
    },
    dominants: {
      title: language === 'pl' ? 'Dominujaca energia i jej znaczenie' : 'Dominant Energy and Meaning',
      paragraphs: [...dominantElementText, ...dominantModalityText],
      bullets: {
        watchOut: dominantWatchOut,
        microRecs: dominantMicroRecs,
      },
    },
    traits: {
      title: language === 'pl' ? 'Cechy i wzorce' : 'Traits and Patterns',
      paragraphs: traitsParagraphs,
      bullets: {
        strengths: dedupeMax(signCores.flatMap((entry) => safeBullets(entry.bullets.strengths))),
        risks: dedupeMax(signCores.flatMap((entry) => safeBullets(entry.bullets.risks))),
        recommendations: dedupeMax(signCores.flatMap((entry) => safeBullets(entry.bullets.recommendations))),
      },
    },
  };
}
