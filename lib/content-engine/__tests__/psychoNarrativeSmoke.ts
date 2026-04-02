import { buildNarrative, calcMetrics, detectSegment } from '@/lib/content-engine/psychoNarrative';
import type { NormalizedAstroV2 } from '@/lib/content-engine/types';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`[psychoNarrativeSmoke] ${message}`);
  }
}

const baseInput: NormalizedAstroV2 = {
  bigThree: {
    sun: { sign: 'Gemini', degree: 7.2 },
    moon: { sign: 'Scorpio', degree: 14.1 },
    asc: { sign: 'Virgo', degree: 22.4 },
  },
};

function sectionParagraphCount(section: { paragraphs: string[] }): number {
  return section.paragraphs.filter((item) => item.trim().length > 0).length;
}

export function runPsychoNarrativeSmoke(): void {
  assert(detectSegment(0) === 'early', '0 should map to early');
  assert(detectSegment(9.99) === 'early', '9.99 should map to early');
  assert(detectSegment(10) === 'mid', '10 should map to mid');
  assert(detectSegment(19.99) === 'mid', '19.99 should map to mid');
  assert(detectSegment(20) === 'late', '20 should map to late');
  assert(detectSegment(undefined) === 'mid', 'missing degree should map to mid');

  const m1 = calcMetrics(baseInput);
  const m2 = calcMetrics(baseInput);
  assert(JSON.stringify(m1.metrics) === JSON.stringify(m2.metrics), 'calcMetrics must be deterministic');

  const narrative = buildNarrative(baseInput, 'en');
  const sections = Object.values(narrative.narrative);
  for (let i = 0; i < sections.length; i += 1) {
    assert(sectionParagraphCount(sections[i]) >= 2, `${sections[i].id} should have at least 2 paragraphs`);
  }

  const ascEarly = buildNarrative(
    {
      ...baseInput,
      bigThree: {
        ...baseInput.bigThree,
        asc: { sign: 'Virgo', degree: 4.5 },
      },
    },
    'en'
  );

  const ascLate = buildNarrative(
    {
      ...baseInput,
      bigThree: {
        ...baseInput.bigThree,
        asc: { sign: 'Virgo', degree: 24.5 },
      },
    },
    'en'
  );

  const changedSections = Object.keys(ascEarly.narrative).filter((key) => {
    const sectionKey = key as keyof typeof ascEarly.narrative;
    return (
      JSON.stringify(ascEarly.narrative[sectionKey].paragraphs)
      !== JSON.stringify(ascLate.narrative[sectionKey].paragraphs)
    );
  });
  assert(changedSections.length >= 2, 'ASC segment change should modify at least 2 narrative sections');
}
