import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { useLocale } from '@/lib/i18n/useLocale';
import { ensureGuestSession, getSessionUser, signOutToGuest } from '@/lib/supabase/auth';
import { getSupabase } from '@/lib/supabase/client';
import { createUuid, getDeviceId } from '@/lib/supabase/deviceId';
import { debugInsertProfile, listProfiles } from '@/lib/supabase/profilesRepo';
import { ButtonSecondary, Card, Screen, SectionHeader } from '@/src/components';
import { computeChartCore } from '@/src/lib/engine/derive';
import { clearAllData, getInsights, getProfile, getQAHistory } from '@/src/lib/storage';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';
import { typography } from '@/src/theme/typography';
import { useBirthcodeStore } from '@/store/useBirthcodeStore';

export default function SettingsScreen() {
  const { language, setLanguage, t } = useLocale();
  const profiles = useBirthcodeStore((state) => state.profiles);
  const activeProfileId = useBirthcodeStore((state) => state.activeProfileId);
  const resetStore = useBirthcodeStore((state) => state.reset);
  const syncProfilesFromSupabase = useBirthcodeStore((state) => state.syncProfilesFromSupabase);
  const addTestProfiles = useBirthcodeStore((state) => state.addTestProfiles);
  const resetToFixtures = useBirthcodeStore((state) => state.resetToFixtures);
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(true);

  const refreshSessionUser = async () => {
    try {
      const user = await getSessionUser();
      setSessionUserId(user?.id ?? null);
      setSessionEmail(user?.email ?? null);
      setIsAnonymous(Boolean(user?.is_anonymous ?? !user?.email));
    } catch (error) {
      if (__DEV__) {
        console.error('[supabase][settings]', 'refreshSessionUser failed', error);
      }
    }
  };

  useEffect(() => {
    void refreshSessionUser();
    void ensureGuestSession().then(refreshSessionUser).catch((error) => {
      if (__DEV__) {
        console.error('[supabase][settings]', 'ensureGuestSession failed', error);
      }
    });

    let mounted = true;
    let unsubscribe: (() => void) | null = null;
    void (async () => {
      const supabase = await getSupabase();
      const { data: sub } = supabase.auth.onAuthStateChange(() => {
        if (mounted) {
          void refreshSessionUser();
        }
      });
      unsubscribe = () => sub.subscription.unsubscribe();
    })();

    return () => {
      mounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const userIdShort = useMemo(
    () => (sessionUserId ? `${sessionUserId.slice(0, 8)}...` : '-'),
    [sessionUserId]
  );

  const exportData = async () => {
    const profile = await getProfile();
    const insights = await getInsights();
    const qaHistory = await getQAHistory();
    const payload = {
      profiles,
      activeProfileId,
      profile,
      chartCore: profile ? computeChartCore(profile) : null,
      insights,
      qaHistory,
      exportedAtISO: new Date().toISOString(),
    };
    await Clipboard.setStringAsync(JSON.stringify(payload, null, 2));
  };

  const confirmReset = () => {
    Alert.alert(t('settings.resetTitle'), t('settings.resetMessage'), [
      { text: t('settings.cancel'), style: 'cancel' },
      {
        text: t('settings.confirmReset'),
        style: 'destructive',
        onPress: () => {
          void (async () => {
            await clearAllData();
            resetStore();
            router.replace('/onboarding');
          })();
        },
      },
    ]);
  };

  const testSupabase = async () => {
    try {
      const supabase = await getSupabase();
      const { data, error } = await supabase.auth.getSession();
      const userId = data.session?.user?.id ?? null;
      if (error) {
        if (__DEV__) {
          console.error('[supabase][settings]', 'testSupabase error', error);
        }
        Alert.alert('Supabase', error.message);
        return;
      }
      if (__DEV__) {
        console.log('[supabase][settings]', 'testSupabase ok', { userId });
      }
      Alert.alert('Supabase', `${t('settings.supabaseOk')}\nuser_id: ${userId ?? 'none'}`);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      if (__DEV__) {
        console.error('[supabase][settings]', 'testSupabase crash', e);
      }
      Alert.alert('Supabase', `${t('settings.supabaseError')}: ${message}`);
    }
  };

  const insertDebugProfileRow = async () => {
    try {
      const payload = {
        id: createUuid(),
        device_id: await getDeviceId(),
        label: `Debug ${new Date().toISOString()}`,
        birth_date: '1979-06-04',
        birth_time: '17:30:00',
        birth_place: 'Warsaw',
        latitude: 52.2297,
        longitude: 21.0122,
        timezone: 'Europe/Warsaw',
      };

      const { id: insertedId } = await debugInsertProfile(payload);
      if (__DEV__) {
        console.log('[supabase][settings]', 'insertDebugProfileRow ok', {
          insertedId,
          label: payload.label,
          row: payload,
        });
      }
      Alert.alert('Supabase', `Inserted debug profile: ${payload.label} (${insertedId})`);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      const code = (e as { code?: string } | null)?.code ?? '';
      const rlsHint = code === '42501'
        ? '\nRLS blokuje INSERT. Sprawdz policy dla public.profiles (device_id / x-device-id).'
        : '';
      if (__DEV__) {
        console.error('[supabase][settings]', 'insertDebugProfileRow error', e);
      }
      Alert.alert('Supabase', `Insert failed: ${message}${rlsHint}`);
    }
  };

  const loadProfilesFromSupabase = async () => {
    try {
      const rows = await listProfiles();
      const firstLabel = rows[0]?.label ? `, first: ${rows[0].label}` : '';
      if (__DEV__) {
        console.log('[supabase][settings]', 'loadProfilesFromSupabase ok', { count: rows.length, first: rows[0]?.label ?? null });
      }
      Alert.alert('Supabase', `Loaded ${rows.length} profiles${firstLabel}`);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      if (__DEV__) {
        console.error('[supabase][settings]', 'loadProfilesFromSupabase error', e);
      }
      Alert.alert('Supabase', `Load failed: ${message}`);
    }
  };

  const openAuthUpgrade = () => {
    router.push({
      pathname: '/auth',
      params: {
        oldUserId: sessionUserId ?? '',
      },
    });
  };

  const handleSignOut = async () => {
    try {
      await signOutToGuest();
      await syncProfilesFromSupabase();
      await refreshSessionUser();
      Alert.alert('Auth', t('settings.accountSignedOut'));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (__DEV__) {
        console.error('[supabase][settings]', 'signOut failed', error);
      }
      Alert.alert('Auth', `${t('settings.accountSignOut')} failed: ${message}`);
    }
  };

  return (
    <Screen scroll>
      <View style={styles.container}>
        <SectionHeader
          title={t('settings.title')}
          subtitle={t('settings.subtitle')}
        />
        <Card>
          <View style={styles.row}>
            <Text style={styles.label}>{t('settings.darkMode')}</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ true: colors.accentStrong, false: colors.border }}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t('settings.notifications')}</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ true: colors.accentStrong, false: colors.border }}
            />
          </View>
        </Card>
        <Card>
          <Text style={styles.languageTitle}>{t('settings.accountTitle')}</Text>
          <Text style={styles.languageSubtitle}>
            {isAnonymous ? t('settings.accountGuest') : t('settings.accountSignedIn')}
          </Text>
          <Text style={styles.languageSubtitle}>
            {sessionEmail ? `${sessionEmail} (${userIdShort})` : `user_id: ${userIdShort}`}
          </Text>
          <View style={styles.accountActions}>
            <ButtonSecondary
              label={t('settings.accountSignIn')}
              onPress={openAuthUpgrade}
            />
            <ButtonSecondary
              label={t('settings.accountSignOut')}
              onPress={() => void handleSignOut()}
            />
          </View>
        </Card>
        <Card>
          <Text style={styles.languageTitle}>{t('settings.languageTitle')}</Text>
          <Text style={styles.languageSubtitle}>
            {t('settings.languageSubtitle', {
              language: language === 'en' ? t('settings.languageEnglish') : t('settings.languagePolish'),
            })}
          </Text>
          <View style={styles.languageRow}>
            <Pressable
              style={[styles.languageButton, language === 'en' && styles.languageButtonActive]}
              onPress={() => void setLanguage('en')}>
              <Text style={styles.languageButtonText}>{t('settings.languageEnglish')}</Text>
            </Pressable>
            <Pressable
              style={[styles.languageButton, language === 'pl' && styles.languageButtonActive]}
              onPress={() => void setLanguage('pl')}>
              <Text style={styles.languageButtonText}>{t('settings.languagePolish')}</Text>
            </Pressable>
          </View>
        </Card>
        {__DEV__ ? (
          <Card>
            <Text style={styles.languageTitle}>{t('settings.supabaseTitle')}</Text>
            {/* After pressing Insert debug profile row, you should see a new row in Supabase Table Editor -> public.profiles */}
            <ButtonSecondary
              label={t('settings.supabaseTest')}
              onPress={() => void testSupabase()}
            />
            <ButtonSecondary
              label="Insert debug profile row"
              onPress={() => void insertDebugProfileRow()}
            />
            <ButtonSecondary
              label="Load profiles from Supabase"
              onPress={() => void loadProfilesFromSupabase()}
            />
            <ButtonSecondary
              label="Add test profiles"
              onPress={() => {
                addTestProfiles();
                Alert.alert('DEV', 'Dodano profile testowe (bez duplikatow).');
              }}
            />
            <ButtonSecondary
              label="Reset to fixtures"
              onPress={() => {
                resetToFixtures();
                Alert.alert('DEV', 'Przywrocono fixtures i ustawiono aktywny profil: Tomek 1979-06-04 17:30 Warsaw.');
              }}
            />
          </Card>
        ) : null}
        <ButtonSecondary label={t('settings.export')} onPress={() => void exportData()} />
        <ButtonSecondary label={t('settings.reset')} onPress={confirmReset} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  label: {
    color: colors.textSecondary,
    fontSize: typography.body,
    fontWeight: '600',
  },
  languageTitle: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '700',
  },
  languageSubtitle: {
    color: colors.textMuted,
    fontSize: typography.bodySm,
  },
  languageRow: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  languageButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.bgSoft,
    alignItems: 'center',
  },
  languageButtonActive: {
    borderColor: colors.accentStrong,
    backgroundColor: colors.cardElevated,
  },
  languageButtonText: {
    color: colors.textPrimary,
    fontSize: typography.bodySm,
    fontWeight: '700',
  },
  accountActions: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
});
