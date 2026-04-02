import { loadPacks } from '@/lib/content-engine/loadPacks';
import { EN_TENSION_DESCRIPTIONS } from '@/lib/content-packs/en/birthcode/tensions';
import { PL_TENSION_DESCRIPTIONS } from '@/lib/content-packs/pl/birthcode/tensions';
import type { BirthcodeBuildInput, BirthcodeReport } from '@/lib/content-engine/contracts';
import type { MetricKey } from '@/lib/content-engine/psychoNarrative';
import { zodiacLabel, toCanonicalSign } from '@/lib/i18n/zodiac';

// ─── Humanized metric labels ──────────────────────────────────────────────────

const METRIC_LABELS_EN: Record<MetricKey, string> = {
  curiosity_openness: 'Curiosity & Openness',
  analytical_order: 'Analytical Order',
  emotional_sensitivity: 'Emotional Sensitivity',
  intensity_depth: 'Intensity & Depth',
  social_expression: 'Social Expression',
  control_need: 'Need for Control',
  adaptability: 'Adaptability',
  persistence_drive: 'Persistence Drive',
  risk_orientation: 'Risk Orientation',
  connection_need: 'Need for Connection',
};

const METRIC_LABELS_PL: Record<MetricKey, string> = {
  curiosity_openness: 'Ciekawość i otwartość',
  analytical_order: 'Porządek analityczny',
  emotional_sensitivity: 'Wrażliwość emocjonalna',
  intensity_depth: 'Intensywność i głębia',
  social_expression: 'Ekspresja społeczna',
  control_need: 'Potrzeba kontroli',
  adaptability: 'Adaptatywność',
  persistence_drive: 'Napęd wytrwałości',
  risk_orientation: 'Orientacja na ryzyko',
  connection_need: 'Potrzeba bliskości',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getMetricLabel(key: MetricKey, lang: string): string {
  return lang === 'pl' ? (METRIC_LABELS_PL[key] ?? key) : (METRIC_LABELS_EN[key] ?? key);
}

function topMetrics(metrics: Record<MetricKey, number>, count: number, descending = true): MetricKey[] {
  return (Object.keys(metrics) as MetricKey[])
    .sort((a, b) => (descending ? metrics[b] - metrics[a] : metrics[a] - metrics[b]) || a.localeCompare(b))
    .slice(0, count);
}

function tokenReplace(text: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce((acc, [key, value]) => acc.split(`{{${key}}}`).join(value), text);
}

// ─── Main builder ─────────────────────────────────────────────────────────────

export function buildBirthcodeReport(input: BirthcodeBuildInput): BirthcodeReport {
  const packs = loadPacks(input.lang);
  const { signals } = input;
  const lang = input.lang;

  const canonicalSun = toCanonicalSign(signals.bigThree.sun.sign);
  const canonicalMoon = toCanonicalSign(signals.bigThree.moon.sign);
  const canonicalAsc = toCanonicalSign(signals.bigThree.asc.sign);

  const top3 = topMetrics(signals.metrics, 3, true);
  const low2 = topMetrics(signals.metrics, 2, false);
  const t1 = signals.tensions[0];
  const fallbackText = packs.fallbackText;

  // Tension descriptions (full) for the tension section
  const tensionDescriptions = lang === 'pl' ? PL_TENSION_DESCRIPTIONS : EN_TENSION_DESCRIPTIONS;

  // Short tension label for inline use
  const tensionLabel = packs.birthcode.tensionSnippets[t1?.key ?? 'intensity_vs_lightness'] ?? fallbackText;

  // Token vars — metrics appear ONCE in who_you_are, nowhere else
  const vars: Record<string, string> = {
    sun_label: zodiacLabel(canonicalSun, lang),
    moon_label: zodiacLabel(canonicalMoon, lang),
    asc_label: zodiacLabel(canonicalAsc, lang),
    archetype: signals.archetype,
    top_metric_1: getMetricLabel(top3[0], lang),
    top_metric_2: getMetricLabel(top3[1], lang),
    top_metric_3: getMetricLabel(top3[2], lang),
    low_metric_1: getMetricLabel(low2[0], lang),
    low_metric_2: getMetricLabel(low2[1], lang),
    tension_1: tensionLabel,
    sun_segment_tone: packs.birthcode.segmentSnippet('sun', signals.bigThree.sun.segment ?? 'mid'),
    moon_segment_tone: packs.birthcode.segmentSnippet('moon', signals.bigThree.moon.segment ?? 'mid'),
    asc_segment_tone: packs.birthcode.segmentSnippet('asc', signals.bigThree.asc.segment ?? 'mid'),
  };

  // ─── Signature insight (archetype + tension description) ─────────────────
  const archetypeSignature = packs.birthcode.archetypeSignatures[signals.archetype] ?? fallbackText;
  const tensionFull = tensionDescriptions[t1?.key as keyof typeof tensionDescriptions] ?? tensionLabel;

  const signatureInsight = lang === 'pl'
    ? `${signals.archetype}: ${archetypeSignature}`
    : `${signals.archetype}: ${archetypeSignature}`;

  // ─── Build sections from templates ───────────────────────────────────────
  const sections = packs.birthcode.sectionOrder.map((id) => {
    const rawTitle = packs.birthcode.sectionTitles[id] ?? fallbackText;
    const title = tokenReplace(rawTitle, vars);

    const templates = packs.birthcode.sectionTemplates[id] ?? [fallbackText];

    // For the tension block: inject the full description as first paragraph
    let paragraphs: string[];
    if (id === 'tension' && t1) {
      const fullDesc = lang === 'pl'
        ? `⚡ ${tensionLabel}: ${tensionFull}`
        : `⚡ ${tensionLabel}: ${tensionFull}`;
      const rest = templates.slice(1).map((t) => tokenReplace(t, vars));
      paragraphs = [fullDesc, ...rest].filter((p) => p.trim().length > 0);
    } else {
      paragraphs = templates
        .map((t) => tokenReplace(t, vars))
        .filter((p) => p.trim().length > 0);
    }

    return {
      id,
      title,
      paragraphs: paragraphs.length > 0 ? paragraphs : [fallbackText],
    };
  });

  // ─── Header ──────────────────────────────────────────────────────────────
  return {
    header: {
      archetype: signals.archetype,
      tensions: [t1]
        .filter((item): item is NonNullable<typeof item> => Boolean(item))
        .map((item) => tensionLabel),
      metrics: top3.map((metric) => ({ key: metric, value: signals.metrics[metric] })),
    },
    headerDefinition: lang === 'pl'
      ? 'Birthcode to mapa Twojego wzorca działania. Nie etykieta — mechanizm.'
      : 'Birthcode is a map of your operating pattern. Not a label — a mechanism.',
    signatureInsight,
    sections,
    debug: {
      blockIds: {},
      generatorOrder: ['tensions', 'archetype', 'metrics'],
      signals: {
        bigThree: signals.bigThree,
        tensions: signals.tensions,
        metrics: signals.metrics,
        archetype: signals.archetype,
        dominantEnergy: signals.dominantEnergy,
        priorities: signals.priorities,
      },
    },
  };
}
