import { AstroChart, PlanetPlacement } from '@/types/astro';

type ElementType = AstroChart['dominantElement'];
type ModalityType = AstroChart['dominantModality'];

interface SignMeta {
  sign: string;
  element: ElementType;
  modality: ModalityType;
}

const SIGN_META: SignMeta[] = [
  { sign: 'Aries', element: 'Fire', modality: 'Cardinal' },
  { sign: 'Taurus', element: 'Earth', modality: 'Fixed' },
  { sign: 'Gemini', element: 'Air', modality: 'Mutable' },
  { sign: 'Cancer', element: 'Water', modality: 'Cardinal' },
  { sign: 'Leo', element: 'Fire', modality: 'Fixed' },
  { sign: 'Virgo', element: 'Earth', modality: 'Mutable' },
  { sign: 'Libra', element: 'Air', modality: 'Cardinal' },
  { sign: 'Scorpio', element: 'Water', modality: 'Fixed' },
  { sign: 'Sagittarius', element: 'Fire', modality: 'Mutable' },
  { sign: 'Capricorn', element: 'Earth', modality: 'Cardinal' },
  { sign: 'Aquarius', element: 'Air', modality: 'Fixed' },
  { sign: 'Pisces', element: 'Water', modality: 'Mutable' },
];

function fallbackSignMeta(): SignMeta {
  return SIGN_META[0];
}

function dominantByCount<T extends string>(counts: Record<T, number>, fallback: T): T {
  const entries = Object.entries(counts) as Array<[T, number]>;
  if (entries.length === 0) {
    return fallback;
  }
  return entries.reduce((accumulator, current) => (current[1] > accumulator[1] ? current : accumulator))[0];
}

function buildElementBalance(counts: Record<ElementType, number>, total: number): AstroChart['elementBalance'] {
  return (Object.keys(counts) as ElementType[])
    .map((element) => ({
      element,
      count: counts[element],
      percentage: total > 0 ? Number(((counts[element] / total) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

function buildModalityBalance(counts: Record<ModalityType, number>, total: number): AstroChart['modalityBalance'] {
  return (Object.keys(counts) as ModalityType[])
    .map((modality) => ({
      modality,
      count: counts[modality],
      percentage: total > 0 ? Number(((counts[modality] / total) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

export function deriveBalancesFromPlacements(placements: PlanetPlacement[]): {
  elementBalance: AstroChart['elementBalance'];
  modalityBalance: AstroChart['modalityBalance'];
  dominantElement: ElementType;
  dominantModality: ModalityType;
} {
  const elementCounts: Record<ElementType, number> = {
    Fire: 0,
    Earth: 0,
    Air: 0,
    Water: 0,
  };
  const modalityCounts: Record<ModalityType, number> = {
    Cardinal: 0,
    Fixed: 0,
    Mutable: 0,
  };

  placements.forEach((placement) => {
    const meta = SIGN_META.find((item) => item.sign === placement.sign) ?? fallbackSignMeta();
    elementCounts[meta.element] += 1;
    modalityCounts[meta.modality] += 1;
  });

  return {
    elementBalance: buildElementBalance(elementCounts, placements.length),
    modalityBalance: buildModalityBalance(modalityCounts, placements.length),
    dominantElement: dominantByCount(elementCounts, 'Fire'),
    dominantModality: dominantByCount(modalityCounts, 'Cardinal'),
  };
}
