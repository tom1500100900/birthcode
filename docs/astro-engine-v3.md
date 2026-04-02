# Astro Engine v3 (Swiss local in Edge)

## Requirements
- Supabase CLI `>= 2.75.0` (current: `2.75.0`)
- Docker running for local `supabase start` / `functions serve`

## What v3 does
- Initializes Swiss once with high-level API: `load()` from `jsr:@fusionstrings/swiss-eph`
- Uses Luxon timezone conversion to UTC
- Computes real Swiss values:
  - `swe_julday`
  - `swe_calc_ut` for Sun..Pluto
  - `swe_houses_ex` (or `swe_houses`)
- Writes `astro_results` with `engine_version='v3'`

## Local test
1. Start local stack:
```bash
supabase start
```

2. Serve edge functions:
```bash
supabase functions serve --no-verify-jwt
```

3. Test v3 endpoint:
```bash
curl -i -X POST "http://127.0.0.1:54321/functions/v1/astro-engine-v3" \
  -H "Content-Type: application/json" \
  -d "{\"date\":\"1990-01-01\",\"time\":\"12:30\",\"timezone\":\"Europe/Warsaw\",\"latitude\":52.2297,\"longitude\":21.0122,\"houseSystem\":\"P\"}"
```

Expected:
- HTTP `200`
- response with `engineVersion: "v3"`
- keys: `input`, `bigThree`, `planets`, `houses`, `computedAt`

## Deployed test
1. Deploy:
```bash
supabase functions deploy astro-engine-v3 --project-ref xultiwtenpkxnwxasjcz
```

2. Clear old v3 cache for test profile:
```sql
delete from public.astro_results
where profile_id = '68119c8f-f59f-400c-bae3-32f8112d4b8c'
  and engine_version = 'v3';
```

3. Refresh result in app for that profile.

4. Verify DB:
```sql
select profile_id, engine_version, engine_provider, updated_at
from public.astro_results
where profile_id = '68119c8f-f59f-400c-bae3-32f8112d4b8c'
order by updated_at desc;
```

Expected:
- newest row has `engine_version = 'v3'`

## Ascendant verification
1. Compute profile at time `HH:mm`.
2. Change only time by `+30 minutes`.
3. Recompute (`Refresh astro result`).

Expected:
- `houses.asc` changes
- often house cusps and asc sign also change
