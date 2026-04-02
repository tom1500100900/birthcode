import { getSupabase } from '@/lib/supabase/client';
import { createUuid, getDeviceId } from '@/lib/supabase/deviceId';
import { getSessionUser } from '@/lib/supabase/auth';

export interface SupabaseProfileRow {
  id: string;
  user_id?: string | null;
  device_id: string;
  label: string;
  birth_date: string;
  birth_time: string;
  birth_place: string;
  timezone: string;
  latitude: number | null;
  longitude: number | null;
  created_at?: string;
  updated_at?: string;
}

const PROFILES_TABLE = 'profiles';

export interface UpsertProfilePayload {
  id?: string;
  user_id?: string;
  device_id?: string;
  label: string;
  birth_date: string;
  birth_time: string;
  birth_place: string;
  timezone: string;
  latitude: number | null;
  longitude: number | null;
}

export interface InsertProfilePayload {
  id?: string;
  device_id?: string;
  label: string;
  birth_date: string;
  birth_time: string;
  birth_place: string;
  timezone: string;
  latitude: number | null;
  longitude: number | null;
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return String(error);
}

function logRepoError(operationName: string, error: unknown, deviceId: string, context?: Record<string, unknown>): void {
  const err = error as { message?: unknown; code?: unknown; details?: unknown; hint?: unknown };
  if (__DEV__) {
    console.error('[supabase][profilesRepo]', operationName, {
      table: PROFILES_TABLE,
      deviceId,
      message: err?.message ?? getErrorMessage(error),
      code: err?.code ?? null,
      details: err?.details ?? null,
      hint: err?.hint ?? null,
      context: context ?? null,
    });
  }
}

export async function listProfiles(): Promise<SupabaseProfileRow[]> {
  const deviceId = await getDeviceId();
  const user = await getSessionUser();
  const supabase = await getSupabase();
  let query = supabase
    .from(PROFILES_TABLE)
    .select('*')
    .order('created_at', { ascending: false });
  query = user?.id ? query.eq('user_id', user.id) : query.eq('device_id', deviceId);
  const { data, error } = await query;

  if (error) {
    logRepoError('listProfiles', error, deviceId, { userId: user?.id ?? null });
    throw error;
  }

  if (__DEV__) {
    console.log('[supabase][profilesRepo]', 'listProfiles ok', {
      table: PROFILES_TABLE,
      deviceId,
      userId: user?.id ?? null,
      count: (data ?? []).length,
    });
  }
  return (data ?? []) as SupabaseProfileRow[];
}

export async function insertProfile(row: InsertProfilePayload): Promise<SupabaseProfileRow> {
  const deviceId = row.device_id ?? (await getDeviceId());
  const user = await getSessionUser();
  const payload = {
    id: row.id ?? createUuid(),
    ...row,
    device_id: deviceId,
    user_id: user?.id ?? null,
  };

  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from(PROFILES_TABLE)
    .insert(payload as any)
    .select('*')
    .single();

  if (error) {
    logRepoError('insertProfile', error, deviceId, { payload });
    throw error;
  }

  if (__DEV__) {
    console.log('[supabase][profilesRepo]', 'insertProfile ok', {
      table: PROFILES_TABLE,
      deviceId,
      userId: user?.id ?? null,
      id: (data as SupabaseProfileRow | null)?.id ?? null,
    });
  }
  return data as SupabaseProfileRow;
}

export async function upsertProfile(payload: UpsertProfilePayload): Promise<SupabaseProfileRow> {
  if (!payload.id) {
    return insertProfile(payload);
  }

  const deviceId = await getDeviceId();
  const user = await getSessionUser();
  const payloadWithDevice = {
    ...payload,
    device_id: deviceId,
    user_id: user?.id ?? null,
  };
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from(PROFILES_TABLE)
    .upsert(payloadWithDevice as any, { onConflict: 'id' })
    .select('*')
    .single();

  if (error) {
    logRepoError('upsertProfile', error, deviceId, { payload: payloadWithDevice });
    throw error;
  }

  if (__DEV__) {
    console.log('[supabase][profilesRepo]', 'upsertProfile ok', {
      table: PROFILES_TABLE,
      deviceId,
      userId: user?.id ?? null,
      id: (data as SupabaseProfileRow | null)?.id ?? null,
    });
  }
  return data as SupabaseProfileRow;
}

export async function deleteProfile(id: string): Promise<void> {
  const deviceId = await getDeviceId();
  const supabase = await getSupabase();
  const { error } = await supabase.from(PROFILES_TABLE).delete().eq('id', id);

  if (error) {
    logRepoError('deleteProfile', error, deviceId, { id });
    throw error;
  }

  if (__DEV__) {
    console.log('[supabase][profilesRepo]', 'deleteProfile ok', {
      table: PROFILES_TABLE,
      deviceId,
      id,
    });
  }
}

export async function debugInsertProfile(profile: InsertProfilePayload): Promise<{ id: string }> {
  const deviceId = profile?.device_id ?? (await getDeviceId());
  const payload = {
    id: profile.id ?? createUuid(),
    ...profile,
    device_id: deviceId,
  };
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from(PROFILES_TABLE)
    .upsert(payload as any, { onConflict: 'id' })
    .select('id')
    .single();

  if (error) {
    logRepoError('debugInsertProfile', error, deviceId, { payload });
    throw error;
  }

  const id = (data as { id?: string } | null)?.id;
  if (!id) {
    const missingIdError = new Error('Supabase upsert succeeded but returned no id.');
    logRepoError('debugInsertProfile', missingIdError, deviceId, { payload, data });
    throw missingIdError;
  }

  if (__DEV__) {
    console.log('[supabase][profilesRepo] upsert ok', { id, deviceId });
  }
  return { id };
}
