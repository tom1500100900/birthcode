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

  const n = packs.match.narrative;

  // Build sections — gracefully skip optional sections if not present in pack
  const sections: MatchReport['sections'] = [
    {
      id: 'overall',
      title: n.overallTitle,
      paragraphs: [replaceTokens(n.overallBody)],
    },
    {
      id: 'dynamic',
      title: n.dynamicTitle,
      paragraphs: [replaceTokens(n.dynamicBody)],
    },
  ];

  // Optional premium sections (strengths, risks, mitigation)
  if ('strengthsTitle' in n && 'strengthsBody' in n) {
    sections.push({
      id: 'strengths',
      title: (n as { strengthsTitle: string }).strengthsTitle,
      paragraphs: [replaceTokens((n as { strengthsBody: string }).strengthsBody)],
    });
  }

  if ('risksTitle' in n && 'risksBody' in n) {
    sections.push({
      id: 'risks',
      title: (n as { risksTitle: string }).risksTitle,
      paragraphs: [replaceTokens((n as { risksBody: string }).risksBody)],
    });
  }

  if ('mitigationTitle' in n && 'mitigationBody' in n) {
    sections.push({
      id: 'mitigation',
      title: (n as { mitigationTitle: string }).mitigationTitle,
      paragraphs: [replaceTokens((n as { mitigationBody: string }).mitigationBody)],
    });
  }

  sections.push({
    id: 'growth',
    title: n.growthTitle,
    paragraphs: [replaceTokens(n.growthBody)],
  });

  return {
    pairLabel,
    score100: input.matchScore,
    breakdown: input.breakdownMeta,
    sections,
  };
}
