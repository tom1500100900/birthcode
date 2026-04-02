import { Aspect, AstroProvider, AstroSnapshot, BirthInput, Placement, ProfileContext, SignSegment } from '@/types/astro';
import { BirthProfile, ChartCore, ZodiacPlacement } from '@/src/types';
import { SIGN_META, ZODIAC_SIGNS, ZodiacSign } from './zodiac';

const SIGNS = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
] as const;

function toNormalizedLon(lon: number): number {
  const normalized = lon % 360;
  const value = normalized < 0 ? normalized + 360 : normalized;
  return Number(value.toFixed(4));
}

function getSegment(signDeg: number): SignSegment {
  if (signDeg < 10) {
    return 'early';
  }
  if (signDeg < 20) {
    return 'mid';
  }
  return 'late';
}

function getDecan(segment: SignSegment): 1 | 2 | 3 {
  if (segment === 'early') {
    return 1;
  }
  if (segment === 'mid') {
    return 2;
  }
  return 3;
}

export function derivePlacement(body: 'sun' | 'moon' | 'asc', lon: number): Placement {
  const normalizedLon = toNormalizedLon(lon);
  const signIndex = Math.floor(normalizedLon / 30) % 12;
  const sign = SIGNS[signIndex];
  const signDeg = Number((normalizedLon - signIndex * 30).toFixed(2));
  const segment = getSegment(signDeg);

  return {
    body,
    lon: normalizedLon,
    sign,
    signDeg,
    segment,
    decan: getDecan(segment),
    isCusp: signDeg < 2 || signDeg > 28,
  };
}

export function deriveProfileContext(input: BirthInput, snapshot: AstroSnapshot, aspects?: Aspect[]): ProfileContext {
  return {
    input,
    snapshot,
    placements: {
      sun: derivePlacement('sun', snapshot.sunLon),
      moon: derivePlacement('moon', snapshot.moonLon),
      asc: derivePlacement('asc', snapshot.ascLon),
    },
    aspects,
    houses: [],
  };
}

export function buildProfileContext(input: BirthInput, provider: AstroProvider, aspects?: Aspect[]): ProfileContext {
  const snapshot = provider.computeSnapshot(input);
  return deriveProfileContext(input, snapshot, aspects);
}

export function deriveProfileContextFromChart(input: BirthInput, chart: {
  sun: { sign: string; degree: number };
  moon: { sign: string; degree: number };
  ascendant: { sign: string; degree: number };
  aspects?: Aspect[];
}): ProfileContext {
  const toLonFromSign = (sign: string, signDeg: number): number => {
    const signIndex = SIGNS.findIndex((value) => value.toLowerCase() === sign.trim().toLowerCase());
    const safeIndex = signIndex >= 0 ? signIndex : 0;
    return toNormalizedLon(safeIndex * 30 + signDeg);
  };

  const snapshot: AstroSnapshot = {
    sunLon: toLonFromSign(chart.sun.sign, chart.sun.degree),
    moonLon: toLonFromSign(chart.moon.sign, chart.moon.degree),
    ascLon: toLonFromSign(chart.ascendant.sign, chart.ascendant.degree),
  };

  return deriveProfileContext(input, snapshot, chart.aspects);
}

function hashValue(seed: string): number {
  let hash = 5381;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 33) ^ seed.charCodeAt(i);
  }
  return Math.abs(hash >>> 0);
}

function toZodiacPlacement(sign: ZodiacSign, degree: number): ZodiacPlacement {
  const meta = SIGN_META[sign];
  return {
    sign,
    degree: Number(Math.max(0, Math.min(29.99, degree)).toFixed(2)),
    element: meta.element,
    modality: meta.modality,
  };
}

export function computeChartCore(profile: BirthProfile): ChartCore {
  const seed = hashValue(
    `${profile.birthDateISO}|${profile.birthTimeHHMM ?? 'unknown'}|${profile.placeText}|${profile.country ?? 'na'}`
  );
  const sunSign = ZODIAC_SIGNS[seed % ZODIAC_SIGNS.length];
  const moonSign = ZODIAC_SIGNS[(seed * 3) % ZODIAC_SIGNS.length];
  const risingSign = ZODIAC_SIGNS[(seed * 7) % ZODIAC_SIGNS.length];
  const timeMissing = profile.timeUnknown || !profile.birthTimeHHMM;

  return {
    sunSign: toZodiacPlacement(sunSign, (seed % 3000) / 100),
    moonSign: { ...toZodiacPlacement(moonSign, ((seed * 5) % 3000) / 100), isApprox: timeMissing },
    risingSign: { ...toZodiacPlacement(risingSign, ((seed * 11) % 3000) / 100), isApprox: timeMissing },
    disclaimer: timeMissing
      ? 'Moon and Rising are approximate because birth time is missing or uncertain.'
      : 'This chart is symbolic and reflective, not deterministic.',
  };
}
