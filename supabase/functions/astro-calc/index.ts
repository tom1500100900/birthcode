import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

type AstroCalcInput = {
  profileId?: string;
  birthInput?: {
    date?: string;
    time?: string;
    place?: string;
    latitude?: number | null;
    longitude?: number | null;
    timezone?: string | null;
  };
};

serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'content-type': 'application/json' },
    });
  }

  const payload = (await req.json().catch(() => ({}))) as AstroCalcInput;
  const profileId = payload.profileId ?? null;
  const birthInput = payload.birthInput ?? null;

  if (!profileId || !birthInput?.date || !birthInput?.time || !birthInput?.place) {
    return new Response(JSON.stringify({ error: 'Missing profileId or birthInput fields.' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const result = {
    bigThree: {
      sun: { sign: 'Gemini', degree: 13.2 },
      moon: { sign: 'Aries', degree: 5.1 },
      asc: { sign: 'Leo', degree: 22.0 },
    },
    planets: [
      { name: 'Mercury', sign: 'Cancer', degree: 2.4 },
      { name: 'Venus', sign: 'Taurus', degree: 19.7 },
      { name: 'Mars', sign: 'Virgo', degree: 9.3 },
    ],
    aspects: [
      { from: 'Sun', to: 'Moon', type: 'sextile', orb: 2.1 },
      { from: 'Mars', to: 'Venus', type: 'trine', orb: 1.7 },
    ],
    meta: {
      engine: 'stub',
      computedAt: new Date().toISOString(),
      profileId,
    },
  };

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
});
