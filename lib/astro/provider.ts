import { AstroProvider, AstroSnapshot, BirthInput } from '@/types/astro';

function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}

function toLon(seedValue: number): number {
  return Number(((seedValue % 36000) / 100).toFixed(4));
}

export class StubAstroProvider implements AstroProvider {
  computeSnapshot(input: BirthInput): AstroSnapshot {
    const seed = hashSeed(
      `${input.dateISO}|${input.timeHHmm}|${input.placeName}|${input.lat ?? 'na'}|${input.lon ?? 'na'}|${input.timezone ?? 'UTC'}`
    );

    return {
      sunLon: toLon(seed + 113),
      moonLon: toLon(seed * 3 + 271),
      ascLon: toLon(seed * 7 + 389),
    };
  }
}

export const stubAstroProvider: AstroProvider = new StubAstroProvider();
