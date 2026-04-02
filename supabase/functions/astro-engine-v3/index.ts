import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { DateTime } from 'npm:luxon';
import { Constants, load } from './swiss-eph-local/src/main.ts';

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
  timezone: string;
  latitude: number | null;
  longitude: number | null;
};

type SwissCalcResult = {
  returnCode?: number;
  xx?: number[] | Float64Array;
  error?: string;
};

type SwissHousesResult = {
  returnCode?: number;
  cusps?: number[] | Float64Array;
  ascmc?: number[] | Float64Array;
};

type SwissApi = {
  swe_julday: (year: number, month: number, day: number, hour: number, gregflag: number) => number;
  swe_calc_ut: (jd: number, body: number, flags: number) => SwissCalcResult;
  swe_houses: (jd: number, lat: number, lon: number, houseSystem: number) => SwissHousesResult;
  swe_houses_ex?: (jd: number, flags: number, lat: number, lon: number, houseSystem: number) => SwissHousesResult;
};

type PlanetOut = {
  name: string;
  lon: number;
  lat: number;
  speed: number;
  sign: string;
  house: number;
  degree: number;
};

const ENGINE_VERSION = 'v3';
const ENGINE_PROVIDER = 'swiss';
const ASTRO_TABLE = 'astro_results';
const DEFAULT_HOUSE_SYSTEM = 'P';

const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
] as const;

let ephPromise: Promise<SwissApi> | null = null;

function pickFn(target: Record<string, unknown>, names: string[]) {
  for (const name of names) {
    const fn = target[name];
    if (typeof fn === 'function') return fn as (...args: unknown[]) => unknown;
  }
  return null;
}

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function toHHmm(value: string): string {
  const t = value.trim();
  if (/^\d{2}:\d{2}$/.test(t)) return t;
  if (/^\d{2}:\d{2}:\d{2}$/.test(t)) return t.slice(0, 5);
  return t;
}

function normalizeLongitude(raw: number): number {
  const v = ((raw % 360) + 360) % 360;
  return Number(v.toFixed(8));
}

function degreeInSign(raw: number): number {
  return Number((normalizeLongitude(raw) % 30).toFixed(4));
}

function signFromLongitude(raw: number): string {
  const idx = Math.floor(normalizeLongitude(raw) / 30) % 12;
  return SIGNS[idx];
}

function toUtcContext(dateISO: string, timeHHmm: string, timezone: string) {
  const utc = DateTime.fromISO(`${dateISO}T${timeHHmm}`, { zone: timezone }).toUTC();
  if (!utc.isValid) throw new Error(`Invalid local datetime (${dateISO} ${timeHHmm} ${timezone})`);
  const hourDecimal = utc.hour + utc.minute / 60 + utc.second / 3600;
  return { utc, tsUtc: utc.toSeconds(), hourDecimal };
}

async function getEph(): Promise<SwissApi> {
  if (!ephPromise) {
    ephPromise = load() as Promise<SwissApi>;
  }
  return ephPromise;
}

function getNum(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : Number.NaN;
}

function extractPosition(result: unknown): { lon: number; lat: number; speed: number } {
  const maybeObj = (result ?? {}) as Record<string, unknown>;
  if ('returnCode' in maybeObj && 'xx' in maybeObj) {
    const xx = Array.isArray(maybeObj.xx) || ArrayBuffer.isView(maybeObj.xx)
      ? Array.from(maybeObj.xx as ArrayLike<number>)
      : [];
    if (typeof maybeObj.returnCode === 'number' && maybeObj.returnCode < 0) {
      const msg = typeof maybeObj.error === 'string' && maybeObj.error.trim().length > 0
        ? maybeObj.error
        : 'Swiss swe_calc_ut returned error.';
      throw new Error(msg);
    }
    const lon = getNum(xx[0]);
    const lat = getNum(xx[1] ?? 0);
    const speed = getNum(xx[3] ?? 0);
    if (!Number.isFinite(lon)) throw new Error('Invalid longitude from swe_calc_ut (xx).');
    return {
      lon: normalizeLongitude(lon),
      lat: Number((Number.isFinite(lat) ? lat : 0).toFixed(8)),
      speed: Number((Number.isFinite(speed) ? speed : 0).toFixed(8)),
    };
  }

  if (Array.isArray(result)) {
    const lon = getNum(result[0]);
    const lat = getNum(result[1] ?? 0);
    const speed = getNum(result[3] ?? 0);
    if (!Number.isFinite(lon)) throw new Error('Invalid longitude from swe_calc_ut (array).');
    return { lon: normalizeLongitude(lon), lat: Number((Number.isFinite(lat) ? lat : 0).toFixed(8)), speed: Number((Number.isFinite(speed) ? speed : 0).toFixed(8)) };
  }
  const row = (result ?? {}) as Record<string, unknown>;
  const xx = Array.isArray(row.xx) ? row.xx : [];
  const lon = getNum(row.longitude ?? row.lon ?? row.lambda ?? xx[0]);
  const lat = getNum(row.latitude ?? row.lat ?? row.beta ?? xx[1] ?? 0);
  const speed = getNum(row.speedLongitude ?? row.speed ?? xx[3] ?? 0);
  if (!Number.isFinite(lon)) throw new Error('Invalid longitude from swe_calc_ut (object).');
  return { lon: normalizeLongitude(lon), lat: Number((Number.isFinite(lat) ? lat : 0).toFixed(8)), speed: Number((Number.isFinite(speed) ? speed : 0).toFixed(8)) };
}

function extractHouses(result: unknown): { cusps: number[]; asc: number; mc: number } {
  const maybeObj = (result ?? {}) as Record<string, unknown>;
  if ('cusps' in maybeObj || 'ascmc' in maybeObj) {
    if (typeof maybeObj.returnCode === 'number' && maybeObj.returnCode < 0) {
      const msg = typeof maybeObj.error === 'string' && maybeObj.error.trim().length > 0
        ? maybeObj.error
        : 'Swiss swe_houses returned error.';
      throw new Error(msg);
    }
    const cuspsRaw = Array.isArray(maybeObj.cusps) || ArrayBuffer.isView(maybeObj.cusps)
      ? Array.from(maybeObj.cusps as ArrayLike<number>)
      : [];
    const ascmcRaw = Array.isArray(maybeObj.ascmc) || ArrayBuffer.isView(maybeObj.ascmc)
      ? Array.from(maybeObj.ascmc as ArrayLike<number>)
      : [];
    const normalizedCusps = cuspsRaw.length >= 13
      ? cuspsRaw.slice(1, 13).map((v) => normalizeLongitude(getNum(v)))
      : cuspsRaw.slice(0, 12).map((v) => normalizeLongitude(getNum(v)));
    const asc = normalizeLongitude(getNum(ascmcRaw[0]));
    const mc = normalizeLongitude(getNum(ascmcRaw[1]));
    if (normalizedCusps.length === 12 && Number.isFinite(asc) && Number.isFinite(mc)) {
      return { cusps: normalizedCusps, asc, mc };
    }
  }

  if (Array.isArray(result) && result.length >= 2) {
    const cuspsRaw = Array.isArray(result[0]) ? result[0] : [];
    const ascmcRaw = Array.isArray(result[1]) ? result[1] : [];
    const cusps = cuspsRaw.slice(0, 12).map((v) => normalizeLongitude(getNum(v)));
    const asc = normalizeLongitude(getNum(ascmcRaw[0]));
    const mc = normalizeLongitude(getNum(ascmcRaw[1]));
    if (cusps.length === 12 && Number.isFinite(asc) && Number.isFinite(mc)) return { cusps, asc, mc };
  }

  const row = (result ?? {}) as Record<string, unknown>;
  const cuspsRaw = row.cusps ?? row.houses ?? row.houseCusps;
  const ascmcRaw = Array.isArray(row.ascmc) ? row.ascmc : [];
  const cusps = Array.isArray(cuspsRaw) ? cuspsRaw.slice(0, 12).map((v) => normalizeLongitude(getNum(v))) : [];
  const asc = normalizeLongitude(getNum(row.ascendant ?? row.asc ?? ascmcRaw[0]));
  const mc = normalizeLongitude(getNum(row.mc ?? row.midheaven ?? ascmcRaw[1]));
  if (cusps.length < 12 || !Number.isFinite(asc) || !Number.isFinite(mc)) throw new Error('Invalid houses from swe_houses.');
  return { cusps, asc, mc };
}

function houseFromLongitude(lonRaw: number, cusps: number[]): number {
  const lon = normalizeLongitude(lonRaw);
  for (let i = 0; i < 12; i += 1) {
    const start = cusps[i];
    const end = cusps[(i + 1) % 12];
    if (start <= end) {
      if (lon >= start && lon < end) return i + 1;
    } else if (lon >= start || lon < end) return i + 1;
  }
  return 1;
}

function angularDistance(aRaw: number, bRaw: number): number {
  const a = normalizeLongitude(aRaw);
  const b = normalizeLongitude(bRaw);
  const d = Math.abs(a - b);
  return d > 180 ? 360 - d : d;
}

function buildAspects(points: Array<{ name: string; lon: number }>) {
  const defs = [
    { type: 'conjunction', exact: 0, orb: 8 },
    { type: 'sextile', exact: 60, orb: 5 },
    { type: 'square', exact: 90, orb: 6 },
    { type: 'trine', exact: 120, orb: 6 },
    { type: 'opposition', exact: 180, orb: 8 },
  ] as const;

  const aspects: Array<{ from: string; to: string; type: string; orb: number }> = [];
  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      const angle = angularDistance(points[i].lon, points[j].lon);
      for (const def of defs) {
        const orb = Math.abs(angle - def.exact);
        if (orb <= def.orb) {
          aspects.push({ from: points[i].name, to: points[j].name, type: def.type, orb: Number(orb.toFixed(3)) });
          break;
        }
      }
    }
  }
  return aspects;
}

async function computeChart(params: { date: string; time: string; timezone: string; latitude: number; longitude: number; houseSystem: string }) {
  const swiss = await getEph();
  const { utc, tsUtc, hourDecimal } = toUtcContext(params.date, params.time, params.timezone);

  const jd = Number(swiss.swe_julday(utc.year, utc.month, utc.day, hourDecimal, Number(Constants.SE_GREG_CAL ?? 1)));
  if (!Number.isFinite(jd)) throw new Error('Swiss returned invalid Julian Day.');

  const flags = Number(Constants.SEFLG_SPEED ?? 0) | Number(Constants.SEFLG_SWIEPH ?? 0);
  const bodies = [
    { name: 'Sun', id: Number(Constants.SE_SUN ?? 0) },
    { name: 'Moon', id: Number(Constants.SE_MOON ?? 1) },
    { name: 'Mercury', id: Number(Constants.SE_MERCURY ?? 2) },
    { name: 'Venus', id: Number(Constants.SE_VENUS ?? 3) },
    { name: 'Mars', id: Number(Constants.SE_MARS ?? 4) },
    { name: 'Jupiter', id: Number(Constants.SE_JUPITER ?? 5) },
    { name: 'Saturn', id: Number(Constants.SE_SATURN ?? 6) },
    { name: 'Uranus', id: Number(Constants.SE_URANUS ?? 7) },
    { name: 'Neptune', id: Number(Constants.SE_NEPTUNE ?? 8) },
    { name: 'Pluto', id: Number(Constants.SE_PLUTO ?? 9) },
  ] as const;

  const planets: PlanetOut[] = bodies.map((b) => {
    const pos = extractPosition(swiss.swe_calc_ut(jd, b.id, flags));
    return { name: b.name, lon: pos.lon, lat: pos.lat, speed: pos.speed, sign: signFromLongitude(pos.lon), house: 0, degree: degreeInSign(pos.lon) };
  });

  const hs = (params.houseSystem || DEFAULT_HOUSE_SYSTEM).toUpperCase().slice(0, 1) || DEFAULT_HOUSE_SYSTEM;
  const hsCode = hs.charCodeAt(0);
  const housesRaw =
    typeof swiss.swe_houses_ex === 'function'
      ? swiss.swe_houses_ex(jd, flags, params.latitude, params.longitude, hsCode)
      : swiss.swe_houses(jd, params.latitude, params.longitude, hsCode);
  const houses = extractHouses(housesRaw);
  const planetsWithHouses = planets.map((p) => ({ ...p, house: houseFromLongitude(p.lon, houses.cusps) }));

  const sun = planetsWithHouses.find((p) => p.name === 'Sun');
  const moon = planetsWithHouses.find((p) => p.name === 'Moon');
  if (!sun || !moon) throw new Error('Swiss result missing Sun or Moon.');

  console.log('[astro-engine-v3] jd', jd);
  console.log('[astro-engine-v3] sunLon', sun.lon);
  console.log('[astro-engine-v3] ascLon', houses.asc);

  return {
    jd: Number(jd.toFixed(8)),
    tsUtc,
    bigThree: { sun: sun.sign, moon: moon.sign, ascendant: signFromLongitude(houses.asc) },
    compatBigThree: {
      sun: { sign: sun.sign, degree: sun.degree },
      moon: { sign: moon.sign, degree: moon.degree },
      asc: { sign: signFromLongitude(houses.asc), degree: degreeInSign(houses.asc) },
    },
    planets: planetsWithHouses,
    houses: { system: hs, cusps: houses.cusps, asc: houses.asc, mc: houses.mc },
    aspects: [],
    computedAt: new Date().toISOString(),
  };
}

function okJson(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
}

function errorJson(status: number, message: string): Response {
  return okJson({ error: message }, status);
}

serve(async (req: Request) => {
  try {
    if (req.method !== 'POST') return errorJson(405, 'Method not allowed');

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    if (!supabaseUrl || !supabaseAnonKey) return errorJson(500, 'Missing SUPABASE_URL or SUPABASE_ANON_KEY');

    const authHeader = req.headers.get('Authorization') ?? '';
    const deviceHeader = req.headers.get('x-device-id') ?? '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader, 'x-device-id': deviceHeader } },
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
      const { data, error } = await supabase.from('profiles').select('*').eq('id', body.profile_id).single();
      if (error) return errorJson(400, error.message);
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
      if (cachedError) return errorJson(400, cachedError.message);
      if (cached) {
        return okJson({
          source: 'cache',
          engine_version: ENGINE_VERSION,
          engine_provider: ENGINE_PROVIDER,
          astro_result: cached,
        });
      }
    }

    const computed = await computeChart({ date, time, timezone, latitude, longitude, houseSystem });

    const payload = {
      engineVersion: ENGINE_VERSION,
      engine_version: ENGINE_VERSION,
      input: { date, time, timezone, latitude, longitude, tsUtc: computed.tsUtc, jd: computed.jd, houseSystem },
      bigThree: computed.bigThree,
      big_three: { sun_sign: computed.bigThree.sun, moon_sign: computed.bigThree.moon, asc_sign: computed.bigThree.ascendant },
      sun: computed.compatBigThree.sun,
      moon: computed.compatBigThree.moon,
      asc: computed.compatBigThree.asc,
      planets: computed.planets,
      houses: computed.houses,
      aspects: computed.aspects,
      computedAt: computed.computedAt,
      computed_at: computed.computedAt,
      meta: { engine: ENGINE_PROVIDER, computedAt: computed.computedAt },
    };

    if (!profileRow) {
      return okJson({
        source: 'computed',
        engine_version: ENGINE_VERSION,
        engine_provider: ENGINE_PROVIDER,
        astro_result: payload,
      });
    }

    const upsertPayload = {
      profile_id: profileRow.id,
      device_id: profileRow.device_id,
      user_id: profileRow.user_id,
      engine_version: ENGINE_VERSION,
      engine_provider: ENGINE_PROVIDER,
      computed_at: computed.computedAt,
      result: payload,
    };

    const { data: inserted, error: insertError } = await supabase
      .from(ASTRO_TABLE)
      .upsert(upsertPayload, { onConflict: 'profile_id,engine_version' })
      .select('*')
      .single();

    if (insertError) return errorJson(400, insertError.message);

    return okJson({
      source: 'computed',
      engine_version: ENGINE_VERSION,
      engine_provider: ENGINE_PROVIDER,
      astro_result: inserted,
    });
  } catch (error) {
    return errorJson(500, toErrorMessage(error));
  }
});
