alter table public.astro_results
  add column if not exists device_id text,
  add column if not exists user_id uuid,
  add column if not exists engine_version text not null default 'v1';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'astro_results_profile_id_engine_version_key'
  ) then
    alter table public.astro_results
      add constraint astro_results_profile_id_engine_version_key unique (profile_id, engine_version);
  end if;
end $$;

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

create policy astro_results_select_owner
on public.astro_results
for select
using (
  (device_id = (current_setting('request.headers', true)::json ->> 'x-device-id'))
  or (auth.uid() is not null and user_id = auth.uid())
);

create policy astro_results_insert_owner
on public.astro_results
for insert
with check (
  (device_id = (current_setting('request.headers', true)::json ->> 'x-device-id'))
  or (auth.uid() is not null and user_id = auth.uid())
);

create policy astro_results_update_owner
on public.astro_results
for update
using (
  (device_id = (current_setting('request.headers', true)::json ->> 'x-device-id'))
  or (auth.uid() is not null and user_id = auth.uid())
)
with check (
  (device_id = (current_setting('request.headers', true)::json ->> 'x-device-id'))
  or (auth.uid() is not null and user_id = auth.uid())
);

create policy astro_results_delete_owner
on public.astro_results
for delete
using (
  (device_id = (current_setting('request.headers', true)::json ->> 'x-device-id'))
  or (auth.uid() is not null and user_id = auth.uid())
);

drop trigger if exists trg_astro_results_updated_at on public.astro_results;
create trigger trg_astro_results_updated_at
before update on public.astro_results
for each row execute procedure public.set_updated_at();
