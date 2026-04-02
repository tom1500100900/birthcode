create extension if not exists pgcrypto;

create table if not exists public.astro_results (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade unique,
  device_id text not null,
  user_id uuid null,
  result jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.astro_results enable row level security;

do $$
declare p record;
begin
  for p in
    select policyname
    from pg_policies
    where schemaname = 'public' and tablename = 'astro_results'
  loop
    execute format('drop policy if exists %I on public.astro_results', p.policyname);
  end loop;
end $$;

create policy astro_results_select_device
on public.astro_results
for select
using (
  device_id = (current_setting('request.headers', true)::json ->> 'x-device-id')
);

create policy astro_results_insert_device
on public.astro_results
for insert
with check (
  device_id = (current_setting('request.headers', true)::json ->> 'x-device-id')
);

create policy astro_results_update_device
on public.astro_results
for update
using (
  device_id = (current_setting('request.headers', true)::json ->> 'x-device-id')
)
with check (
  device_id = (current_setting('request.headers', true)::json ->> 'x-device-id')
);

create policy astro_results_delete_device
on public.astro_results
for delete
using (
  device_id = (current_setting('request.headers', true)::json ->> 'x-device-id')
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_astro_results_updated_at on public.astro_results;
create trigger trg_astro_results_updated_at
before update on public.astro_results
for each row execute procedure public.set_updated_at();
