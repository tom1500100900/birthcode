import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useLocale } from '@/lib/i18n/useLocale';
import { ButtonPrimary, ButtonSecondary, Card, Screen } from '@/src/components';
import { radius } from '@/src/theme/radius';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';
import { typography } from '@/src/theme/typography';
import { selectActiveProfile, useBirthcodeStore } from '@/store/useBirthcodeStore';

const LOGO_SOURCE = require('../assets/logo-mark.png');

export default function WelcomeScreen() {
  const { t, language, setLanguage } = useLocale();
  const [hideLogoImage, setHideLogoImage] = useState(false);
  const profiles = useBirthcodeStore((state) => state.profiles);
  const activeProfile = useBirthcodeStore(selectActiveProfile);
  const hasProfiles = profiles.length > 0;

  const openLanguageSelector = () => {
    Alert.alert(t('settings.languageTitle'), t('settings.languageSubtitle', {
      language: language === 'en' ? t('settings.languageEnglish') : t('settings.languagePolish'),
    }), [
      { text: t('settings.cancel'), style: 'cancel' },
      { text: t('settings.languageEnglish'), onPress: () => void setLanguage('en') },
      { text: t('settings.languagePolish'), onPress: () => void setLanguage('pl') },
    ]);
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <Pressable style={styles.languageButton} onPress={openLanguageSelector}>
            <Ionicons name="language-outline" size={18} color={colors.textPrimary} />
          </Pressable>
        </View>
        <View style={styles.hero}>
          {hideLogoImage ? (
            <View style={styles.logoFallback}>
              <Text style={styles.logoFallbackText}>&gt;_</Text>
            </View>
          ) : (
            <Image source={LOGO_SOURCE} onError={() => setHideLogoImage(true)} style={styles.logo} />
          )}
          <Text style={styles.wordmark}>{t('welcome.title')}</Text>
          <Text style={styles.brandline}>{t('welcome.brandline')}</Text>
          <Text style={styles.subtitle}>{t('welcome.subtitle')}</Text>
        </View>
        <Card>
          <Text style={styles.body}>{t('welcome.body')}</Text>
          {hasProfiles ? (
            <Text style={styles.activeProfileLine}>
              {t('welcome.activeProfile', { label: activeProfile?.label ?? '-' })}
            </Text>
          ) : null}
        </Card>
        <View style={styles.actions}>
          <ButtonPrimary
            label={hasProfiles ? t('welcome.open') : t('welcome.createFirstProfile')}
            onPress={() => router.push(hasProfiles ? '/(tabs)/profile' : '/onboarding')}
          />
          <ButtonSecondary label={t('welcome.profiles')} onPress={() => router.push('/profiles')} />
          <ButtonSecondary label={t('welcome.language')} onPress={openLanguageSelector} />
          <ButtonSecondary label={t('welcome.whatIsThis')} onPress={() => router.push('/(tabs)/definitions')} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.xl,
    maxWidth: 640,
    width: '100%',
    alignSelf: 'center',
  },
  hero: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  topRow: {
    alignItems: 'flex-end',
  },
  languageButton: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgSoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  logo: {
    width: 84,
    height: 84,
    borderRadius: 20,
  },
  logoFallback: {
    width: 84,
    height: 84,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoFallbackText: {
    color: colors.accentStrong,
    fontSize: typography.titleLg,
    fontWeight: '700',
  },
  wordmark: {
    color: colors.textPrimary,
    fontSize: typography.titleLg,
    fontWeight: '800',
    letterSpacing: 5,
    textTransform: 'uppercase',
    textShadowColor: colors.glow,
    textShadowRadius: 12,
    textShadowOffset: { width: 0, height: 0 },
  },
  brandline: {
    color: colors.accent,
    fontSize: typography.caption,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 22,
    textAlign: 'center',
  },
  body: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 22,
  },
  activeProfileLine: {
    marginTop: spacing.sm,
    color: colors.textMuted,
    fontSize: typography.bodySm,
  },
  actions: {
    gap: spacing.md,
  },
});
