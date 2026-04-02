import { buildNarrative, NARRATIVE_SECTION_KEYS } from '@/lib/content-engine/psychoNarrative';
import { ContentPackLocale, InterpretationBlock, NormalizedAstroV2, ProfileInterpretation } from '@/lib/content-engine/types';

function toBlock(id: string, title: string, paragraphs: string[]): InterpretationBlock {
  return {
    id,
    title,
    body: paragraphs.join('\n\n'),
  };
}

export function interpretAstro(normalized: NormalizedAstroV2, locale: ContentPackLocale = 'en'): ProfileInterpretation {
  const built = buildNarrative(normalized, locale);
  const narrative = built.narrative;

  return {
    narrative,
    core: [
      toBlock('overview', narrative.overview.title, narrative.overview.paragraphs),
      toBlock('sun', narrative.sun.title, narrative.sun.paragraphs),
      toBlock('moon', narrative.moon.title, narrative.moon.paragraphs),
      toBlock('asc', narrative.asc.title, narrative.asc.paragraphs),
    ],
    strengths: [
      toBlock('genius', narrative.genius.title, narrative.genius.paragraphs),
      toBlock('leadership', narrative.leadership.title, narrative.leadership.paragraphs),
    ],
    risks: [toBlock('stress', narrative.stress.title, narrative.stress.paragraphs)],
    relationships: [],
    career: [toBlock('decisions', narrative.decisions.title, narrative.decisions.paragraphs)],
    recommendations: [toBlock('recommendations', narrative.recommendations.title, narrative.recommendations.paragraphs)],
  };
}

export { NARRATIVE_SECTION_KEYS };
