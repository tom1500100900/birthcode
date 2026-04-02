import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Redirect, Stack, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import Toast from '@/components/Toast';
import { useLocale } from '@/lib/i18n/useLocale';
import { ensureGuestSession } from '@/lib/supabase/authBootstrap';
import { colors } from '@/src/theme/colors';
import { useBirthcodeStore } from '@/store/useBirthcodeStore';

export default function RootLayout() {
  const { t } = useLocale();
  const segments = useSegments();
  const profilesCount = useBirthcodeStore((state) => state.profiles.length);
  const isLoading = useBirthcodeStore((state) => state.isLoading);
  const syncProfilesFromSupabase = useBirthcodeStore((state) => state.syncProfilesFromSupabase);

  useEffect(() => {
    console.log('[boot] RootLayout mounted');
    console.log('[boot] env', {
      hasSupabaseUrl: Boolean(process.env.EXPO_PUBLIC_SUPABASE_URL),
      hasSupabaseAnonKey: Boolean(process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY),
      expoOs: process.env.EXPO_OS ?? 'unknown',
    });
    void ensureGuestSession().catch((error) => {
      console.error('[boot] ensureGuestSession rejected', error);
    });
  }, []);

  useEffect(() => {
    void syncProfilesFromSupabase().catch((error) => {
      console.error('[boot] syncProfilesFromSupabase rejected', error);
    });
  }, [syncProfilesFromSupabase]);

  const inTabs = segments[0] === '(tabs)';
  const tabRoute = inTabs ? segments[1] : null;
  const isDefinitions = tabRoute === 'definitions';
  const hasProfiles = profilesCount > 0;

  if (!hasProfiles && inTabs && !isDefinitions && !isLoading) {
    return <Redirect href="/" />;
  }

  const appTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: colors.bg,
      card: colors.bgSoft,
      text: colors.textPrimary,
      border: colors.border,
      primary: colors.accentStrong,
    },
  };

  return (
    <ThemeProvider value={appTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="onboarding/index"
          options={{
            title: t('root.onboardingTitle'),
            headerStyle: { backgroundColor: colors.bg },
            headerTitleStyle: { color: colors.textPrimary },
            headerTintColor: colors.textPrimary,
          }}
        />
        <Stack.Screen
          name="profiles"
          options={{
            title: t('profiles.title'),
            headerStyle: { backgroundColor: colors.bg },
            headerTitleStyle: { color: colors.textPrimary },
            headerTintColor: colors.textPrimary,
          }}
        />
        <Stack.Screen
          name="auth"
          options={{
            title: t('auth.title'),
            headerStyle: { backgroundColor: colors.bg },
            headerTitleStyle: { color: colors.textPrimary },
            headerTintColor: colors.textPrimary,
          }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: t('root.modalTitle') }} />
      </Stack>
      <Toast />
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
