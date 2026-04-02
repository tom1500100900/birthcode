/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { ZodError } = require('zod');
const { ContentPackSchema, SIGN_KEYS } = require('../lib/content-engine/packSchema.ts');

function readJson(filePath: string): unknown {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function formatZodError(error: unknown): string {
  if (!(error instanceof Error) || error.name !== 'ZodError') {
    return String(error);
  }

  const zodIssues = (error as unknown as { issues: Array<{ path: Array<string | number>; message: string }> }).issues;
  return zodIssues
    .slice(0, 20)
    .map((issue: { path: Array<string | number>; message: string }) => {
      const issuePath = issue.path.length > 0 ? issue.path.join('.') : '(root)';
      return `${issuePath}: ${issue.message}`;
    })
    .join('\n');
}

function countSignSectionBlocks(
  sectionBySign: Record<string, Record<string, { general: unknown; byDegreeBand: Record<string, unknown> }>>,
  sectionName: string
): number {
  return SIGN_KEYS.reduce((count: number, sign: string) => {
    const section = sectionBySign?.[sign]?.[sectionName];
    if (!section) {
      return count;
    }
    const degreeCount = Object.keys(section.byDegreeBand ?? {}).length;
    return count + 1 + degreeCount;
  }, 0);
}

function summarize(locale: 'en' | 'pl', pack: any): void {
  const counts = {
    sunCore: countSignSectionBlocks(pack.atoms.sun, 'core'),
    sunStrengths: countSignSectionBlocks(pack.atoms.sun, 'strengths'),
    sunRisks: countSignSectionBlocks(pack.atoms.sun, 'risks'),
    sunRecommendations: countSignSectionBlocks(pack.atoms.sun, 'recommendations'),
    moonNeeds: countSignSectionBlocks(pack.atoms.moon, 'needs'),
    moonRegulation: countSignSectionBlocks(pack.atoms.moon, 'regulation'),
    moonAttachment: countSignSectionBlocks(pack.atoms.moon, 'attachment'),
    ascFirstImpression: countSignSectionBlocks(pack.atoms.asc, 'firstImpression'),
    ascSocialStyle: countSignSectionBlocks(pack.atoms.asc, 'socialStyle'),
    ascGrowthEdge: countSignSectionBlocks(pack.atoms.asc, 'growthEdge'),
    dominantsElement: Object.keys(pack.atoms.dominants.element ?? {}).length,
    dominantsModality: Object.keys(pack.atoms.dominants.modality ?? {}).length,
    aspectsTypes: Object.keys(pack.atoms.aspects.types ?? {}).length,
    aspectsTensionBands: Object.keys(pack.atoms.aspects.tensionBands ?? {}).length,
    houses: Object.keys(pack.atoms.houses ?? {}).length,
    planets: Object.keys(pack.atoms.planets ?? {}).length,
  };

  const comboCounts = {
    sun_moon: Object.keys(pack.combos.sun_moon ?? {}).length,
    sun_asc: Object.keys(pack.combos.sun_asc ?? {}).length,
    moon_asc: Object.keys(pack.combos.moon_asc ?? {}).length,
    big_three: Object.keys(pack.combos.big_three ?? {}).length,
  };

  console.log(`[content:validate] ${locale.toUpperCase()} summary`);
  Object.entries(counts).forEach(([key, value]) => {
    console.log(`  - ${key}: ${value}`);
  });
  console.log('  - combos entries:');
  Object.entries(comboCounts).forEach(([key, value]) => {
    console.log(`    - ${key}: ${value}`);
  });
}

function validateLocale(locale: 'en' | 'pl'): void {
  const filePath = path.join(process.cwd(), 'content', 'packs', 'v1', locale, 'pack.json');
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing content pack: ${filePath}`);
  }

  const rawPack = readJson(filePath);
  const pack = ContentPackSchema.parse(rawPack);
  summarize(locale, pack);
}

function run(): void {
  try {
    validateLocale('en');
    validateLocale('pl');
    console.log('[content:validate] content packs are valid.');
  } catch (error) {
    console.error('[content:validate] validation failed');
    console.error(formatZodError(error));
    process.exit(1);
  }
}

run();
