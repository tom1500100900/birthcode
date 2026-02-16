import { buildActs } from '@/lib/acts/actsBuilder';
import { deriveBalancesFromPlacements } from '@/lib/astro/balance';
import { buildInsights } from '@/lib/insights/insightsBuilder';
import { buildProfile } from '@/lib/profile/profileBuilder';
import { deriveProfileContextFromChart } from '@/src/lib/engine/derive';
import { useLocaleStore } from '@/store/useLocaleStore';
import { AstroChart, AstroResult, BirthInput } from '@/types/astro';

function fallbackBirthInput(): BirthInput {
  return {
    dateISO: '2000-01-01',
    timeHHmm: '12:00',
    placeName: 'Unknown',
    timezone: 'UTC',
  };
}

export function buildAstroResultFromChart(chart: AstroChart, input?: BirthInput): AstroResult {
  const locale = useLocaleStore.getState().language;
  const safePlanets = Array.isArray(chart.planets) ? chart.planets : [];
  const safeAspects = Array.isArray(chart.aspects) ? chart.aspects : [];
  const enrichedChart: AstroChart = {
    ...chart,
    planets: safePlanets,
    aspects: safeAspects,
    ...deriveBalancesFromPlacements([chart.sun, chart.moon, ...safePlanets]),
  };

  const context = deriveProfileContextFromChart(input ?? fallbackBirthInput(), enrichedChart);
  const finalContext = {
    ...context,
    aspects: enrichedChart.aspects,
  };

  const profile = buildProfile(finalContext, enrichedChart);
  const insights = buildInsights(finalContext, enrichedChart, profile, locale);
  const acts = buildActs(finalContext, enrichedChart, profile, locale);

  return {
    chart: enrichedChart,
    profile,
    insights,
    acts,
    context: finalContext,
    contentLocale: locale,
  };
}
