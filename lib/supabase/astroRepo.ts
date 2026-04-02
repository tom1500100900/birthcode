import { normalizeBirthInput } from '@/lib/astro/input';
import { generateStubAstroResult } from '@/lib/astro/stubGenerator';
import { getSupabase } from '@/lib/supabase/client';
import { ensureGuestSession, getSessionUser } from '@/lib/supabase/auth';
import { getDeviceId } from '@/lib/supabase/deviceId';
import { AspectType, AstroResult, BirthInput } from '@/types/astro';

const ASTRO_RESULTS_TABLE = 'astro_results';
const ASTRO_ENGINE_VERSION = 'v3';
const ASTRO_ENGINE_FALLBACK_VERSION = 'v2';
const ASTRO_ENGINE_LEGACY_VERSION = 'v1';
const ASTRO_ENGINE_FUNCTION_V3 = 'astro-engine-v3';
const ASTRO_ENGINE_FUNCTION_V2 = 'astro-engine-v2';
const ASTRO_ENGINE_FUNCTION_V1 = 'astro-engine-v1';
const ASTRO_ENGINE_PRIORITY = [ASTRO_ENGINE_VERSION, ASTRO_ENGINE_FALLBACK_VERSION, ASTRO_ENGINE_LEGACY_VERSION] as const;
const VALID_ASPECT_TYPES: AspectType[] = ['conjunction', 'opposition', 'trine', 'square', 'sextile'];
let astroResultsTableMissingLogged = false;

type EdgeBody = {
  engine_version?: string;
  input?: {
    birth_date?: string;
    birth_time?: string;
    timezone?: string;
    birth_place?: string;
    latitude?: number | null;
    longitude?: number | null;
  };
  big_three?: {
    sun_sign?: string;
    moon_sign?: string;
    asc_sign?: string;
  };
  bigThree?: {
    sun?: { sign?: string; degree?: number } | string;
    moon?: { sign?: string; degree?: number } | string;
    asc?: { sign?: string; degree?: number } | string;
    ascendant?: { sign?: string; degree?: number } | string;
  };
  sun?: { sign?: string; degree?: number };
  moon?: { sign?: string; degree?: number };
  asc?: { sign?: string; degree?: number };
  planets?: Array<{ name?: string; sign?: string; degree?: number; lon?: number }>;
  aspects?: Array<{ from?: string; to?: string; type?: string; orb?: number }>;
  meta?: { engine?: string; computedAt?: string };
};

type AstroResultRow = {
  id: string;
  profile_id: string;
  device_id: string;
  engine_version?: string;
  result: EdgeBody;
  created_at?: string;
  updated_at?: string;
};

export type AstroEngineInvokeResponse = {
  source: 'cache' | 'computed';
  engine_version: string;
  astro_result: AstroResultRow | EdgeBody;
};

async function getFunctionErrorDetails(error: unknown): Promise<Record<string, unknown>> {
  const fallback = {
    message: (error as { message?: unknown } | null)?.message ?? String(error),
  };
  const context = (error as { context?: unknown } | null)?.context as
    | { status?: number; json?: () => Promise<unknown>; text?: () => Promise<string> }
    | undefined;
  if (!context) {
    return fallback;
  }

  let body: unknown = null;
  try {
    if (typeof context.json === 'function') {
      body = await context.json();
    } else if (typeof context.text === 'function') {
      body = await context.text();
    }
  } catch {
    body = null;
  }

  return {
    ...fallback,
    status: context.status ?? null,
    body,
  };
}

function toNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function degreeFromLongitude(value: unknown, fallback: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return fallback;
  }
  const normalized = ((value % 30) + 30) % 30;
  return Number(normalized.toFixed(2));
}

function toAspectType(value: unknown): AspectType {
  if (typeof value === 'string' && VALID_ASPECT_TYPES.includes(value as AspectType)) {
    return value as AspectType;
  }
  return 'conjunction';
}

function logAstroRepoError(operationName: string, error: unknown, deviceId: string, context?: Record<string, unknown>): void {
  const err = error as { message?: unknown; code?: unknown; details?: unknown; hint?: unknown };
  if (__DEV__) {
    console.error('[supabase][astroRepo]', operationName, {
      table: ASTRO_RESULTS_TABLE,
      deviceId,
      message: String(err?.message ?? error),
      code: err?.code ?? null,
      details: err?.details ?? null,
      hint: err?.hint ?? null,
      context: context ?? null,
    });
  }
}

function isMissingAstroResultsTable(error: unknown): boolean {
  const err = error as { code?: unknown; message?: unknown };
  return String(err?.code ?? '') === 'PGRST205' || String(err?.message ?? '').includes('astro_results');
}

function getEngineRank(version: string | undefined): number {
  const rank = ASTRO_ENGINE_PRIORITY.indexOf((version ?? ASTRO_ENGINE_LEGACY_VERSION) as (typeof ASTRO_ENGINE_PRIORITY)[number]);
  return rank >= 0 ? rank : ASTRO_ENGINE_PRIORITY.length + 1;
}

export function mapStoredResultToAstroResult(birthInput: BirthInput, resultJson: EdgeBody): AstroResult {
  const normalizedInput = normalizeBirthInput(birthInput);
  const result = generateStubAstroResult(normalizedInput);

  const bigThreeSun = resultJson.bigThree?.sun;
  const bigThreeMoon = resultJson.bigThree?.moon;
  const bigThreeAsc = resultJson.bigThree?.asc ?? resultJson.bigThree?.ascendant;

  const sun = resultJson.bigThree?.sun ?? resultJson.sun ?? (
    resultJson.big_three?.sun_sign
      ? { sign: resultJson.big_three.sun_sign, degree: result.chart.sun.degree }
      : undefined
  );
  if (typeof bigThreeSun === 'string' && bigThreeSun.length > 0) {
    result.chart.sun.sign = bigThreeSun;
  } else if (sun && typeof sun === 'object' && sun.sign) {
    result.chart.sun.sign = sun.sign;
  }
  result.chart.sun.degree = toNumber(
    typeof sun === 'object' ? sun?.degree : undefined,
    result.chart.sun.degree
  );

  const moon = resultJson.bigThree?.moon ?? resultJson.moon ?? (
    resultJson.big_three?.moon_sign
      ? { sign: resultJson.big_three.moon_sign, degree: result.chart.moon.degree }
      : undefined
  );
  if (typeof bigThreeMoon === 'string' && bigThreeMoon.length > 0) {
    result.chart.moon.sign = bigThreeMoon;
  } else if (moon && typeof moon === 'object' && moon.sign) {
    result.chart.moon.sign = moon.sign;
  }
  result.chart.moon.degree = toNumber(
    typeof moon === 'object' ? moon?.degree : undefined,
    result.chart.moon.degree
  );

  const asc = bigThreeAsc ?? resultJson.asc ?? (
    resultJson.big_three?.asc_sign
      ? { sign: resultJson.big_three.asc_sign, degree: result.chart.ascendant.degree }
      : undefined
  );
  if (typeof bigThreeAsc === 'string' && bigThreeAsc.length > 0) {
    result.chart.ascendant.sign = bigThreeAsc;
  } else if (asc && typeof asc === 'object' && asc.sign) {
    result.chart.ascendant.sign = asc.sign;
  }
  result.chart.ascendant.degree = toNumber(
    typeof asc === 'object' ? asc?.degree : undefined,
    result.chart.ascendant.degree
  );

  if (Array.isArray(resultJson.planets)) {
    result.chart.planets = resultJson.planets.map((planet, index) => ({
      name: planet.name ?? `Planet ${index + 1}`,
      sign: planet.sign ?? 'Aries',
      degree: toNumber(planet.degree, degreeFromLongitude(planet.lon, 0)),
    }));
  }

  if (Array.isArray(resultJson.aspects)) {
    result.chart.aspects = resultJson.aspects.map((aspect) => ({
      from: aspect.from ?? 'Sun',
      to: aspect.to ?? 'Moon',
      type: toAspectType(aspect.type),
      orb: toNumber(aspect.orb, 0),
    }));
  }

  return result;
}

export async function upsertAstroResult(profileId: string, resultJson: EdgeBody): Promise<void> {
  const deviceId = await getDeviceId();
  const user = await getSessionUser();
  const supabase = await getSupabase();
  const payload = {
    profile_id: profileId,
    device_id: deviceId,
    user_id: user?.id ?? null,
    engine_version: ASTRO_ENGINE_VERSION,
    result: resultJson,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from(ASTRO_RESULTS_TABLE)
    .upsert(payload as never, { onConflict: 'profile_id,engine_version' });

  if (error) {
    if (isMissingAstroResultsTable(error)) {
      throw new Error(
        "Missing public.astro_results table in Supabase. Run migration '20260219_astro_results.sql' and refresh schema cache."
      );
    }
    logAstroRepoError('upsertAstroResult', error, deviceId, { payload });
    throw error;
  }

  if (__DEV__) {
    console.log('[supabase][astroRepo]', 'upsertAstroResult ok', { profileId, deviceId });
  }
}

export async function getAstroResult(profileId: string): Promise<EdgeBody | null> {
  const deviceId = await getDeviceId();
  const user = await getSessionUser();
  const supabase = await getSupabase();
  let query = supabase
    .from(ASTRO_RESULTS_TABLE)
    .select('*')
    .eq('profile_id', profileId)
    .in('engine_version', [...ASTRO_ENGINE_PRIORITY]);
  query = user?.id ? query.eq('user_id', user.id) : query.eq('device_id', deviceId);
  const { data, error } = await query;

  if (error) {
    if (isMissingAstroResultsTable(error)) {
      if (__DEV__ && !astroResultsTableMissingLogged) {
        astroResultsTableMissingLogged = true;
        console.warn(
          "[supabase][astroRepo] table 'astro_results' not found. Run migration 20260219_astro_results.sql."
        );
      }
      return null;
    }
    logAstroRepoError('getAstroResult', error, deviceId, { profileId });
    throw error;
  }

  if (!data || data.length === 0) {
    return null;
  }

  const sortedRows = (data as AstroResultRow[]).sort(
    (a, b) =>
      getEngineRank(a.engine_version) - getEngineRank(b.engine_version)
  );
  const row = sortedRows[0];
  return row.result;
}

export async function generateOrLoadAstroResult(profileId: string): Promise<AstroEngineInvokeResponse> {
  await ensureGuestSession();
  const supabase = await getSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const accessToken = session?.access_token ?? null;
  const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

  const invokeHeaders = {
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(anonKey ? { apikey: anonKey } : {}),
  };

  const invokeChain = [ASTRO_ENGINE_FUNCTION_V3, ASTRO_ENGINE_FUNCTION_V2, ASTRO_ENGINE_FUNCTION_V1];
  const invokeErrors: Array<{ fn: string; details: Record<string, unknown> }> = [];

  for (const fn of invokeChain) {
    const invokeResult = await supabase.functions.invoke(fn, {
      body: { profile_id: profileId },
      headers: invokeHeaders,
    });
    if (invokeResult.error) {
      const details = await getFunctionErrorDetails(invokeResult.error);
      invokeErrors.push({ fn, details });
      if (__DEV__) {
        console.error('[supabase][astroRepo]', 'generateOrLoadAstroResult error', {
          profileId,
          ...details,
          function: fn,
        });
      }
      continue;
    }

    const response = (invokeResult.data ?? null) as AstroEngineInvokeResponse | null;
    if (!response) {
      invokeErrors.push({
        fn,
        details: { message: `${fn} returned empty response` },
      });
      continue;
    }

    if (__DEV__) {
      console.log('[supabase][astroRepo]', 'generateOrLoadAstroResult ok', {
        profileId,
        source: response.source,
        engine_version: response.engine_version,
        function: fn,
      });
    }
    return response;
  }

  const mergedErrors = invokeErrors.map((item) => `${item.fn}: ${String(item.details.body ?? item.details.message ?? 'failed')}`).join(' | ');
  throw new Error(mergedErrors || 'Edge Function call failed');
}
