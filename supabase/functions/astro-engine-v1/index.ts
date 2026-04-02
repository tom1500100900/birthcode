import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

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

const ENGINE_VERSION = 'v1';
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
];

function hashText(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}

function pickSign(seed: number): string {
  return SIGNS[seed % SIGNS.length];
}

function pickDegree(seed: number): number {
  const value = (seed % 36000) / 100;
  return Number(value.toFixed(2));
}

function pickHouse(seed: number): number {
  return (seed % 12) + 1;
}

function buildV1Result(profile: ProfileRow) {
  const seedBase = [
    profile.id,
    profile.birth_date,
    profile.birth_time,
    profile.timezone,
    profile.birth_place ?? '',
    String(profile.latitude ?? ''),
    String(profile.longitude ?? ''),
  ].join('|');

  const sunSeed = hashText(`sun:${seedBase}`);
  const moonSeed = hashText(`moon:${seedBase}`);
  const ascSeed = hashText(`asc:${seedBase}`);

  const sunSign = pickSign(sunSeed);
  const moonSign = pickSign(moonSeed);
  const ascSign = pickSign(ascSeed);

  return {
    engine_version: ENGINE_VERSION,
    computed_at: new Date().toISOString(),
    input: {
      birth_date: profile.birth_date,
      birth_time: profile.birth_time,
      timezone: profile.timezone,
      birth_place: profile.birth_place,
      latitude: profile.latitude,
      longitude: profile.longitude,
    },
    big_three: {
      sun_sign: sunSign,
      moon_sign: moonSign,
      asc_sign: ascSign,
    },
    placements: [
      { body: 'Sun', sign: sunSign, house: pickHouse(sunSeed), degree: pickDegree(sunSeed) },
      { body: 'Moon', sign: moonSign, house: pickHouse(moonSeed), degree: pickDegree(moonSeed) },
      { body: 'Asc', sign: ascSign, house: pickHouse(ascSeed), degree: pickDegree(ascSeed) },
    ],
    notes: {
      is_placeholder: true,
      replacement_plan:
        'This payload will be recomputed by a real ephemeris engine later without breaking clients.',
    },
  };
}

serve(async (req: Request) => {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'content-type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    if (!supabaseUrl || !supabaseAnonKey) {
      return new Response(JSON.stringify({ error: 'Missing SUPABASE_URL or SUPABASE_ANON_KEY' }), {
        status: 500,
        headers: { 'content-type': 'application/json' },
      });
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
      auth: {
        persistSession: false,
      },
    });

    const payload = (await req.json().catch(() => ({}))) as { profile_id?: string };
    const profileId = payload.profile_id ?? '';
    if (!profileId) {
      return new Response(JSON.stringify({ error: 'Missing profile_id' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    console.log('[astro][edge-v1] request', { profileId, hasDeviceHeader: Boolean(deviceHeader), hasAuthHeader: Boolean(authHeader) });

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profileId)
      .single();

    if (profileError) {
      console.error('[astro][edge-v1] profile query failed', profileError);
      return new Response(JSON.stringify({ error: profileError.message }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    const row = profile as ProfileRow;
    if (!row.birth_date || !row.birth_time || !row.timezone) {
      return new Response(
        JSON.stringify({ error: 'Profile is missing required fields: birth_date, birth_time, timezone' }),
        { status: 400, headers: { 'content-type': 'application/json' } }
      );
    }

    const { data: cached, error: cachedError } = await supabase
      .from('astro_results')
      .select('*')
      .eq('profile_id', profileId)
      .eq('engine_version', ENGINE_VERSION)
      .maybeSingle();

    if (cachedError) {
      console.error('[astro][edge-v1] cache query failed', cachedError);
      return new Response(JSON.stringify({ error: cachedError.message }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    if (cached) {
      console.log('[astro][edge-v1] cache hit', { profileId });
      return new Response(
        JSON.stringify({
          source: 'cache',
          engine_version: ENGINE_VERSION,
          astro_result: cached,
        }),
        { status: 200, headers: { 'content-type': 'application/json' } }
      );
    }

    const computed = buildV1Result(row);
    const insertPayload = {
      profile_id: row.id,
      device_id: row.device_id,
      user_id: row.user_id,
      engine_version: ENGINE_VERSION,
      result: computed,
    };

    const { data: inserted, error: insertError } = await supabase
      .from('astro_results')
      .upsert(insertPayload, { onConflict: 'profile_id,engine_version' })
      .select('*')
      .single();

    if (insertError) {
      console.error('[astro][edge-v1] insert failed', insertError);
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    console.log('[astro][edge-v1] computed', { profileId });
    return new Response(
      JSON.stringify({
        source: 'computed',
        engine_version: ENGINE_VERSION,
        astro_result: inserted,
      }),
      { status: 200, headers: { 'content-type': 'application/json' } }
    );
  } catch (error) {
    console.error('[astro][edge-v1] unhandled error', error);
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
});
