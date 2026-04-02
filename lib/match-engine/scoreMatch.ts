import { loadPacks } from '@/lib/content-engine/loadPacks';
import type { ChartDataSwiss, MatchBreakdownItem, SupportedLang } from '@/lib/content-engine/contracts';
import type { BirthcodeSignals, MetricKey, TensionKey } from '@/lib/content-engine/psychoNarrative';
import { zodiacElement, zodiacModality } from '@/lib/i18n/zodiac';

type AxisId = MatchBreakdownItem['id'];

// ── WEIGHTS ─────────────────────────────────────────────────────────────────────────────
// Axis weights (sum = 100)
const AXIS_WEIGHTS: Record<AxisId, number> = {
  sun_sun: 20,    // Core identity alignment
  moon_moon: 35,  // Emotional world alignment (most important for long-term)
  moon_sun: 25,   // Emotional depth meets identity
  asc_asc: 20,    // Social interface compatibility
};

// Signal layer weights (how much each signal type contributes to axis score)
const SIGNAL_WEIGHT = {
  element: 0.35,    // Elemental compatibility (Fire/Earth/Air/Water)
  modality: 0.20,   // Modality compatibility (Cardinal/Fixed/Mutable)
  metrics: 0.30,    // Metric profile similarity (BirthcodeSignals)
  tensions: 0.15,   // Shared tension patterns
};

// ── ELEMENTAL COMPATIBILITY ────────────────────────────────────────────────────────────
const ELEMENT_SCORE: Record<string, Record<string, number>> = {
  Fire:  { Fire: 0.85, Earth: 0.45, Air: 0.90, Water: 0.55 },
  Earth: { Fire: 0.45, Earth: 0.85, Air: 0.50, Water: 0.90 },
  Air:   { Fire: 0.90, Earth: 0.50, Air: 0.82, Water: 0.55 },
  Water: { Fire: 0.55, Earth: 0.90, Air: 0.55, Water: 0.85 },
};

const MODALITY_SCORE: Record<string, Record<string, number>> = {
  Cardinal: { Cardinal: 0.72, Fixed: 0.58, Mutable: 0.66 },
  Fixed:    { Cardinal: 0.58, Fixed: 0.70, Mutable: 0.50 },
  Mutable:  { Cardinal: 0.66, Fixed: 0.50, Mutable: 0.75 },
};

// ── METRIC SIMILARITY ───────────────────────────────────────────────────────────────────
// Metrics most relevant to each axis
const AXIS_METRIC_FOCUS: Record<AxisId, MetricKey[]> = {
  sun_sun:   ['curiosity_openness', 'analytical_order', 'risk_orientation', 'persistence_drive'],
  moon_moon: ['emotional_sensitivity', 'connection_need', 'intensity_depth', 'control_need'],
  moon_sun:  ['emotional_sensitivity', 'intensity_depth', 'connection_need', 'social_expression'],
  asc_asc:   ['social_expression', 'adaptability', 'analytical_order', 'risk_orientation'],
};

/**
 * Compute metric similarity for a given axis.
 * Uses the absolute difference between metric values, normalized to [0, 1].
 * Two profiles with identical metrics score 1.0; maximum divergence scores 0.0.
 * A moderate difference (complementary) scores around 0.6-0.7.
 */
function metricSimilarity(
  metricsA: BirthcodeSignals['metrics'],
  metricsB: BirthcodeSignals['metrics'],
  axisId: AxisId
): number {
  const focusKeys = AXIS_METRIC_FOCUS[axisId];
  if (!metricsA || !metricsB) return 0.5;

  let totalScore = 0;
  for (const key of focusKeys) {
    const a = metricsA[key] ?? 50;
    const b = metricsB[key] ?? 50;
    const diff = Math.abs(a - b);
    // diff=0 → 1.0, diff=100 → 0.0; sweet spot at diff=20-30 → 0.7-0.8
    const similarity = 1 - diff / 100;
    totalScore += similarity;
  }
  return totalScore / focusKeys.length;
}

// ── TENSION OVERLAP ────────────────────────────────────────────────────────────────────
/**
 * Shared tensions create mutual understanding (both feel the same push-pull).
 * Opposing tensions create friction (one person's resolution is the other's problem).
 */
const TENSION_OPPOSITES: Partial<Record<TensionKey, TensionKey>> = {
  exploration_vs_control: 'perfection_vs_progress',
  analysis_vs_speed: 'perfection_vs_progress',
  independence_vs_connection: 'intensity_vs_lightness',
};

function tensionOverlap(
  tensionsA: BirthcodeSignals['tensions'],
  tensionsB: BirthcodeSignals['tensions']
): number {
  if (!tensionsA?.length || !tensionsB?.length) return 0.5;

  const keysA = new Set(tensionsA.map((t) => t.key));
  const keysB = new Set(tensionsB.map((t) => t.key));

  let score = 0.5; // neutral baseline
  for (const key of keysA) {
    if (keysB.has(key)) {
      score += 0.15; // shared tension: mutual understanding
    }
    const opposite = TENSION_OPPOSITES[key];
    if (opposite && keysB.has(opposite)) {
      score -= 0.10; // opposing tension: friction
    }
  }
  return Math.max(0, Math.min(1, score));
}

// ── AXIS RATIO ─────────────────────────────────────────────────────────────────────────────
function computeAxisRatio(
  signA: string,
  signB: string,
  axisId: AxisId,
  signalsA?: BirthcodeSignals,
  signalsB?: BirthcodeSignals
): number {
  const elementA = zodiacElement(signA);
  const elementB = zodiacElement(signB);
  const modalityA = zodiacModality(signA);
  const modalityB = zodiacModality(signB);

  const elementRatio = ELEMENT_SCORE[elementA]?.[elementB] ?? 0.5;
  const modalityRatio = MODALITY_SCORE[modalityA]?.[modalityB] ?? 0.5;

  // If BirthcodeSignals are available, use signal-enhanced scoring
  if (signalsA && signalsB) {
    const metricRatio = metricSimilarity(signalsA.metrics, signalsB.metrics, axisId);
    const tensionRatio = tensionOverlap(signalsA.tensions, signalsB.tensions);
    return (
      SIGNAL_WEIGHT.element  * elementRatio +
      SIGNAL_WEIGHT.modality * modalityRatio +
      SIGNAL_WEIGHT.metrics  * metricRatio +
      SIGNAL_WEIGHT.tensions * tensionRatio
    );
  }

  // Fallback: element + modality only
  return 0.65 * elementRatio + 0.35 * modalityRatio;
}

function reasonKey(ratio: number): 'strong' | 'medium' | 'low' {
  if (ratio >= 0.72) return 'strong';
  if (ratio >= 0.52) return 'medium';
  return 'low';
}

// ── MAIN EXPORT ────────────────────────────────────────────────────────────────────────────
export function scoreMatch(input: {
  lang: SupportedLang;
  profileA: ChartDataSwiss;
  profileB: ChartDataSwiss;
  signalsA?: BirthcodeSignals; // optional: if available, enables signal-enhanced scoring
  signalsB?: BirthcodeSignals;
}): { score100: number; breakdown: MatchBreakdownItem[] } {
  const packs = loadPacks(input.lang);

  const axes: Array<{ id: AxisId; a: string; b: string }> = [
    { id: 'sun_sun',   a: input.profileA.sun.sign,  b: input.profileB.sun.sign },
    { id: 'moon_moon', a: input.profileA.moon.sign, b: input.profileB.moon.sign },
    { id: 'moon_sun',  a: input.profileA.moon.sign, b: input.profileB.sun.sign },
    { id: 'asc_asc',   a: input.profileA.asc.sign,  b: input.profileB.asc.sign },
  ];

  const breakdown = axes.map((axis) => {
    const ratio = computeAxisRatio(
      axis.a,
      axis.b,
      axis.id,
      input.signalsA,
      input.signalsB
    );
    const maxPoints = AXIS_WEIGHTS[axis.id];
    const points = Math.round(maxPoints * ratio);
    return {
      id: axis.id,
      label: packs.match.scoring.breakdownLabels[axis.id],
      weight: maxPoints,
      points,
      maxPoints,
      reason: packs.match.scoring.reasonTemplates[reasonKey(ratio)],
    };
  });

  const score100 = breakdown.reduce((sum, item) => sum + item.points, 0);
  return { score100, breakdown };
}
