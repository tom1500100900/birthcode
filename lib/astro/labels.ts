import { PlanetPlacement } from '@/types/astro';

export type DegreePhase = 'Early' | 'Mid' | 'Late';

export function getDegreePhase(degree: number): DegreePhase {
  if (degree < 10) {
    return 'Early';
  }
  if (degree < 20) {
    return 'Mid';
  }
  return 'Late';
}

export function formatPlacementLabel(placement: PlanetPlacement): string {
  return `${placement.sign} - ${getDegreePhase(placement.degree)}`;
}

export function formatDegreeText(degree: number): string {
  return `${degree.toFixed(1)} deg`;
}