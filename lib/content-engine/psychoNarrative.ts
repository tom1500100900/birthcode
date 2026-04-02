import type { ContentPackLocale, NormalizedAstroV2 } from '@/lib/content-engine/types';
import { enProfileNarrativePack } from '@/lib/content-packs/en/profileNarrative';
import { plProfileNarrativePack } from '@/lib/content-packs/pl/profileNarrative';

export type RoleKey = 'sun' | 'moon' | 'asc';
export type SegmentKey = 'early' | 'mid' | 'late';

export const METRIC_KEYS = [
  'curiosity_openness',
  'analytical_order',
  'emotional_sensitivity',
  'intensity_depth',
  'social_expression',
  'control_need',
  'adaptability',
  'persistence_drive',
  'risk_orientation',
  'connection_need',
] as const;

export type MetricKey = (typeof METRIC_KEYS)[number];
export type MetricMap = Record<MetricKey, number>;
type MutableMetricMap = Record<MetricKey, number>;

export const NARRATIVE_SECTION_KEYS = [
  'overview',
  'sun',
  'moon',
  'asc',
  'decisions',
  'genius',
  'stress',
  'leadership',
  'recommendations',
] as const;

export type NarrativeSectionKey = (typeof NARRATIVE_SECTION_KEYS)[number];

export type NarrativeSection = {
  id: NarrativeSectionKey;
  title: string;
  paragraphs: string[];
};

export type NarrativeResult = Record<NarrativeSectionKey, NarrativeSection>;

export const ARCHETYPE_KEYS = [
  'Explorer Mind',
  'System Builder',
  'Strategic Transformer',
  'Social Catalyst',
  'Sensitive Analyst',
  'Steady Builder',
  'Visionary Architect',
  'Deep Strategist',
  'Curious Integrator',
  'Pragmatic Optimizer',
  'Relational Harmonizer',
  'Adaptive Pioneer',
] as const;

export type ArchetypeKey = (typeof ARCHETYPE_KEYS)[number];

export const TENSION_KEYS = [
  'exploration_vs_control',
  'analysis_vs_speed',
  'independence_vs_connection',
  'intensity_vs_lightness',
  'perfection_vs_progress',
] as const;

export type TensionKey = (typeof TENSION_KEYS)[number];

export type DetectedTension = {
  key: TensionKey;
  leftMetric: MetricKey;
  rightMetric: MetricKey;
  leftValue: number;
  rightValue: number;
  intensity: number;
  dominantSide: 'left' | 'right';
};

export type DominantEnergySignal = {
  element?: NonNullable<NormalizedAstroV2['dominantElement']>;
  modality?: NonNullable<NormalizedAstroV2['dominantModality']>;
  label: string;
};

export type BigThreeSignal = Record<RoleKey, { sign: string; degree?: number; segment: SegmentKey }>;

export type BirthcodeSignals = {
  bigThree: BigThreeSignal;
  metrics: MetricMap;
  archetype: ArchetypeKey;
  tensions: DetectedTension[];
  dominantEnergy: DominantEnergySignal;
  priorities: {
    tensions: TensionKey[];
    archetype: ArchetypeKey;
    metrics: MetricKey[];
  };
};

export type MetricsComputation = {
  metrics: MetricMap;
  segments: Record<RoleKey, SegmentKey>;
  roleContributions: Record<RoleKey, MutableMetricMap>;
};

const BASE_METRIC_SCORE = 40;

const ZERO_METRICS: MutableMetricMap = {
  curiosity_openness: 0,
  analytical_order: 0,
  emotional_sensitivity: 0,
  intensity_depth: 0,
  social_expression: 0,
  control_need: 0,
  adaptability: 0,
  persistence_drive: 0,
  risk_orientation: 0,
  connection_need: 0,
};

const signInfluence: Record<string, Partial<Record<string, number>>> = {
  Gemini: {
    curiosity_openness: 20,
    social_expression: 10,
    adaptability: 8,
  },
  Virgo: {
    analytical_order: 20,
    persistence_drive: 10,
    self_criticism: 8,
  },
  Scorpio: {
    intensity_depth: 20,
    control_need: 12,
    emotional_sensitivity: 6,
  },
  Aries: {
    risk_orientation: 18,
    adaptability: 10,
  },
  Taurus: {
    persistence_drive: 20,
    control_need: 10,
  },
  Cancer: {
    emotional_sensitivity: 18,
    connection_need: 12,
  },
  Leo: {
    social_expression: 18,
    risk_orientation: 8,
  },
  Libra: {
    social_expression: 16,
    connection_need: 10,
  },
  Sagittarius: {
    curiosity_openness: 18,
    risk_orientation: 12,
  },
  Capricorn: {
    persistence_drive: 18,
    control_need: 12,
  },
  Aquarius: {
    curiosity_openness: 16,
    adaptability: 14,
  },
  Pisces: {
    emotional_sensitivity: 18,
    connection_need: 10,
  },
};

const signSegmentInfluence: Record<string, Record<SegmentKey, Partial<Record<string, number>>>> = {
  Gemini: {
    early: { curiosity_openness: 6, adaptability: 4, persistence_drive: -3 },
    mid: { curiosity_openness: 4, social_expression: 3 },
    late: { curiosity_openness: 4, persistence_drive: 4, analytical_order: 2 },
  },
  Virgo: {
    early: { analytical_order: 6, control_need: 2 },
    mid: { analytical_order: 5, persistence_drive: 3 },
    late: { analytical_order: 4, control_need: 4, self_criticism: 4 },
  },
  Scorpio: {
    early: { intensity_depth: 6, emotional_sensitivity: 2 },
    mid: { intensity_depth: 5, persistence_drive: 3 },
    late: { intensity_depth: 6, control_need: 6 },
  },
  Aries: {
    early: { risk_orientation: 6, adaptability: 3 },
    mid: { risk_orientation: 4 },
    late: { risk_orientation: 3, persistence_drive: 3 },
  },
  Taurus: {
    early: { persistence_drive: 5 },
    mid: { persistence_drive: 4, control_need: 2 },
    late: { persistence_drive: 3, control_need: 4 },
  },
  Cancer: {
    early: { emotional_sensitivity: 6 },
    mid: { emotional_sensitivity: 4, connection_need: 3 },
    late: { emotional_sensitivity: 3, connection_need: 5 },
  },
  Leo: {
    early: { social_expression: 6 },
    mid: { social_expression: 4 },
    late: { social_expression: 3, persistence_drive: 3 },
  },
  Libra: {
    early: { social_expression: 5 },
    mid: { connection_need: 4 },
    late: { connection_need: 5, control_need: 2 },
  },
  Sagittarius: {
    early: { curiosity_openness: 6, risk_orientation: 4 },
    mid: { curiosity_openness: 4 },
    late: { curiosity_openness: 3, persistence_drive: 3 },
  },
  Capricorn: {
    early: { persistence_drive: 6 },
    mid: { persistence_drive: 4, control_need: 3 },
    late: { persistence_drive: 3, control_need: 5 },
  },
  Aquarius: {
    early: { adaptability: 6 },
    mid: { curiosity_openness: 4 },
    late: { adaptability: 4, analytical_order: 3 },
  },
  Pisces: {
    early: { emotional_sensitivity: 6 },
    mid: { emotional_sensitivity: 4 },
    late: { emotional_sensitivity: 3, connection_need: 4 },
  },
};

const SIGN_BY_LOWER: Record<string, keyof typeof signInfluence> = {
  aries: 'Aries',
  taurus: 'Taurus',
  gemini: 'Gemini',
  cancer: 'Cancer',
  leo: 'Leo',
  virgo: 'Virgo',
  libra: 'Libra',
  scorpio: 'Scorpio',
  sagittarius: 'Sagittarius',
  capricorn: 'Capricorn',
  aquarius: 'Aquarius',
  pisces: 'Pisces',
};

const archetypeWeights: Record<ArchetypeKey, Partial<Record<MetricKey, number>>> = {
  'Explorer Mind': {
    curiosity_openness: 1.5,
    adaptability: 1.1,
    risk_orientation: 1.0,
  },
  'System Builder': {
    analytical_order: 1.4,
    persistence_drive: 1.2,
    control_need: 0.8,
  },
  'Strategic Transformer': {
    intensity_depth: 1.2,
    control_need: 1.1,
    adaptability: 1.0,
  },
  'Social Catalyst': {
    social_expression: 1.4,
    connection_need: 1.1,
    risk_orientation: 0.6,
  },
  'Sensitive Analyst': {
    emotional_sensitivity: 1.3,
    analytical_order: 1.0,
    connection_need: 0.8,
  },
  'Steady Builder': {
    persistence_drive: 1.4,
    control_need: 1.0,
    risk_orientation: -0.2,
  },
  'Visionary Architect': {
    curiosity_openness: 1.3,
    analytical_order: 1.1,
    persistence_drive: 0.8,
  },
  'Deep Strategist': {
    intensity_depth: 1.3,
    analytical_order: 1.0,
    control_need: 1.0,
  },
  'Curious Integrator': {
    curiosity_openness: 1.2,
    connection_need: 1.0,
    adaptability: 1.0,
  },
  'Pragmatic Optimizer': {
    analytical_order: 1.2,
    adaptability: 1.0,
    persistence_drive: 1.0,
  },
  'Relational Harmonizer': {
    connection_need: 1.3,
    emotional_sensitivity: 1.1,
    social_expression: 0.8,
  },
  'Adaptive Pioneer': {
    adaptability: 1.4,
    risk_orientation: 1.0,
    social_expression: 0.8,
  },
};

const tensionMetricPairs: Array<{ key: TensionKey; left: MetricKey; right: MetricKey }> = [
  { key: 'exploration_vs_control', left: 'curiosity_openness', right: 'control_need' },
  { key: 'analysis_vs_speed', left: 'analytical_order', right: 'risk_orientation' },
  { key: 'independence_vs_connection', left: 'risk_orientation', right: 'connection_need' },
  { key: 'intensity_vs_lightness', left: 'intensity_depth', right: 'social_expression' },
  { key: 'perfection_vs_progress', left: 'analytical_order', right: 'adaptability' },
];

function cloneZeroMetrics(): MutableMetricMap {
  return { ...ZERO_METRICS };
}

function clampMetric(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function toSignKey(sign: string | undefined): keyof typeof signInfluence {
  const lower = String(sign ?? '').trim().toLowerCase();
  return SIGN_BY_LOWER[lower] ?? 'Aries';
}

function isMetricKey(value: string): value is MetricKey {
  return (METRIC_KEYS as readonly string[]).includes(value);
}

function applyInfluence(
  source: Partial<Record<string, number>> | undefined,
  metrics: MutableMetricMap,
  roleMetrics: MutableMetricMap
): void {
  if (!source) {
    return;
  }
  const entries = Object.entries(source);
  for (let i = 0; i < entries.length; i += 1) {
    const [metricKey, amount] = entries[i];
    if (!isMetricKey(metricKey)) {
      continue;
    }
    if (typeof amount !== 'number' || !Number.isFinite(amount)) {
      continue;
    }
    metrics[metricKey] += amount;
    roleMetrics[metricKey] += amount;
  }
}

function normalizeDegree(degree?: number): number | null {
  if (typeof degree !== 'number' || !Number.isFinite(degree)) {
    return null;
  }
  const normalized = ((degree % 30) + 30) % 30;
  return normalized;
}

export function detectSegment(degree?: number): SegmentKey {
  const normalized = normalizeDegree(degree);
  if (normalized === null) {
    return 'mid';
  }
  if (normalized < 10) {
    return 'early';
  }
  if (normalized < 20) {
    return 'mid';
  }
  return 'late';
}

export function calcMetrics(normalized: NormalizedAstroV2): MetricsComputation {
  const metrics = cloneZeroMetrics();
  const keys = METRIC_KEYS;
  for (let i = 0; i < keys.length; i += 1) {
    metrics[keys[i]] = BASE_METRIC_SCORE;
  }

  const roleContributions: Record<RoleKey, MutableMetricMap> = {
    sun: cloneZeroMetrics(),
    moon: cloneZeroMetrics(),
    asc: cloneZeroMetrics(),
  };

  const placements: Record<RoleKey, { sign: string; degree?: number }> = {
    sun: normalized.bigThree.sun,
    moon: normalized.bigThree.moon,
    asc: normalized.bigThree.asc,
  };

  const segments: Record<RoleKey, SegmentKey> = {
    sun: detectSegment(placements.sun.degree),
    moon: detectSegment(placements.moon.degree),
    asc: detectSegment(placements.asc.degree),
  };

  const roles: RoleKey[] = ['sun', 'moon', 'asc'];
  for (let i = 0; i < roles.length; i += 1) {
    const role = roles[i];
    const signKey = toSignKey(placements[role].sign);
    const segment = segments[role];
    applyInfluence(signInfluence[signKey], metrics, roleContributions[role]);
    applyInfluence(signSegmentInfluence[signKey]?.[segment], metrics, roleContributions[role]);
  }

  const clamped = cloneZeroMetrics();
  for (let i = 0; i < keys.length; i += 1) {
    const metric = keys[i];
    clamped[metric] = clampMetric(metrics[metric]);
  }

  return {
    metrics: clamped,
    segments,
    roleContributions,
  };
}

function sortMetrics(metrics: MetricMap, descending: boolean): MetricKey[] {
  return [...METRIC_KEYS].sort((a, b) => {
    const diff = descending ? metrics[b] - metrics[a] : metrics[a] - metrics[b];
    if (diff !== 0) {
      return diff;
    }
    return a.localeCompare(b);
  });
}

function topMetrics(metrics: MetricMap, count: number): MetricKey[] {
  return sortMetrics(metrics, true).slice(0, count);
}

function lowMetrics(metrics: MetricMap, count: number): MetricKey[] {
  return sortMetrics(metrics, false).slice(0, count);
}

function topRoleMetrics(roleMetrics: MutableMetricMap, count: number): MetricKey[] {
  return [...METRIC_KEYS]
    .sort((a, b) => {
      const diff = roleMetrics[b] - roleMetrics[a];
      if (diff !== 0) {
        return diff;
      }
      return a.localeCompare(b);
    })
    .slice(0, count);
}

export function pickArchetype(metrics: MetricMap): ArchetypeKey {
  let best: ArchetypeKey = ARCHETYPE_KEYS[0];
  let bestScore = Number.NEGATIVE_INFINITY;

  for (let i = 0; i < ARCHETYPE_KEYS.length; i += 1) {
    const archetype = ARCHETYPE_KEYS[i];
    const weights = archetypeWeights[archetype];
    let score = 0;
    const entries = Object.entries(weights) as Array<[MetricKey, number]>;
    for (let j = 0; j < entries.length; j += 1) {
      const [metric, weight] = entries[j];
      score += metrics[metric] * weight;
    }
    if (score > bestScore) {
      best = archetype;
      bestScore = score;
    }
  }

  return best;
}

export function detectTensions(metrics: MetricMap): DetectedTension[] {
  const scored = tensionMetricPairs.map((pair) => {
    const leftValue = metrics[pair.left];
    const rightValue = metrics[pair.right];
    return {
      key: pair.key,
      leftMetric: pair.left,
      rightMetric: pair.right,
      leftValue,
      rightValue,
      intensity: Math.abs(leftValue - rightValue),
      dominantSide: leftValue >= rightValue ? ('left' as const) : ('right' as const),
    };
  });

  scored.sort((a, b) => b.intensity - a.intensity);
  const strongCount = scored.filter((item) => item.intensity >= 16).length;
  const pickCount = Math.max(2, Math.min(4, strongCount >= 4 ? 4 : strongCount >= 3 ? 3 : 2));
  return scored.slice(0, pickCount);
}

function pickPack(locale: ContentPackLocale) {
  return locale === 'pl' ? plProfileNarrativePack : enProfileNarrativePack;
}

function metricPairLabel(
  metrics: MetricMap,
  a: MetricKey,
  b: MetricKey,
  pack: ReturnType<typeof pickPack>
): string {
  return metrics[a] >= metrics[b] ? pack.metricNames[a] : pack.metricNames[b];
}

function section(id: NarrativeSectionKey, title: string, paragraphs: string[]): NarrativeSection {
  return {
    id,
    title,
    paragraphs: paragraphs.filter((item) => item.trim().length > 0).slice(0, 5),
  };
}

function metricLine(metric: MetricKey, metrics: MetricMap, pack: ReturnType<typeof pickPack>): string {
  return `${pack.metricNames[metric]} (${metrics[metric]}/100)`;
}

function topMetricsLine(metricKeys: MetricKey[], metrics: MetricMap, pack: ReturnType<typeof pickPack>): string {
  return metricKeys.map((metric) => metricLine(metric, metrics, pack)).join(', ');
}

function buildDominantEnergySignal(normalized: NormalizedAstroV2): DominantEnergySignal {
  const element = normalized.dominantElement;
  const modality = normalized.dominantModality;
  const label = [element, modality].filter(Boolean).join(' / ') || 'mixed';
  return { element, modality, label };
}

export function buildBirthcodeSignals(normalized: NormalizedAstroV2): BirthcodeSignals {
  const { metrics, segments } = calcMetrics(normalized);
  const archetype = pickArchetype(metrics);
  const tensions = detectTensions(metrics);

  return {
    bigThree: {
      sun: { ...normalized.bigThree.sun, segment: segments.sun },
      moon: { ...normalized.bigThree.moon, segment: segments.moon },
      asc: { ...normalized.bigThree.asc, segment: segments.asc },
    },
    metrics,
    archetype,
    tensions,
    dominantEnergy: buildDominantEnergySignal(normalized),
    priorities: {
      tensions: tensions.map((item) => item.key),
      archetype,
      metrics: topMetrics(metrics, 3),
    },
  };
}

export function buildNarrative(
  normalized: NormalizedAstroV2,
  locale: ContentPackLocale = 'en'
): {
  metrics: MetricMap;
  segments: Record<RoleKey, SegmentKey>;
  archetype: ArchetypeKey;
  tensions: DetectedTension[];
  narrative: NarrativeResult;
} {
  const pack = pickPack(locale);
  const { metrics, segments, roleContributions } = calcMetrics(normalized);
  const archetype = pickArchetype(metrics);
  const tensions = detectTensions(metrics);

  const top3 = topMetrics(metrics, 3);
  const low2 = lowMetrics(metrics, 2);
  const sunTop = topRoleMetrics(roleContributions.sun, 2);
  const moonTop = topRoleMetrics(roleContributions.moon, 2);
  const ascTop = topRoleMetrics(roleContributions.asc, 2);

  const firstTension = tensions[0];
  const secondTension = tensions[1] ?? tensions[0];
  const firstTensionText = pack.tensions[firstTension.key];
  const secondTensionText = pack.tensions[secondTension.key];
  const archetypePack = pack.archetypes[archetype];

  const narrative: NarrativeResult = {
    overview: section('overview', pack.sectionTitles.overview, [
      `${archetypePack.headline}. ${archetypePack.gift}.`,
      `${pack.overviewIntegration} ${topMetricsLine(top3, metrics, pack)}.`,
      `${firstTensionText.bridge} ${pack.tensionPrompt} ${metricPairLabel(metrics, firstTension.leftMetric, firstTension.rightMetric, pack)}.`,
    ]),
    sun: section('sun', pack.sectionTitles.sun, [
      `${pack.roleOpeners.sun} ${pack.segmentTone.sun[segments.sun]}.`,
      `${pack.roleMetricBridge} ${topMetricsLine(sunTop, metrics, pack)}.`,
      `${pack.roleSynthesis.sun}`,
    ]),
    moon: section('moon', pack.sectionTitles.moon, [
      `${pack.roleOpeners.moon} ${pack.segmentTone.moon[segments.moon]}.`,
      `${pack.roleMetricBridge} ${topMetricsLine(moonTop, metrics, pack)}.`,
      `${pack.roleSynthesis.moon}`,
    ]),
    asc: section('asc', pack.sectionTitles.asc, [
      `${pack.roleOpeners.asc} ${pack.segmentTone.asc[segments.asc]}.`,
      `${pack.roleMetricBridge} ${topMetricsLine(ascTop, metrics, pack)}.`,
      `${pack.roleSynthesis.asc}`,
    ]),
    decisions: section('decisions', pack.sectionTitles.decisions, [
      `${pack.decisionsFrame} ${metricLine('analytical_order', metrics, pack)} + ${metricLine('risk_orientation', metrics, pack)}.`,
      `${pack.decisionsSecond} ${metricLine('control_need', metrics, pack)} + ${metricLine('adaptability', metrics, pack)}.`,
      `${pack.ascImpactPrefix} ${pack.segmentTone.asc[segments.asc]}.`,
    ]),
    genius: section('genius', pack.sectionTitles.genius, [
      `${pack.geniusFrame} ${topMetricsLine(top3, metrics, pack)}.`,
      `${archetypePack.gift} ${pack.geniusExecution}`,
    ]),
    stress: section('stress', pack.sectionTitles.stress, [
      `${pack.stressFrame} ${topMetricsLine(low2, metrics, pack)}.`,
      `${firstTensionText.bridge} ${pack.stressBridge}`,
      `${secondTensionText.bridge} ${pack.stressRecovery}`,
    ]),
    leadership: section('leadership', pack.sectionTitles.leadership, [
      `${pack.leadershipFrame} ${metricLine('social_expression', metrics, pack)} + ${metricLine('connection_need', metrics, pack)}.`,
      `${pack.leadershipExecution} ${metricLine('persistence_drive', metrics, pack)} + ${metricLine('adaptability', metrics, pack)}.`,
      `${pack.ascImpactPrefix} ${pack.segmentTone.asc[segments.asc]}.`,
    ]),
    recommendations: section('recommendations', pack.sectionTitles.recommendations, [
      `${pack.recommendationOpen} ${pack.metricNames[low2[0]]}.`,
      `${pack.recommendationMiddle} ${pack.metricNames[low2[1]]}.`,
      `${pack.recommendationClose} ${firstTensionText.bridge}.`,
    ]),
  };

  return {
    metrics,
    segments,
    archetype,
    tensions,
    narrative,
  };
}
