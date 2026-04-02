import type { User } from '@supabase/supabase-js';

import { getSupabase } from '@/lib/supabase/client';

type MigrationCounts = {
  profiles_updated: number;
  astro_results_updated: number;
};

function isAnonymousDisabledError(error: unknown): boolean {
  const message = String((error as { message?: unknown } | null)?.message ?? '').toLowerCase();
  return message.includes('anonymous sign-ins are disabled');
}

function isInvalidJwtError(error: unknown): boolean {
  const message = String((error as { message?: unknown } | null)?.message ?? '').toLowerCase();
  return message.includes('invalid jwt') || message.includes('jwt');
}

export async function getSessionUser(): Promise<User | null> {
  const supabase = await getSupabase();
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }
  return data.session?.user ?? null;
}

export async function ensureGuestSession(): Promise<User | null> {
  const supabase = await getSupabase();
  const existing = await getSessionUser();
  if (existing) {
    const { data: currentUserData, error: currentUserError } = await supabase.auth.getUser();
    if (currentUserError) {
      if (isInvalidJwtError(currentUserError)) {
        if (__DEV__) {
          console.warn('[supabase][auth] existing session has invalid JWT; resetting session');
        }
        await supabase.auth.signOut();
      } else {
        throw currentUserError;
      }
    } else if (currentUserData.user) {
      if (__DEV__) {
        console.log(`[supabase][auth] existing session userId=${currentUserData.user.id}`);
      }
      return currentUserData.user;
    }
  }

  if (existing && __DEV__) {
    console.log('[supabase][auth] existing session could not be validated; creating fresh anonymous session');
  }

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) {
    if (isAnonymousDisabledError(error)) {
      if (__DEV__) {
        console.log('[supabase][auth] anonymous sign-in disabled; continuing without guest session');
      }
      return null;
    }
    if (__DEV__) {
      console.error('[supabase][auth] ensureGuestSession failed', error);
    }
    throw error;
  }

  const user = data.user ?? null;
  if (__DEV__) {
    console.log(`[supabase][auth] signed in anonymously userId=${user?.id ?? 'none'}`);
  }
  return user;
}

export async function ensureValidSessionUser(): Promise<User | null> {
  const supabase = await getSupabase();
  const existing = await getSessionUser();
  if (!existing) {
    return null;
  }
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    if (isInvalidJwtError(error)) {
      await supabase.auth.signOut();
      return null;
    }
    throw error;
  }
  return data.user ?? null;
}

export async function ensureGuestSessionLegacy(): Promise<User | null> {
  const existing = await getSessionUser();
  if (existing) {
    if (__DEV__) {
      console.log(`[supabase][auth] existing session userId=${existing.id}`);
    }
    return existing;
  }
  return ensureGuestSession();
}

export async function sendSignInCode(email: string): Promise<void> {
  const supabase = await getSupabase();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    },
  });
  if (error) {
    throw error;
  }
}

export async function verifySignInCode(email: string, token: string): Promise<User> {
  const supabase = await getSupabase();
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });
  if (error) {
    throw error;
  }
  const user = data.user ?? null;
  if (!user) {
    throw new Error('Sign-in succeeded but no user was returned.');
  }
  return user;
}

export async function migrateGuestToUser(oldUserId: string, newUserId: string): Promise<MigrationCounts> {
  const supabase = await getSupabase();
  const { data, error } = await (supabase as any).rpc('migrate_guest_to_user', {
    old_user_id: oldUserId,
    new_user_id: newUserId,
  });
  if (error) {
    throw error;
  }

  const row = Array.isArray(data) ? data[0] : data;
  return {
    profiles_updated: Number((row as { profiles_updated?: unknown } | null)?.profiles_updated ?? 0),
    astro_results_updated: Number((row as { astro_results_updated?: unknown } | null)?.astro_results_updated ?? 0),
  };
}

export async function signOutToGuest(): Promise<User | null> {
  const supabase = await getSupabase();
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
  try {
    return await ensureGuestSession();
  } catch (error) {
    if (isAnonymousDisabledError(error)) {
      return null;
    }
    throw error;
  }
}
