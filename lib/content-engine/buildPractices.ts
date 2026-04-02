import type { PracticeCard, PracticesBuildInput } from '@/lib/content-engine/contracts';
import { loadPacks } from '@/lib/content-engine/loadPacks';
import type { MetricKey } from '@/lib/content-engine/psychoNarrative';
import type { PracticeTemplate } from '@/lib/content-packs/pl/practices/practices';

function relevanceScore(
  card: { metricFocus: MetricKey[]; tensionFocus: string[] },
  metrics: Record<MetricKey, number>,
  tensionKeys: Set<string>
): number {
  const metricPart = card.metricFocus.reduce((sum, metricKey) => sum + metrics[metricKey], 0) / Math.max(card.metricFocus.length, 1);
  const tensionPart = card.tensionFocus.reduce((sum, key) => sum + (tensionKeys.has(key) ? 12 : 0), 0);
  return metricPart + tensionPart;
}

export function buildPractices(input: PracticesBuildInput): PracticeCard[] {
  const packs = loadPacks(input.lang);
  const tensionKeys = new Set(input.tensions.map((item) => item.key));
  type ScoredPractice = PracticeTemplate & { score: number };
  const scored = packs.practices.list
    .map((item: PracticeTemplate): ScoredPractice => ({
      ...item,
      score: relevanceScore(item, input.metrics, tensionKeys),
    }))
    .sort((a: ScoredPractice, b: ScoredPractice) => b.score - a.score || a.id.localeCompare(b.id));

  const selected = scored;

  return selected.map((item: ScoredPractice): PracticeCard => ({
    id: item.id,
    category: item.category,
    title: item.title,
    durationMin: item.durationMin,
    steps: item.steps,
    expectedOutcome: item.expectedOutcome,
    basedOn: {
      metrics: item.metricFocus,
      tensions: item.tensionFocus,
    },
  }));
}
