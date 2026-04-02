import { BirthInput, LegacyBirthInput } from '@/types/astro';

type AnyBirthInput = BirthInput | LegacyBirthInput | (Partial<BirthInput> & Partial<LegacyBirthInput>);

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asOptionalNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

export function normalizeBirthInput(input: AnyBirthInput): BirthInput {
  const legacy = input as LegacyBirthInput;
  const next: BirthInput = {
    dateISO: asString((input as BirthInput).dateISO, asString(legacy.date)),
    timeHHmm: asString((input as BirthInput).timeHHmm, asString(legacy.time, '12:00')),
    placeName: asString((input as BirthInput).placeName, asString(legacy.place, 'Unknown')),
    timezone: asString((input as BirthInput).timezone, asString(legacy.timezone, 'UTC')),
    lat: asOptionalNumber((input as BirthInput).lat) ?? asOptionalNumber(legacy.latitude),
    lon: asOptionalNumber((input as BirthInput).lon) ?? asOptionalNumber(legacy.longitude),
  };

  if (!next.dateISO) {
    next.dateISO = '2000-01-01';
  }
  if (!next.timeHHmm) {
    next.timeHHmm = '12:00';
  }
  if (!next.placeName) {
    next.placeName = 'Unknown';
  }

  return next;
}
