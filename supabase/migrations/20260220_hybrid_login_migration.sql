create or replace function public.migrate_guest_to_user(
  old_user_id uuid,
  new_user_id uuid
)
returns table (
  profiles_updated integer,
  astro_results_updated integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_profiles integer := 0;
  v_astro integer := 0;
  v_astro_join integer := 0;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if auth.uid() <> new_user_id then
    raise exception 'new_user_id must match auth.uid()';
  end if;

  if old_user_id is null then
    return query select 0, 0;
    return;
  end if;

  update public.profiles
  set user_id = new_user_id
  where user_id = old_user_id;
  get diagnostics v_profiles = row_count;

  update public.astro_results
  set user_id = new_user_id
  where user_id = old_user_id;
  get diagnostics v_astro = row_count;

  update public.astro_results ar
  set user_id = new_user_id
  from public.profiles p
  where ar.profile_id = p.id
    and p.user_id = new_user_id
    and (ar.user_id is null or ar.user_id = old_user_id);
  get diagnostics v_astro_join = row_count;
  v_astro := v_astro + v_astro_join;

  return query select v_profiles, v_astro;
end;
$$;

revoke all on function public.migrate_guest_to_user(uuid, uuid) from public;
grant execute on function public.migrate_guest_to_user(uuid, uuid) to authenticated;
