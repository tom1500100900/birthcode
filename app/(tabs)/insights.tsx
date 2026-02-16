import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import Card from '@/components/Card';
import CopyButton from '@/components/CopyButton';
import SectionTitle from '@/components/SectionTitle';
import { buildInsightCardText } from '@/lib/copy/textBuilders';
import { useLocale } from '@/lib/i18n/useLocale';
import { ButtonPrimary } from '@/src/components';
import { colors } from '@/src/theme/colors';
import { radius } from '@/src/theme/radius';
import { spacing } from '@/src/theme/spacing';
import { typography } from '@/src/theme/typography';
import { selectActiveAstroResult, selectActiveProfile, useBirthcodeStore } from '@/store/useBirthcodeStore';
import { InsightCategory, InsightItem } from '@/types/astro';

type InsightsFilter = 'all' | InsightCategory;

const CATEGORIES: InsightsFilter[] = ['all', 'identity', 'career', 'relationships', 'stress'];

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

export default function InsightsScreen() {
  const { t, language } = useLocale();
  const [filter, setFilter] = useState<InsightsFilter>('all');
  const activeProfile = useBirthcodeStore(selectActiveProfile);
  const astroResult = useBirthcodeStore(selectActiveAstroResult);
  const isLoading = useBirthcodeStore((state) => state.isLoading);
  const error = useBirthcodeStore((state) => state.error);
  const savedInsightIdsByProfile = useBirthcodeStore((state) => state.savedInsightIdsByProfile);
  const savedInsightIds = activeProfile ? savedInsightIdsByProfile[activeProfile.id] ?? [] : [];
  const toggleInsightSaved = useBirthcodeStore((state) => state.toggleInsightSaved);
  const generateAstroResultForProfile = useBirthcodeStore((state) => state.generateAstroResultForProfile);

  useEffect(() => {
    if (!activeProfile || !astroResult) {
      return;
    }
    if (astroResult.contentLocale === language) {
      return;
    }
    if (__DEV__) {
      console.log(`[insights] locale=${language}, regenerating content for profile=${activeProfile.id}`);
    }
    void generateAstroResultForProfile(activeProfile.id);
  }, [activeProfile, astroResult, generateAstroResultForProfile, language]);

  const filteredInsights = useMemo(() => {
    const insights = astroResult?.insights ?? [];
    if (filter === 'all') {
      return insights;
    }
    return insights.filter((item) => item.category === filter);
  }, [astroResult, filter]);

  if (isLoading) {
    return <StateScreen title={t('insights.loadingTitle')} message={t('insights.loadingMessage')} />;
  }

  if (error) {
    return <StateScreen title={t('insights.errorTitle')} message={error} />;
  }

  if (!astroResult) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.title}>{t('insights.emptyTitle')}</Text>
          <Text style={styles.text}>{t('insights.emptyMessage')}</Text>
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
          <SectionTitle title={t('insights.title')} subtitle={t('insights.subtitle')} />
          <Card>
            <Text style={styles.text}>{t('insights.intro')}</Text>
            <Text style={styles.textMuted}>{t('insights.staticLine')}</Text>
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
          <Text style={styles.savedHint}>{t('insights.savedHint')}</Text>

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

          {filteredInsights.length === 0 ? (
            <Card>
              <Text style={styles.text}>{t('insights.emptyFilter')}</Text>
            </Card>
          ) : (
            filteredInsights.map((item: InsightItem) => {
              const saved = savedInsightIds.includes(item.id);
              return (
                <Card key={item.id}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderTextWrap}>
                      <SectionTitle title={item.title} subtitle={t(`categories.${item.category}`)} />
                    </View>
                    <CopyButton textToCopy={buildInsightCardText(item)} />
                  </View>
                  <Text style={styles.text}>{item.whyItMatters}</Text>
                  <SectionTitle title={t('insights.questions')} />
                  {item.questions.map((question) => (
                    <Text key={question} style={styles.text}>- {question}</Text>
                  ))}

                  <View style={styles.footer}>
                    <Text style={styles.footerText}>{t('insights.footerHint')}</Text>
                    <Pressable
                      onPress={() => activeProfile && toggleInsightSaved(activeProfile.id, item.id)}
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
