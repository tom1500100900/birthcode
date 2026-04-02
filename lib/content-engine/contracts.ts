import type { BirthcodeSignals, MetricKey } from '@/lib/content-engine/psychoNarrative';
import type { InsightCategory } from '@/types/astro';

export type SupportedLang = 'pl' | 'en';

export type ChartDataSwiss = {
  sun: { sign: string; degree?: number };
  moon: { sign: string; degree?: number };
  asc: { sign: string; degree?: number };
};

export type BirthcodeSection = {
  id: string;
  title: string;
  paragraphs: string[];
};

export type BirthcodeReport = {
  header: {
    archetype: string;
    tensions: string[];
    metrics: Array<{ key: MetricKey; value: number }>;
  };
  headerDefinition?: string;
  signatureInsight: string;
  sections: BirthcodeSection[];
  debug?: {
    blockIds: Record<string, string[]>;
    generatorOrder: Array<'tensions' | 'archetype' | 'metrics'>;
    signals: {
      bigThree: BirthcodeSignals['bigThree'];
      tensions: BirthcodeSignals['tensions'];
      metrics: BirthcodeSignals['metrics'];
      archetype: BirthcodeSignals['archetype'];
      dominantEnergy: BirthcodeSignals['dominantEnergy'];
      priorities: BirthcodeSignals['priorities'];
    };
  };
};

export type PracticeCard = {
  id: string;
  category: InsightCategory;
  title: string;
  durationMin: number;
  steps: string[];
  expectedOutcome: string;
  basedOn: {
    metrics: MetricKey[];
    tensions: string[];
  };
};

export type MatchBreakdownItem = {
  id: 'sun_sun' | 'moon_moon' | 'moon_sun' | 'asc_asc';
  label: string;
  weight: number;
  points: number;
  maxPoints: number;
  reason: string;
};

export type MatchReportSection = {
  id: string;
  title: string;
  paragraphs: string[];
};

export type MatchReport = {
  pairLabel: string;
  score100: number;
  breakdown: MatchBreakdownItem[];
  sections: MatchReportSection[];
};

export type BirthcodeBuildInput = {
  lang: SupportedLang;
  signals: BirthcodeSignals;
};

export type PracticesBuildInput = {
  lang: SupportedLang;
  metrics: Record<MetricKey, number>;
  tensions: BirthcodeSignals['tensions'];
};
