import { AstroChart } from '@/types/astro';

type MeaningKey =
  | 'dominants.meaning.element.fire'
  | 'dominants.meaning.element.earth'
  | 'dominants.meaning.element.air'
  | 'dominants.meaning.element.water'
  | 'dominants.meaning.modality.cardinal'
  | 'dominants.meaning.modality.fixed'
  | 'dominants.meaning.modality.mutable';

export function getElementMeaning(element: AstroChart['dominantElement']): MeaningKey {
  if (element === 'Fire') return 'dominants.meaning.element.fire';
  if (element === 'Earth') return 'dominants.meaning.element.earth';
  if (element === 'Air') return 'dominants.meaning.element.air';
  return 'dominants.meaning.element.water';
}

export function getModalityMeaning(modality: AstroChart['dominantModality']): MeaningKey {
  if (modality === 'Cardinal') return 'dominants.meaning.modality.cardinal';
  if (modality === 'Fixed') return 'dominants.meaning.modality.fixed';
  return 'dominants.meaning.modality.mutable';
}
