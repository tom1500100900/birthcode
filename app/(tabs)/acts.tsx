import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import Card from '@/components/Card';
import CopyButton from '@/components/CopyButton';
import SectionTitle from '@/components/SectionTitle';
import { buildPracticeCardText } from '@/lib/copy/textBuilders';
import { useLocale } from '@/lib/i18n/useLocale';
import { ButtonPrimary } from '@/src/components';
import { colors } from '@/src/theme/colors';
import { radius } from '@/src/theme/radius';
import { spacing } from '@/src/theme/spacing';
import { typography } from '@/src/theme/typography';
import { selectActiveAstroResult, selectActiveProfile, useBirthcodeStore } from '@/store/useBirthcodeStore';
import { ActItem, InsightCategory } from '@/types/astro';

type ActsFilter = 'all' | InsightCategory;

const CATEGORIES: ActsFilter[] = ['all', 'identity', 'career', 'relationships', 'stress'];

interface StateScreenProps {
  title: string;
  message: string;
}

function StateScreen({ title, message }: StateScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.centered}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>{message}</Text>
      </View>
    </SafeAreaView>
  );
}

export default function ActsScreen() {
  const { t, language } = useLocale();
  const [filter, setFilter] = useState<ActsFilter>('all');
  const activeProfile = useBirthcodeStore(selectActiveProfile);
  const astroResult = useBirthcodeStore(selectActiveAstroResult);
  const isLoading = useBirthcodeStore((state) => state.isLoading);
  const error = useBirthcodeStore((state) => state.error);
  const savedPracticeIdsByProfile = useBirthcodeStore((state) => state.savedPracticeIdsByProfile);
  const savedPracticeIds = activeProfile ? savedPracticeIdsByProfile[activeProfile.id] ?? [] : [];
  const togglePracticeSaved = useBirthcodeStore((state) => state.togglePracticeSaved);
  const generateAstroResultForProfile = useBirthcodeStore((state) => state.generateAstroResultForProfile);

  useEffect(() => {
    if (!activeProfile || !astroResult) {
      return;
    }
    if (astroResult.contentLocale === language) {
      return;
    }
    if (__DEV__) {
      console.log(`[practices] locale=${language}, regenerating content for profile=${activeProfile.id}`);
    }
    void generateAstroResultForProfile(activeProfile.id);
  }, [activeProfile, astroResult, generateAstroResultForProfile, language]);

  const filteredActs = useMemo(() => {
    const acts = astroResult?.acts ?? [];
    if (filter === 'all') {
      return acts;
    }
    return acts.filter((item) => item.category === filter);
  }, [astroResult, filter]);

  if (isLoading) {
    return <StateScreen title={t('practices.loadingTitle')} message={t('practices.loadingMessage')} />;
  }

  if (error) {
    return <StateScreen title={t('practices.errorTitle')} message={error} />;
  }

  if (!astroResult) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.title}>{t('practices.emptyTitle')}</Text>
          <Text style={styles.text}>{t('practices.emptyMessage')}</Text>
          {activeProfile ? (
            <ButtonPrimary
              label={t('profile.generateNow')}
              onPress={() => void generateAstroResultForProfile(activeProfile.id)}
            />
          ) : null}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <SectionTitle title={t('practices.title')} subtitle={t('practices.subtitle')} />
          <Card>
            <Text style={styles.text}>{t('practices.intro')}</Text>
            <Text style={styles.textMuted}>{t('practices.staticLine')}</Text>
          </Card>
          <Card>
            <SectionTitle title={t('premium.dailyTitle')} />
            <Text style={styles.text}>{t('premium.dailyBody')}</Text>
            <View style={styles.dailyFooter}>
              <Pressable style={styles.dailyButton} onPress={() => router.push('/(tabs)/definitions')}>
                <Text style={styles.dailyButtonText}>{t('premium.learnMore')}</Text>
              </Pressable>
            </View>
          </Card>
          <Text style={styles.savedHint}>{t('practices.savedHint')}</Text>

          <View style={styles.filters}>
            {CATEGORIES.map((category) => {
              const active = category === filter;
              return (
                <Pressable
                  key={category}
                  onPress={() => setFilter(category)}
                  style={[styles.filterChip, active && styles.filterChipActive]}>
                  <Text style={[styles.filterText, active && styles.filterTextActive]}>
                    {t(`categories.${category}`)}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {filteredActs.length === 0 ? (
            <Card>
              <Text style={styles.text}>{t('practices.emptyFilter')}</Text>
            </Card>
          ) : (
            filteredActs.map((item: ActItem) => {
              const saved = savedPracticeIds.includes(item.id);
              return (
                <Card key={item.id}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderTextWrap}>
                      <SectionTitle
                        title={item.title}
                        subtitle={t('practices.durationLine', {
                          category: t(`categories.${item.category}`),
                          duration: item.durationMinutes,
                        })}
                      />
                    </View>
                    <CopyButton textToCopy={buildPracticeCardText(item)} />
                  </View>
                  <SectionTitle title={t('practices.steps')} />
                  {item.steps.map((step, index) => (
                    <Text key={`${item.id}-step-${index}`} style={styles.text}>
                      {index + 1}. {step}
                    </Text>
                  ))}
                  <SectionTitle title={t('practices.expectedOutcome')} />
                  <Text style={styles.text}>{item.expectedOutcome}</Text>

                  <View style={styles.footer}>
                    <Text style={styles.footerText}>{t('practices.footerHint')}</Text>
                    <Pressable
                      onPress={() => activeProfile && togglePracticeSaved(activeProfile.id, item.id)}
                      style={[styles.saveButton, saved && styles.saveButtonActive]}>
                      <Text style={styles.saveButtonText}>{saved ? t('common.saved') : t('common.save')}</Text>
                    </Pressable>
                  </View>
                </Card>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  container: {
    gap: spacing.lg,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.sm,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.titleMd,
    fontWeight: '700',
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    backgroundColor: colors.bgSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  filterChipActive: {
    borderColor: colors.accentStrong,
    backgroundColor: colors.cardElevated,
  },
  filterText: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  filterTextActive: {
    color: colors.textPrimary,
  },
  savedHint: {
    color: colors.textMuted,
    fontSize: typography.bodySm,
    lineHeight: 20,
  },
  textMuted: {
    color: colors.textMuted,
    fontSize: typography.bodySm,
    lineHeight: 20,
  },
  dailyFooter: {
    marginTop: spacing.sm,
    alignItems: 'flex-start',
  },
  dailyButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.bgSoft,
  },
  dailyButtonText: {
    color: colors.textPrimary,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  footer: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: typography.caption,
    flex: 1,
  },
  saveButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.bgSoft,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 72,
  },
  saveButtonActive: {
    borderColor: colors.accentStrong,
  },
  saveButtonText: {
    color: colors.textPrimary,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  text: {
    color: colors.textSecondary,
    fontSize: typography.bodySm,
    lineHeight: 22,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  cardHeaderTextWrap: {
    flex: 1,
  },
});
