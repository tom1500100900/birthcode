import { formatDegreeText, formatPlacementLabel } from '@/lib/astro/labels';
import { ActItem, AstroResult, InsightItem, PlanetPlacement } from '@/types/astro';

function ascendantPlacement(result: AstroResult): PlanetPlacement {
  return {
    name: 'Ascendant',
    sign: result.chart.ascendant.sign,
    degree: result.chart.ascendant.degree,
  };
}

export function buildBigThreeText(result: AstroResult): string {
  const asc = ascendantPlacement(result);
  return [
    'Big Three',
    '',
    `Sun: ${formatPlacementLabel(result.chart.sun)} (${formatDegreeText(result.chart.sun.degree)})`,
    `Moon: ${formatPlacementLabel(result.chart.moon)} (${formatDegreeText(result.chart.moon.degree)})`,
    `Ascendant: ${formatPlacementLabel(asc)} (${formatDegreeText(asc.degree)})`,
  ].join('\n');
}

export function buildTraitText(title: string, description: string): string {
  return [`Trait: ${title}`, '', description].join('\n');
}

export function buildSimpleListText(title: string, values: string[]): string {
  return [title, '', ...values.map((value) => `- ${value}`)].join('\n');
}

export function buildDominantMeaningText(elementLines: string[], modalityLines: string[]): string {
  return [
    'What this means for you',
    '',
    'Element meaning:',
    ...elementLines.map((line) => `- ${line}`),
    '',
    'Modality meaning:',
    ...modalityLines.map((line) => `- ${line}`),
  ].join('\n');
}

export function buildInsightCardText(item: InsightItem): string {
  return [
    `Insight: ${item.title}`,
    '',
    'Why it matters:',
    item.whyItMatters,
    '',
    'Reflection questions:',
    ...item.questions.map((question, index) => `${index + 1}. ${question}`),
  ].join('\n');
}

export function buildPracticeCardText(item: ActItem): string {
  return [
    `Practice: ${item.title}`,
    '',
    `Duration: ${item.durationMinutes} min`,
    '',
    'Steps:',
    ...item.steps.map((step, index) => `${index + 1}. ${step}`),
    '',
    `Expected outcome: ${item.expectedOutcome}`,
  ].join('\n');
}
