import type { AstroChart } from '@/types/astro';
import type { ChartDataSwiss } from '@/lib/content-engine/contracts';
import type { NormalizedAstroV2 } from '@/lib/content-engine/types';

export function toChartDataSwiss(chart: AstroChart): ChartDataSwiss {
  return {
    sun: { sign: chart.sun.sign, degree: chart.sun.degree },
    moon: { sign: chart.moon.sign, degree: chart.moon.degree },
    asc: { sign: chart.ascendant.sign, degree: chart.ascendant.degree },
  };
}

export function toNormalizedAstroV2FromChart(chart: AstroChart): NormalizedAstroV2 {
  return {
    bigThree: {
      sun: { sign: chart.sun.sign, degree: chart.sun.degree },
      moon: { sign: chart.moon.sign, degree: chart.moon.degree },
      asc: { sign: chart.ascendant.sign, degree: chart.ascendant.degree },
    },
    dominantElement: chart.dominantElement,
    dominantModality: chart.dominantModality,
    aspects: chart.aspects?.map((aspect) => ({
      from: aspect.from,
      to: aspect.to,
      type: aspect.type,
      orb: aspect.orb,
    })),
  };
}
