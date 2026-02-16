import {
  Aspect,
  AspectType,
  AstroChart,
  AstroResult,
  BirthInput,
  PlanetPlacement,
} from '@/types/astro';
import { buildActs } from '@/lib/acts/actsBuilder';
import { deriveBalancesFromPlacements } from '@/lib/astro/balance';
import { stubAstroProvider } from '@/lib/astro/provider';
import { buildInsights } from '@/lib/insights/insightsBuilder';
import { buildProfile } from '@/lib/profile/profileBuilder';
import { buildProfileContext } from '@/src/lib/engine/derive';
import { useLocaleStore } from '@/store/useLocaleStore';

interface SignRule {
  sign: string;
  startMonth: number;
  startDay: number;
}

const SIGN_RULES: SignRule[] = [
  { sign: 'Capricorn', startMonth: 12, startDay: 22 },
  { sign: 'Aquarius', startMonth: 1, startDay: 20 },
  { sign: 'Pisces', startMonth: 2, startDay: 19 },
  { sign: 'Aries', startMonth: 3, startDay: 21 },
  { sign: 'Taurus', startMonth: 4, startDay: 20 },
  { sign: 'Gemini', startMonth: 5, startDay: 21 },
  { sign: 'Cancer', startMonth: 6, startDay: 21 },
  { sign: 'Leo', startMonth: 7, startDay: 23 },
  { sign: 'Virgo', startMonth: 8, startDay: 23 },
  { sign: 'Libra', startMonth: 9, startDay: 23 },
  { sign: 'Scorpio', startMonth: 10, startDay: 23 },
  { sign: 'Sagittarius', startMonth: 11, startDay: 22 },
];

const ASPECT_TYPES: AspectType[] = ['conjunction', 'opposition', 'trine', 'square', 'sextile'];

const PLANET_NAMES: string[] = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];

function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

function clampDegree(value: number): number {
  const normalized = value % 30;
  return Number(Math.max(0, Math.min(29.99, normalized)).toFixed(2));
}

function computeSign(date: Date): SignRule {
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  let active = SIGN_RULES[0];

  for (let i = 0; i < SIGN_RULES.length; i += 1) {
    const rule = SIGN_RULES[i];
    const nextRule = SIGN_RULES[(i + 1) % SIGN_RULES.length];
    const wrapsYear = rule.startMonth > nextRule.startMonth;
    const afterStart = month > rule.startMonth || (month === rule.startMonth && day >= rule.startDay);
    const beforeNext = month < nextRule.startMonth || (month === nextRule.startMonth && day < nextRule.startDay);

    if ((!wrapsYear && afterStart && beforeNext) || (wrapsYear && (afterStart || beforeNext))) {
      active = rule;
      break;
    }
  }

  return active;
}

function pickSignByIndex(index: number): SignRule {
  return SIGN_RULES[(index + SIGN_RULES.length) % SIGN_RULES.length];
}

function makePlacement(name: string, sign: SignRule, degreeSeed: number): PlanetPlacement {
  return {
    name,
    sign: sign.sign,
    degree: clampDegree((degreeSeed % 3000) / 100),
  };
}

function buildAspects(seed: number, planets: PlanetPlacement[]): Aspect[] {
  const total = 5 + (seed % 3);
  const list: Aspect[] = [];

  for (let i = 0; i < total; i += 1) {
    const from = planets[i % planets.length].name;
    const to = planets[(i + 2) % planets.length].name;
    const type = ASPECT_TYPES[(seed + i) % ASPECT_TYPES.length];
    const orb = Number((((seed >> (i % 8)) % 700) / 100).toFixed(2));
    list.push({ from, to, type, orb: Math.max(0.2, Math.min(6.9, orb)) });
  }

  return list;
}

export function generateStubAstroResult(input: BirthInput): AstroResult {
  const locale = useLocaleStore.getState().language;
  const dateTime = new Date(`${input.dateISO}T${input.timeHHmm}:00.000Z`);
  const safeDate = Number.isNaN(dateTime.getTime()) ? new Date('2000-01-01T12:00:00.000Z') : dateTime;
  const sunSign = computeSign(safeDate);
  const seedBase = `${input.dateISO}|${input.timeHHmm}|${input.placeName}|${input.lat ?? 'na'}|${input.lon ?? 'na'}|${input.timezone ?? 'UTC'}`;
  const seed = hashSeed(seedBase);

  const moonSign = pickSignByIndex(seed % 12);

  const sun = makePlacement('Sun', sunSign, seed + 113);
  const moon = makePlacement('Moon', moonSign, seed + 271);
  const planets = PLANET_NAMES.map((name, index) => {
    const sign = pickSignByIndex((seed + index * 5) % 12);
    return makePlacement(name, sign, seed + index * 431);
  });
  const context = buildProfileContext(input, stubAstroProvider);
  const sunFromContext: PlanetPlacement = {
    name: 'Sun',
    sign: context.placements.sun.sign,
    degree: context.placements.sun.signDeg,
  };
  const moonFromContext: PlanetPlacement = {
    name: 'Moon',
    sign: context.placements.moon.sign,
    degree: context.placements.moon.signDeg,
  };
  const ascFromContext: PlanetPlacement = {
    name: 'Ascendant',
    sign: context.placements.asc.sign,
    degree: context.placements.asc.signDeg,
  };
  const allForCounts = [sunFromContext, moonFromContext, ...planets];
  const balances = deriveBalancesFromPlacements(allForCounts);

  const chart: AstroChart = {
    sun: sunFromContext,
    moon: moonFromContext,
    ascendant: { sign: ascFromContext.sign, degree: ascFromContext.degree },
    planets,
    aspects: buildAspects(seed, [sunFromContext, moonFromContext, ...planets]),
    elementBalance: balances.elementBalance,
    modalityBalance: balances.modalityBalance,
    dominantElement: balances.dominantElement,
    dominantModality: balances.dominantModality,
  };

  const finalContext = {
    ...context,
    aspects: chart.aspects,
  };
  const profile = buildProfile(finalContext, chart);
  const insights = buildInsights(finalContext, chart, profile, locale);
  const acts = buildActs(finalContext, chart, profile, locale);

  return {
    chart,
    profile,
    insights,
    acts,
    context: finalContext,
    contentLocale: locale,
  };
}
