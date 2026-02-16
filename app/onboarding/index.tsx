import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useLocale } from '@/lib/i18n/useLocale';
import { ButtonPrimary, Card, Screen, SectionHeader, TextField } from '@/src/components';
import { colors } from '@/src/theme/colors';
import { radius } from '@/src/theme/radius';
import { spacing } from '@/src/theme/spacing';
import { typography } from '@/src/theme/typography';
import { selectActiveProfile, useBirthcodeStore } from '@/store/useBirthcodeStore';
import { BirthInput } from '@/types/astro';

interface OnboardingFormState {
  label: string;
  date: string;
  time: string;
  place: string;
  latitude: string;
  longitude: string;
  timezone: string;
}

function isValidDate(dateText: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateText);
}

function isValidTime(timeText: string): boolean {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(timeText);
}

function isNumeric(value: string): boolean {
  const parsed = Number(value);
  return Number.isFinite(parsed);
}

function hasText(value: string): boolean {
  return value.trim().length > 0;
}

function toBirthInput(form: OnboardingFormState): BirthInput {
  const includeCoordinates = hasText(form.latitude) && hasText(form.longitude);
  return {
    date: form.date,
    time: form.time,
    place: form.place.trim(),
    latitude: includeCoordinates ? Number(form.latitude) : undefined,
    longitude: includeCoordinates ? Number(form.longitude) : undefined,
    timezone: form.timezone,
  };
}

function toFormState(profileLabel: string, input: BirthInput): OnboardingFormState {
  return {
    label: profileLabel,
    date: input.date,
    time: input.time,
    place: input.place,
    latitude: input.latitude !== undefined ? String(input.latitude) : '',
    longitude: input.longitude !== undefined ? String(input.longitude) : '',
    timezone: input.timezone,
  };
}

export default function OnboardingScreen() {
  const { t } = useLocale();
  const activeProfile = useBirthcodeStore(selectActiveProfile);
  const [form, setForm] = useState<OnboardingFormState>({
    label: activeProfile?.label ?? '',
    date: '',
    time: '',
    place: '',
    latitude: '',
    longitude: '',
    timezone: 'UTC',
  });
  const [mode, setMode] = useState<'create' | 'update'>(activeProfile ? 'update' : 'create');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const createProfile = useBirthcodeStore((state) => state.createProfile);
  const updateProfileBirthInput = useBirthcodeStore((state) => state.updateProfileBirthInput);
  const updateProfileLabel = useBirthcodeStore((state) => state.updateProfileLabel);
  const generateAstroResultForProfile = useBirthcodeStore((state) => state.generateAstroResultForProfile);
  const isLoading = useBirthcodeStore((state) => state.isLoading);
  const error = useBirthcodeStore((state) => state.error);
  const clearError = useBirthcodeStore((state) => state.clearError);

  useEffect(() => {
    if (!activeProfile) {
      return;
    }
    setForm((previous) => ({
      ...previous,
      label: previous.label || activeProfile.label,
    }));
  }, [activeProfile]);

  const formError = useMemo(() => {
    if (!hasText(form.label)) return t('onboarding.errors.labelRequired');
    if (!isValidDate(form.date)) return t('onboarding.errors.dateFormat');
    if (!isValidTime(form.time)) return t('onboarding.errors.timeFormat');
    if (!hasText(form.place)) return t('onboarding.errors.placeRequired');
    if (!form.timezone.trim()) return t('onboarding.errors.timezoneRequired');
    const hasLatitude = hasText(form.latitude);
    const hasLongitude = hasText(form.longitude);
    if (hasLatitude !== hasLongitude) return t('onboarding.errors.coordinatesBoth');
    if (hasLatitude && !isNumeric(form.latitude)) return t('onboarding.errors.latitudeNumber');
    if (hasLongitude && !isNumeric(form.longitude)) return t('onboarding.errors.longitudeNumber');
    return '';
  }, [form.date, form.label, form.latitude, form.longitude, form.place, form.time, form.timezone, t]);

  const isSubmitDisabled = Boolean(formError) || isLoading || submitting;

  const onSubmit = async () => {
    if (isSubmitDisabled) {
      return;
    }
    setSubmitting(true);
    clearError();
    try {
      const payload = toBirthInput(form);
      let targetProfileId = activeProfile?.id ?? null;

      if (mode === 'update' && activeProfile) {
        updateProfileBirthInput(activeProfile.id, payload);
        updateProfileLabel(activeProfile.id, form.label);
        targetProfileId = activeProfile.id;
      } else {
        targetProfileId = createProfile(form.label, payload);
      }

      if (!targetProfileId) {
        return;
      }

      await generateAstroResultForProfile(targetProfileId);
      const state = useBirthcodeStore.getState();
      const generated = state.profiles.find((item) => item.id === targetProfileId)?.astroResult;
      if (generated) {
        router.replace('/(tabs)/profile');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen scroll>
      <View style={styles.container}>
        <SectionHeader
          title={t('onboarding.title')}
          subtitle={t('onboarding.subtitle')}
        />
        <Card>
          {activeProfile ? (
            <View style={styles.modeRow}>
              <Pressable
                style={[styles.modeButton, mode === 'create' && styles.modeButtonActive]}
                onPress={() => setMode('create')}>
                <Text style={styles.modeButtonText}>{t('onboarding.modeCreate')}</Text>
              </Pressable>
              <Pressable
                style={[styles.modeButton, mode === 'update' && styles.modeButtonActive]}
                onPress={() => {
                  setMode('update');
                  setForm(toFormState(activeProfile.label, activeProfile.birthInput));
                }}>
                <Text style={styles.modeButtonText}>{t('onboarding.modeUpdate')}</Text>
              </Pressable>
            </View>
          ) : null}
          <TextField
            label={t('onboarding.profileNameLabel')}
            placeholder={t('onboarding.profileNamePlaceholder')}
            autoCapitalize="words"
            value={form.label}
            onChangeText={(value) => setForm((previous) => ({ ...previous, label: value }))}
          />
          <TextField
            label={t('onboarding.dateLabel')}
            placeholder={t('onboarding.datePlaceholder')}
            autoCapitalize="none"
            value={form.date}
            onChangeText={(value) => setForm((previous) => ({ ...previous, date: value }))}
          />
          <TextField
            label={t('onboarding.timeLabel')}
            placeholder={t('onboarding.timePlaceholder')}
            autoCapitalize="none"
            value={form.time}
            onChangeText={(value) => setForm((previous) => ({ ...previous, time: value }))}
          />
          <TextField
            label={t('onboarding.placeLabel')}
            placeholder={t('onboarding.placePlaceholder')}
            autoCapitalize="words"
            value={form.place}
            onChangeText={(value) => setForm((previous) => ({ ...previous, place: value }))}
          />
          <TextField
            label={t('onboarding.timezoneLabel')}
            placeholder={t('onboarding.timezonePlaceholder')}
            autoCapitalize="none"
            value={form.timezone}
            onChangeText={(value) => setForm((previous) => ({ ...previous, timezone: value }))}
          />
          <Pressable
            style={styles.advancedToggle}
            onPress={() => setShowAdvanced((previous) => !previous)}>
            <Text style={styles.advancedToggleText}>
              {showAdvanced ? t('onboarding.advancedHide') : t('onboarding.advancedShow')}
            </Text>
          </Pressable>
          {showAdvanced ? (
            <View style={styles.advancedContent}>
              <TextField
                label={t('onboarding.latitudeLabel')}
                placeholder={t('onboarding.latitudePlaceholder')}
                autoCapitalize="none"
                keyboardType="numeric"
                value={form.latitude}
                onChangeText={(value) => setForm((previous) => ({ ...previous, latitude: value }))}
              />
              <TextField
                label={t('onboarding.longitudeLabel')}
                placeholder={t('onboarding.longitudePlaceholder')}
                autoCapitalize="none"
                keyboardType="numeric"
                value={form.longitude}
                onChangeText={(value) => setForm((previous) => ({ ...previous, longitude: value }))}
              />
            </View>
          ) : null}
          {formError ? <Text style={styles.error}>{formError}</Text> : null}
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <View style={styles.action}>
            <ButtonPrimary
              label={isLoading || submitting ? t('onboarding.generating') : t('onboarding.generate')}
              onPress={() => void onSubmit()}
              disabled={isSubmitDisabled}
            />
          </View>
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
  action: {
    marginTop: spacing.md,
  },
  modeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  modeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.bgSoft,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  modeButtonActive: {
    borderColor: colors.accentStrong,
    backgroundColor: colors.cardElevated,
  },
  modeButtonText: {
    color: colors.textPrimary,
    fontSize: typography.bodySm,
    fontWeight: '700',
  },
  advancedToggle: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.bgSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  advancedToggleText: {
    color: colors.textSecondary,
    fontSize: typography.bodySm,
    fontWeight: '600',
  },
  advancedContent: {
    gap: spacing.sm,
  },
  error: {
    color: colors.danger,
    fontSize: typography.bodySm,
  },
});
