import { getSupabase } from '@/lib/supabase/client';

export async function ensureGuestSession(): Promise<void> {
  try {
    const supabase = await getSupabase();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      console.log(
        '[supabase][auth] existing session',
        session.user.id,
        'isAnonymous:',
        session.user.is_anonymous
      );
      return;
    }

    console.log('[supabase][auth] no session, signing in anonymously');
    const { data, error } = await supabase.auth.signInAnonymously();

    if (error) {
      console.error('[supabase][auth] anonymous sign-in failed', error);
      return;
    }

    console.log(
      '[supabase][auth] signed in anonymously',
      data.user?.id,
      'isAnonymous:',
      data.user?.is_anonymous
    );
  } catch (error) {
    console.error('[supabase][auth] ensureGuestSession failed during app boot', error);
  }
}
