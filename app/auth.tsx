import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { useLocale } from '@/lib/i18n/useLocale';
import {
  getSessionUser,
  migrateGuestToUser,
  sendSignInCode,
  verifySignInCode,
} from '@/lib/supabase/auth';
import { ButtonPrimary, Card, Screen, SectionHeader, TextField } from '@/src/components';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';
import { typography } from '@/src/theme/typography';
import { useBirthcodeStore } from '@/store/useBirthcodeStore';

function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

function isEmailRateLimitError(error: unknown): boolean {
  const message = String((error as { message?: unknown } | null)?.message ?? '').toLowerCase();
  return message.includes('email rate limit exceeded');
}

export default function AuthScreen() {
  const { t } = useLocale();
  const params = useLocalSearchParams<{ oldUserId?: string }>();
  const syncProfilesFromSupabase = useBirthcodeStore((state) => state.syncProfilesFromSupabase);

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [oldUserId, setOldUserId] = useState<string | null>(null);
  const [codeSent, setCodeSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retryAt, setRetryAt] = useState<number | null>(null);
  const [nowTs, setNowTs] = useState<number>(Date.now());

  useEffect(() => {
    if (typeof params.oldUserId === 'string' && params.oldUserId.length > 0) {
      setOldUserId(params.oldUserId);
      return;
    }
    void (async () => {
      try {
        const user = await getSessionUser();
        setOldUserId(user?.id ?? null);
      } catch (error) {
        if (__DEV__) {
          console.error('[supabase][authScreen] failed to resolve old user id', error);
        }
      }
    })();
  }, [params.oldUserId]);

  const emailValue = useMemo(() => normalizeEmail(email), [email]);
  const retryInSec = retryAt ? Math.max(0, Math.ceil((retryAt - nowTs) / 1000)) : 0;
  const canSendCode = !isSubmitting && retryInSec === 0;

  useEffect(() => {
    if (!retryAt) {
      return;
    }
    const timer = setInterval(() => {
      setNowTs(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, [retryAt]);

  const onSendCode = async () => {
    if (!emailValue.includes('@')) {
      Alert.alert('Auth', t('auth.invalidEmail'));
      return;
    }

    try {
      setIsSubmitting(true);
      await sendSignInCode(emailValue);
      setCodeSent(true);
      Alert.alert('Auth', t('auth.codeSent'));
      if (__DEV__) {
        console.log('[supabase][authScreen] code sent', { email: emailValue });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (isEmailRateLimitError(error)) {
        const nextRetryAt = Date.now() + 60_000;
        setRetryAt(nextRetryAt);
        setNowTs(Date.now());
        if (__DEV__) {
          console.log('[supabase][authScreen] send code rate limited', { email: emailValue });
        }
        Alert.alert('Auth', t('auth.rateLimit'));
      } else {
        if (__DEV__) {
          console.error('[supabase][authScreen] send code failed', error);
        }
        Alert.alert('Auth', `${t('auth.sendFailed')}: ${message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onVerify = async () => {
    if (!emailValue.includes('@')) {
      Alert.alert('Auth', t('auth.invalidEmail'));
      return;
    }
    if (!code.trim()) {
      Alert.alert('Auth', t('auth.codeRequired'));
      return;
    }

    try {
      setIsSubmitting(true);
      const newUser = await verifySignInCode(emailValue, code.trim());
      let migrationMessage = t('auth.migrationSkipped');
      if (oldUserId && oldUserId !== newUser.id) {
        const counts = await migrateGuestToUser(oldUserId, newUser.id);
        migrationMessage = t('auth.migrationDone', {
          profiles: counts.profiles_updated,
          astro: counts.astro_results_updated,
        });
      }

      await syncProfilesFromSupabase();
      if (__DEV__) {
        console.log('[supabase][authScreen] verify success', {
          oldUserId,
          newUserId: newUser.id,
        });
      }
      Alert.alert('Auth', `${t('auth.verified')}\n${migrationMessage}`);
      router.replace('/(tabs)/settings');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (__DEV__) {
        console.error('[supabase][authScreen] verify failed', error);
      }
      Alert.alert('Auth', `${t('auth.verifyFailed')}: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen scroll>
      <View style={styles.container}>
        <SectionHeader title={t('auth.title')} subtitle={t('auth.instructions')} />
        <Card>
          <TextField
            label={t('auth.emailLabel')}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <ButtonPrimary
            label={retryInSec > 0 ? t('auth.tryAgainIn', { seconds: retryInSec }) : t('auth.sendCode')}
            onPress={() => void onSendCode()}
            disabled={!canSendCode}
          />
          {codeSent ? (
            <>
              <TextField
                label={t('auth.codeLabel')}
                value={code}
                onChangeText={setCode}
                placeholder="123456"
                keyboardType="number-pad"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <ButtonPrimary
                label={t('auth.verify')}
                onPress={() => void onVerify()}
                disabled={isSubmitting}
              />
            </>
          ) : null}
          <Text style={styles.note}>{t('auth.instructions')}</Text>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.lg,
  },
  note: {
    color: colors.textMuted,
    fontSize: typography.bodySm,
    lineHeight: 20,
  },
});
