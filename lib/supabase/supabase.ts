import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { getDeviceId } from '@/lib/supabase/deviceId';

let singleton: SupabaseClient | null = null;

export async function getSupabase(): Promise<SupabaseClient> {
  if (singleton) {
    return singleton;
  }

  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      'Missing Supabase env vars. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env and restart Expo with -c.'
    );
  }

  const deviceId = await getDeviceId();
  singleton = createClient(url, anonKey, {
    global: {
      headers: {
        'x-device-id': deviceId,
      },
    },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });

  return singleton;
}
