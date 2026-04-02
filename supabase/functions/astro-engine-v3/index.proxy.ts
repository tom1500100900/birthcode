import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

type AstroEngineRequest = {
  profile_id?: string;
  date?: string;
  time?: string;
  timezone?: string;
  latitude?: number;
  longitude?: number;
  houseSystem?: string;
};

type ProfileRow = {
  id: string;
  user_id: string | null;
  device_id: string;
  birth_date: string;
  birth_time: string;
  birth_place: string;
  timezone: string;
  latitude: number | null;
  longitude: number | null;
};

type SwissResponse = Record<string, unknown>;

const ENGINE_VERSION = 'v3';
const DEFAULT_ENGINE_PROVIDER = 'swiss-remote';
const ASTRO_TABLE = 'astro_results';
const DEFAULT_HOUSE_SYSTEM = 'P';

function okJson(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function errorJson(status: number, message: string): Response {
  return okJson({ error: message }, status);
}

function toHHmm(timeText: string): string {
  const trimmed = timeText.trim();
  if (/^\d{2}:\d{2}$/.test(trimmed)) {
    return trimmed;
  }
  if (/^\d{2}:\d{2}:\d{2}$/.test(trimmed)) {
    return trimmed.slice(0, 5);
  }
  return trimmed;
}

function readProvider(result: SwissResponse): string {
  const fromRoot = result.engine_provider;
  if (typeof fromRoot === 'string' && fromRoot.length > 0) {
    return fromRoot;
  }
  const meta = (result.meta ?? null) as { engine?: unknown } | null;
  if (typeof meta?.engine === 'string' && meta.engine.length > 0) {
    return meta.engine;
  }
  return DEFAULT_ENGINE_PROVIDER;
}

function normalizeBigThree(result: SwissResponse) {
  const compatBigThree = (result.big_three ?? null) as
    | { sun_sign?: unknown; moon_sign?: unknown; asc_sign?: unknown }
    | null;

  const bigThree = (result.bigThree ?? null) as
    | {
        sun?: { sign?: unknown; degree?: unknown } | unknown;
        moon?: { sign?: unknown; degree?: unknown } | unknown;
        asc?: { sign?: unknown; degree?: unknown } | unknown;
        ascendant?: { sign?: unknown; degree?: unknown } | unknown;
      }
    | null;

  const sunSign =
    (typeof compatBigThree?.sun_sign === 'string' && compatBigThree.sun_sign) ||
    (typeof bigThree?.sun === 'object' && bigThree.sun && typeof (bigThree.sun as { sign?: unknown }).sign === 'string'
      ? ((bigThree.sun as { sign?: string }).sign ?? '')
      : '') ||
    'Aries';
  const moonSign =
    (typeof compatBigThree?.moon_sign === 'string' && compatBigThree.moon_sign) ||
    (typeof bigThree?.moon === 'object' && bigThree.moon && typeof (bigThree.moon as { sign?: unknown }).sign === 'string'
      ? ((bigThree.moon as { sign?: string }).sign ?? '')
      : '') ||
    'Aries';
  const ascSign =
    (typeof compatBigThree?.asc_sign === 'string' && compatBigThree.asc_sign) ||
    (typeof bigThree?.asc === 'object' && bigThree.asc && typeof (bigThree.asc as { sign?: unknown }).sign === 'string'
      ? ((bigThree.asc as { sign?: string }).sign ?? '')
      : '') ||
    (typeof bigThree?.ascendant === 'object' &&
    bigThree.ascendant &&
    typeof (bigThree.ascendant as { sign?: unknown }).sign === 'string'
      ? ((bigThree.ascendant as { sign?: string }).sign ?? '')
      : '') ||
    'Aries';

  return {
    sun_sign: sunSign,
    moon_sign: moonSign,
    asc_sign: ascSign,
  };
}

function normalizePayload(input: {
  date: string;
  time: string;
  timezone: string;
  latitude: number;
  longitude: number;
  houseSystem: string;
}, result: SwissResponse) {
  const computedAt = typeof result.computed_at === 'string'
    ? result.computed_at
    : typeof result.computedAt === 'string'
      ? result.computedAt
      : new Date().toISOString();

  const bigThree = normalizeBigThree(result);
  const provider = readProvider(result);

  const planets = Array.isArray(result.planets) ? result.planets : [];
  const aspects = Array.isArray(result.aspects) ? result.aspects : [];
  const houses = typeof result.houses === 'object' && result.houses ? result.houses : null;

  return {
    engineVersion: ENGINE_VERSION,
    engine_version: ENGINE_VERSION,
    input: {
      date: input.date,
      time: input.time,
      timezone: input.timezone,
      latitude: input.latitude,
      longitude: input.longitude,
      houseSystem: input.houseSystem,
      birth_date: input.date,
      birth_time: input.time,
    },
    big_three: bigThree,
    bigThree: result.bigThree ?? null,
    sun: result.sun ?? null,
    moon: result.moon ?? null,
    asc: result.asc ?? null,
    planets,
    aspects,
    houses,
    computedAt,
    computed_at: computedAt,
    meta: {
      engine: provider,
      computedAt,
      source: 'remote-swiss',
    },
  };
}

serve(async (req: Request) => {
  try {
    if (req.method !== 'POST') {
      return errorJson(405, 'Method not allowed');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const swissEngineUrl = Deno.env.get('SWISS_ENGINE_URL');
    const swissEngineToken = Deno.env.get('SWISS_ENGINE_TOKEN') ?? '';

    if (!supabaseUrl || !supabaseAnonKey) {
      return errorJson(500, 'Missing SUPABASE_URL or SUPABASE_ANON_KEY');
    }
    if (!swissEngineUrl) {
      return errorJson(500, 'Missing SWISS_ENGINE_URL');
    }

    const authHeader = req.headers.get('Authorization') ?? '';
    const deviceHeader = req.headers.get('x-device-id') ?? '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
          'x-device-id': deviceHeader,
        },
      },
      auth: { persistSession: false },
    });

    const body = (await req.json().catch(() => ({}))) as AstroEngineRequest;
    let profileRow: ProfileRow | null = null;

    let date = body.date ?? '';
    let time = body.time ?? '';
    let timezone = body.timezone ?? '';
    let latitude = typeof body.latitude === 'number' ? body.latitude : Number.NaN;
    let longitude = typeof body.longitude === 'number' ? body.longitude : Number.NaN;

    if (body.profile_id) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', body.profile_id)
        .single();
      if (error) {
        return errorJson(400, error.message);
      }

      profileRow = data as ProfileRow;
      date = profileRow.birth_date;
      time = toHHmm(profileRow.birth_time);
      timezone = profileRow.timezone;
      latitude = Number(profileRow.latitude);
      longitude = Number(profileRow.longitude);
    }

    if (!date || !time || !timezone || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return errorJson(400, 'Missing required fields. Provide profile_id or date,time,timezone,latitude,longitude.');
    }

    const houseSystem = (body.houseSystem ?? DEFAULT_HOUSE_SYSTEM).toUpperCase().slice(0, 1) || DEFAULT_HOUSE_SYSTEM;

    if (profileRow) {
      const { data: cached, error: cachedError } = await supabase
        .from(ASTRO_TABLE)
        .select('*')
        .eq('profile_id', profileRow.id)
        .eq('engine_version', ENGINE_VERSION)
        .maybeSingle();
      if (cachedError) {
        return errorJson(400, cachedError.message);
      }
      if (cached) {
        return okJson({
          source: 'cache',
          engine_version: ENGINE_VERSION,
          engine_provider: cached.engine_provider ?? DEFAULT_ENGINE_PROVIDER,
          astro_result: cached,
        });
      }
    }

    const swissRequestPayload = {
      date,
      time,
      timezone,
      latitude,
      longitude,
      houseSystem,
    };

    const swissRes = await fetch(swissEngineUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(swissEngineToken ? { Authorization: `Bearer ${swissEngineToken}` } : {}),
      },
      body: JSON.stringify(swissRequestPayload),
    });

    if (!swissRes.ok) {
      const bodyText = await swissRes.text().catch(() => '');
      return errorJson(
        500,
        `Swiss engine returned ${swissRes.status}${bodyText ? `: ${bodyText.slice(0, 300)}` : ''}`
      );
    }

    const swissResult = (await swissRes.json().catch(() => null)) as SwissResponse | null;
    if (!swissResult || typeof swissResult !== 'object') {
      return errorJson(500, 'Swiss engine returned invalid JSON payload.');
    }

    const payload = normalizePayload(
      { date, time, timezone, latitude, longitude, houseSystem },
      swissResult
    );
    const engineProvider = readProvider(swissResult);

    if (!profileRow) {
      return okJson({
        source: 'computed',
        engine_version: ENGINE_VERSION,
        engine_provider: engineProvider,
        astro_result: payload,
      });
    }

    const upsertPayload = {
      profile_id: profileRow.id,
      device_id: profileRow.device_id,
      user_id: profileRow.user_id,
      engine_version: ENGINE_VERSION,
      engine_provider: engineProvider,
      computed_at: payload.computed_at,
      result: payload,
    };

    const { data: inserted, error: insertError } = await supabase
      .from(ASTRO_TABLE)
      .upsert(upsertPayload, { onConflict: 'profile_id,engine_version' })
      .select('*')
      .single();
    if (insertError) {
      return errorJson(400, insertError.message);
    }

    return okJson({
      source: 'computed',
      engine_version: ENGINE_VERSION,
      engine_provider: engineProvider,
      astro_result: inserted,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return errorJson(500, message);
  }
});
