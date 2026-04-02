import { loadPacks } from '@/lib/content-engine/loadPacks';
import type { ChartDataSwiss, MatchBreakdownItem, SupportedLang } from '@/lib/content-engine/contracts';
import { zodiacElement, zodiacModality } from '@/lib/i18n/zodiac';

type AxisId = MatchBreakdownItem['id'];

const WEIGHTS: Record<AxisId, number> = {
  sun_sun: 25,
  moon_moon: 35,
  moon_sun: 25,
  asc_asc: 15,
};

const ELEMENT_SCORE: Record<string, Record<string, number>> = {
  Fire: { Fire: 0.85, Earth: 0.45, Air: 0.9, Water: 0.55 },
  Earth: { Fire: 0.45, Earth: 0.85, Air: 0.5, Water: 0.9 },
  Air: { Fire: 0.9, Earth: 0.5, Air: 0.82, Water: 0.55 },
  Water: { Fire: 0.55, Earth: 0.9, Air: 0.55, Water: 0.85 },
};

const MODALITY_SCORE: Record<string, Record<string, number>> = {
  Cardinal: { Cardinal: 0.72, Fixed: 0.58, Mutable: 0.66 },
  Fixed: { Cardinal: 0.58, Fixed: 0.7, Mutable: 0.5 },
  Mutable: { Cardinal: 0.66, Fixed: 0.5, Mutable: 0.75 },
};

function axisRatio(signA: string, signB: string): number {
  const elementA = zodiacElement(signA);
  const elementB = zodiacElement(signB);
  const modalityA = zodiacModality(signA);
  const modalityB = zodiacModality(signB);
  const elementRatio = ELEMENT_SCORE[elementA]?.[elementB] ?? 0.5;
  const modalityRatio = MODALITY_SCORE[modalityA]?.[modalityB] ?? 0.5;
  return 0.65 * elementRatio + 0.35 * modalityRatio;
}

function reasonKey(ratio: number): 'strong' | 'medium' | 'low' {
  if (ratio >= 0.75) return 'strong';
  if (ratio >= 0.55) return 'medium';
  return 'low';
}

export function scoreMatch(input: {
  lang: SupportedLang;
  profileA: ChartDataSwiss;
  profileB: ChartDataSwiss;
}): { score100: number; breakdown: MatchBreakdownItem[] } {
  const packs = loadPacks(input.lang);
  const axes: Array<{ id: AxisId; a: string; b: string }> = [
    { id: 'sun_sun', a: input.profileA.sun.sign, b: input.profileB.sun.sign },
    { id: 'moon_moon', a: input.profileA.moon.sign, b: input.profileB.moon.sign },
    { id: 'moon_sun', a: input.profileA.moon.sign, b: input.profileB.sun.sign },
    { id: 'asc_asc', a: input.profileA.asc.sign, b: input.profileB.asc.sign },
  ];

  const breakdown = axes.map((axis) => {
    const ratio = axisRatio(axis.a, axis.b);
    const maxPoints = WEIGHTS[axis.id];
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
