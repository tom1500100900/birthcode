alter table public.astro_results
  add column if not exists engine_provider text,
  add column if not exists computed_at timestamptz;

create index if not exists idx_astro_results_profile_engine
  on public.astro_results (profile_id, engine_version);
