import { formatDegreeText, formatPlacementLabel } from '@/lib/astro/labels';
import { normalizeBirthInput } from '@/lib/astro/input';
import { PersonProfile, PlanetPlacement } from '@/types/astro';

function makeAscendantPlacement(profile: PersonProfile): PlanetPlacement {
  const chart = profile.astroResult?.chart;
  return {
    name: 'Ascendant',
    sign: chart?.ascendant.sign ?? 'Unknown',
    degree: chart?.ascendant.degree ?? 0,
  };
}

export function buildSummaryReport(profile: PersonProfile): string {
  const result = profile.astroResult;
  const input = normalizeBirthInput(profile.birthInput);
  const lines: string[] = [];

  lines.push('# Birthcode Summary');
  lines.push('');
  lines.push(`Profile: ${profile.label}`);
  lines.push(`Birth: ${input.dateISO} ${input.timeHHmm} (${input.timezone ?? 'UTC'})`);
  lines.push(`Place: ${input.placeName}`);

  if (!result) {
    lines.push('');
    lines.push('No generated chart data yet.');
    return lines.join('\n');
  }

  const ascendant = makeAscendantPlacement(profile);

  lines.push('');
  lines.push('Big Three:');
  lines.push(`- Sun: ${formatPlacementLabel(result.chart.sun)} (${formatDegreeText(result.chart.sun.degree)})`);
  lines.push(`- Moon: ${formatPlacementLabel(result.chart.moon)} (${formatDegreeText(result.chart.moon.degree)})`);
  lines.push(`- Ascendant: ${formatPlacementLabel(ascendant)} (${formatDegreeText(ascendant.degree)})`);
  lines.push('');
  lines.push('Dominants:');
  lines.push(`- Element: ${result.chart.dominantElement}`);
  lines.push(`- Modality: ${result.chart.dominantModality}`);
  lines.push('');
  lines.push('Top Traits:');
  result.profile.traits.slice(0, 5).forEach((trait) => {
    lines.push(`- ${trait.title}: ${trait.description}`);
  });

  return lines.join('\n');
}

export function buildFullReport(profile: PersonProfile): string {
  const result = profile.astroResult;
  const lines: string[] = [];

  lines.push('# Birthcode Report');
  lines.push('');
  lines.push('This report is a reflective astrology snapshot generated locally in your app.');
  lines.push('Use it as a prompt for self-observation, not as a deterministic prediction.');
  lines.push('');
  lines.push(buildSummaryReport(profile));

  if (!result) {
    return lines.join('\n');
  }

  lines.push('');
  lines.push('Strengths:');
  result.profile.strengths.forEach((item) => lines.push(`- ${item}`));
  lines.push('');
  lines.push('Risks:');
  result.profile.risks.forEach((item) => lines.push(`- ${item}`));
  lines.push('');
  lines.push('Recommendations:');
  result.profile.recommendations.forEach((item) => lines.push(`- ${item}`));
  lines.push('');
  lines.push('Top Aspects:');
  result.chart.aspects.slice(0, 5).forEach((aspect) => {
    lines.push(`- ${aspect.from} to ${aspect.to}: ${aspect.type} (orb ${aspect.orb.toFixed(2)})`);
  });

  return lines.join('\n');
}
