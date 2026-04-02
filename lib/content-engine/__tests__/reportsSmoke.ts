import { buildBirthcodeReport } from '@/lib/content-engine/buildBirthcodeReport';
import { buildMatchReport } from '@/lib/content-engine/buildMatchReport';
import { detectSegment } from '@/lib/content-engine/psychoNarrative';
import { scoreMatch } from '@/lib/match-engine/scoreMatch';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`[reportsSmoke] ${message}`);
  }
}

const sampleA = {
  sun: { sign: 'Gemini', degree: 9.99 },
  moon: { sign: 'Cancer', degree: 10 },
  asc: { sign: 'Virgo', degree: 20 },
};

const sampleB = {
  sun: { sign: 'Aquarius', degree: 2.1 },
  moon: { sign: 'Libra', degree: 11.1 },
  asc: { sign: 'Aries', degree: 18.2 },
};

export function runReportsSmoke(): void {
  assert(detectSegment(9.99) === 'early', '9.99 should be early');
  assert(detectSegment(10) === 'mid', '10 should be mid');
  assert(detectSegment(19.99) === 'mid', '19.99 should be mid');
  assert(detectSegment(20) === 'late', '20 should be late');

  const birthA1 = buildBirthcodeReport({
    lang: 'pl',
    signals: {
      bigThree: {
        sun: { sign: sampleA.sun.sign, degree: sampleA.sun.degree, segment: 'early' },
        moon: { sign: sampleA.moon.sign, degree: sampleA.moon.degree, segment: 'mid' },
        asc: { sign: sampleA.asc.sign, degree: sampleA.asc.degree, segment: 'late' },
      },
      metrics: {
        curiosity_openness: 77,
        analytical_order: 63,
        emotional_sensitivity: 58,
        intensity_depth: 54,
        social_expression: 71,
        control_need: 52,
        adaptability: 68,
        persistence_drive: 61,
        risk_orientation: 56,
        connection_need: 60,
      },
      archetype: 'Curious Integrator',
      tensions: [
        {
          key: 'exploration_vs_control',
          leftMetric: 'curiosity_openness',
          rightMetric: 'control_need',
          leftValue: 77,
          rightValue: 52,
          intensity: 25,
          dominantSide: 'left',
        },
        {
          key: 'analysis_vs_speed',
          leftMetric: 'analytical_order',
          rightMetric: 'risk_orientation',
          leftValue: 63,
          rightValue: 56,
          intensity: 7,
          dominantSide: 'left',
        },
      ],
      dominantEnergy: {
        element: 'Air',
        modality: 'Mutable',
        label: 'Air / Mutable',
      },
      priorities: {
        tensions: ['exploration_vs_control', 'analysis_vs_speed'],
        archetype: 'Curious Integrator',
        metrics: ['curiosity_openness', 'social_expression', 'adaptability'],
      },
    },
  });
  const birthA2 = buildBirthcodeReport({
    lang: 'pl',
    signals: {
      bigThree: {
        sun: { sign: sampleA.sun.sign, degree: sampleA.sun.degree, segment: 'early' },
        moon: { sign: sampleA.moon.sign, degree: sampleA.moon.degree, segment: 'mid' },
        asc: { sign: sampleA.asc.sign, degree: sampleA.asc.degree, segment: 'late' },
      },
      metrics: {
        curiosity_openness: 77,
        analytical_order: 63,
        emotional_sensitivity: 58,
        intensity_depth: 54,
        social_expression: 71,
        control_need: 52,
        adaptability: 68,
        persistence_drive: 61,
        risk_orientation: 56,
        connection_need: 60,
      },
      archetype: 'Curious Integrator',
      tensions: [
        {
          key: 'exploration_vs_control',
          leftMetric: 'curiosity_openness',
          rightMetric: 'control_need',
          leftValue: 77,
          rightValue: 52,
          intensity: 25,
          dominantSide: 'left',
        },
        {
          key: 'analysis_vs_speed',
          leftMetric: 'analytical_order',
          rightMetric: 'risk_orientation',
          leftValue: 63,
          rightValue: 56,
          intensity: 7,
          dominantSide: 'left',
        },
      ],
      dominantEnergy: {
        element: 'Air',
        modality: 'Mutable',
        label: 'Air / Mutable',
      },
      priorities: {
        tensions: ['exploration_vs_control', 'analysis_vs_speed'],
        archetype: 'Curious Integrator',
        metrics: ['curiosity_openness', 'social_expression', 'adaptability'],
      },
    },
  });
  assert(JSON.stringify(birthA1) === JSON.stringify(birthA2), 'buildBirthcodeReport should be deterministic');

  const score = scoreMatch({ lang: 'pl', profileA: sampleA, profileB: sampleB });
  const match1 = buildMatchReport({
    lang: 'pl',
    profileA: sampleA,
    profileB: sampleB,
    matchScore: score.score100,
    breakdownMeta: score.breakdown,
    pairLabel: 'A x B',
  });
  const match2 = buildMatchReport({
    lang: 'pl',
    profileA: sampleA,
    profileB: sampleB,
    matchScore: score.score100,
    breakdownMeta: score.breakdown,
    pairLabel: 'A x B',
  });
  assert(JSON.stringify(match1) === JSON.stringify(match2), 'buildMatchReport should be deterministic');

  const fallbackNoCrash = buildMatchReport({
    lang: 'en',
    profileA: sampleA,
    profileB: sampleB,
    matchScore: score.score100,
    breakdownMeta: score.breakdown,
  });
  assert(fallbackNoCrash.sections.length > 0, 'fallback report should render sections');
}
