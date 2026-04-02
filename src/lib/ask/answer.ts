import { ChartCore, type AskCategory, type ZodiacElement, type ZodiacModality } from '@/src/types';

import { getFollowUpPrompts } from './questions';

export type GeneratedAnswer = {
  theme: string;
  paragraphs: [string, string];
  actions: [string, string, string];
  references: string[];
  followUps: string[];
};

const ELEMENT_LANGUAGE: Record<ZodiacElement, { gift: string; caution: string }> = {
  Fire: {
    gift: 'motivation, courage, and visible momentum',
    caution: 'rushing when urgency feels exciting',
  },
  Earth: {
    gift: 'structure, craft, and consistency',
    caution: 'staying in control long after adaptation is needed',
  },
  Air: {
    gift: 'ideas, social learning, and perspective',
    caution: 'overthinking instead of choosing',
  },
  Water: {
    gift: 'intuition, bonding, and emotional truth',
    caution: 'absorbing moods that are not yours to carry',
  },
};

const MODALITY_LANGUAGE: Record<ZodiacModality, { strength: string; friction: string }> = {
  Cardinal: {
    strength: 'starting quickly and leading movement',
    friction: 'starting faster than your support system can hold',
  },
  Fixed: {
    strength: 'depth, loyalty, and reliable follow-through',
    friction: 'holding firm when flexibility would reduce strain',
  },
  Mutable: {
    strength: 'adaptation, integration, and range',
    friction: 'anxiety from too many open loops',
  },
};

const CATEGORY_TONE: Record<AskCategory, string> = {
  Career: 'direct your energy where it compounds rather than where it only feels busy',
  Relationships: 'balance honesty with emotional safety so closeness can deepen',
  Money: 'pair practical structure with values-led decisions',
  Purpose: 'move from reflection into experiments that reveal meaning through action',
  Growth: 'practice stretch with steadiness, not pressure',
  Stress: 'lower nervous-system load before forcing solutions',
};

function harmonyScore(chartCore: ChartCore): number {
  let score = 0;
  if (chartCore.sunSign.element === chartCore.moonSign.element) score += 2;
  if (chartCore.sunSign.element === chartCore.risingSign.element) score += 2;
  if (chartCore.moonSign.element === chartCore.risingSign.element) score += 1;
  if (chartCore.sunSign.modality === chartCore.moonSign.modality) score += 1;
  if (chartCore.sunSign.modality === chartCore.risingSign.modality) score += 1;
  return score;
}

function formatReference(label: string, placement: ChartCore['sunSign']): string {
  return `${label} in ${placement.sign} (${placement.element}/${placement.modality})`;
}

function hashSeed(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

export function generateAnswer(
  category: AskCategory,
  question: string,
  chartCore: ChartCore
): GeneratedAnswer {
  const sunElement = ELEMENT_LANGUAGE[chartCore.sunSign.element];
  const moonElement = ELEMENT_LANGUAGE[chartCore.moonSign.element];
  const risingElement = ELEMENT_LANGUAGE[chartCore.risingSign.element];
  const sunMode = MODALITY_LANGUAGE[chartCore.sunSign.modality];
  const moonMode = MODALITY_LANGUAGE[chartCore.moonSign.modality];
  const risingMode = MODALITY_LANGUAGE[chartCore.risingSign.modality];

  const harmony = harmonyScore(chartCore);
  const dynamicNote =
    harmony >= 4
      ? 'Your placements echo each other, so progress accelerates when you commit.'
      : 'Your placements pull in different directions, which can become a strength when sequenced intentionally.';

  const theme = `Theme: ${CATEGORY_TONE[category]}.`;

  const firstParagraph =
    `${dynamicNote} In this question, your Sun suggests ${sunElement.gift} and ${sunMode.strength}. ` +
    `Your Moon points to ${moonElement.gift}, while your Rising style emphasizes ${risingMode.strength}. ` +
    'Taken together, your best path is not forcing one trait to dominate, but giving each part a clear role.';

  const secondParagraph =
    `The tension to watch is between ${sunElement.caution}, ${moonMode.friction}, and ${risingElement.caution}. ` +
    `When this friction appears, pause and choose the smallest next move that still honors your values. ` +
    'This keeps momentum humane, grounded, and sustainable instead of all-or-nothing.';

  const seed = hashSeed(`${category}|${question}|${chartCore.sunSign.sign}|${chartCore.moonSign.sign}`);
  const actionBank = [
    'Write one clear intention for the next 24 hours and one boundary that protects it.',
    'Turn your next decision into a two-step plan: first stabilizing action, then growth action.',
    'Name the emotion present, then pick one behavior that supports it without amplifying it.',
    'Schedule a 20-minute review to separate urgent tasks from meaningful tasks.',
    'Ask for one specific form of support instead of carrying everything alone.',
    'End the day by noting one win, one lesson, and one small adjustment for tomorrow.',
  ];
  const actions: [string, string, string] = [
    actionBank[seed % actionBank.length],
    actionBank[(seed + 2) % actionBank.length],
    actionBank[(seed + 4) % actionBank.length],
  ];

  const references = [
    formatReference('Sun', chartCore.sunSign),
    formatReference('Moon', chartCore.moonSign),
    formatReference('Rising', chartCore.risingSign),
  ];

  return {
    theme,
    paragraphs: [firstParagraph, secondParagraph],
    actions,
    references,
    followUps: getFollowUpPrompts(category),
  };
}
