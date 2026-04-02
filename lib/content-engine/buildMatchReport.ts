import type { ChartDataSwiss, MatchReport, SupportedLang } from '@/lib/content-engine/contracts';
import { loadPacks } from '@/lib/content-engine/loadPacks';
import { zodiacLabel } from '@/lib/i18n/zodiac';

export function buildMatchReport(input: {
  lang: SupportedLang;
  profileA: ChartDataSwiss;
  profileB: ChartDataSwiss;
  matchScore: number;
  breakdownMeta: MatchReport['breakdown'];
  pairLabel?: string;
}): MatchReport {
  const packs = loadPacks(input.lang);
  const sorted = [...input.breakdownMeta].sort((a, b) => b.points - a.points);
  const bestAxis = sorted[0]?.label ?? packs.fallbackText;
  const weakAxis = sorted[sorted.length - 1]?.label ?? packs.fallbackText;

  const replaceTokens = (template: string) =>
    template
      .split('{{score}}').join(String(input.matchScore))
      .split('{{best_axis}}').join(bestAxis)
      .split('{{weak_axis}}').join(weakAxis);

  const pairLabel = input.pairLabel
    ?? `${zodiacLabel(input.profileA.sun.sign, input.lang)} + ${zodiacLabel(input.profileB.sun.sign, input.lang)}`;

  return {
    pairLabel,
    score100: input.matchScore,
    breakdown: input.breakdownMeta,
    sections: [
      {
        id: 'overall',
        title: packs.match.narrative.overallTitle,
        paragraphs: [replaceTokens(packs.match.narrative.overallBody)],
      },
      {
        id: 'dynamic',
        title: packs.match.narrative.dynamicTitle,
        paragraphs: [replaceTokens(packs.match.narrative.dynamicBody)],
      },
      {
        id: 'growth',
        title: packs.match.narrative.growthTitle,
        paragraphs: [replaceTokens(packs.match.narrative.growthBody)],
      },
    ],
  };
}
