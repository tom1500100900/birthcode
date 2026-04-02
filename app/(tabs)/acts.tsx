import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Card from '@/components/Card';
import SectionTitle from '@/components/SectionTitle';
import { buildPractices } from '@/lib/content-engine/buildPractices';
import { toNormalizedAstroV2FromChart } from '@/lib/content-engine/chartAdapters';
import { calcMetrics, detectTensions } from '@/lib/content-engine/psychoNarrative';
import { categoryInsightHeader, toPolishInsightDisplay } from '@/lib/insights/plFallback';
import { useLocale } from '@/lib/i18n/useLocale';
import { ButtonPrimary } from '@/src/components';
import { colors } from '@/src/theme/colors';
import { radius } from '@/src/theme/radius';
import { spacing } from '@/src/theme/spacing';
import { typography } from '@/src/theme/typography';
import { selectActiveAstroResult, selectActiveProfile, useBirthcodeStore } from '@/store/useBirthcodeStore';
import type { InsightCategory } from '@/types/astro';

type PracticesFilter = 'all' | InsightCategory;

const CATEGORIES: InsightCategory[] = ['identity', 'career', 'relationships', 'stress'];
const FILTERS: PracticesFilter[] = ['all', ...CATEGORIES];

const FILTER_LABELS: Record<PracticesFilter, string> = {
  all: 'Wszystkie',
  identity: 'Tozsamosc',
  career: 'Kariera',
  relationships: 'Relacje',
  stress: 'Stres',
};

export default function PracticesTab() {
  useLocale();
  const activeProfile = useBirthcodeStore(selectActiveProfile);
  const astroResult = useBirthcodeStore(selectActiveAstroResult);
  const generateAstroResultForProfile = useBirthcodeStore((state) => state.generateAstroResultForProfile);
  const [filter, setFilter] = useState<PracticesFilter>('all');

  const cards = useMemo(() => {
    if (!astroResult) return [];
    const normalized = toNormalizedAstroV2FromChart(astroResult.chart);
    const metrics = calcMetrics(normalized);
    return buildPractices({
      lang: 'pl',
      metrics: metrics.metrics,
      tensions: detectTensions(metrics.metrics),
    });
  }, [astroResult]);

  const insightsByCategory = useMemo(() => {
    const out: Record<InsightCategory, { title: string; whyItMatters: string; questions: [string, string, string] }> = {
      identity: categoryInsightHeader('identity'),
      career: categoryInsightHeader('career'),
      relationships: categoryInsightHeader('relationships'),
      stress: categoryInsightHeader('stress'),
    };
    if (!astroResult) return out;
    for (let i = 0; i < CATEGORIES.length; i += 1) {
      const category = CATEGORIES[i];
      const source = astroResult.insights.find((item) => item.category === category);
      if (!source) continue;
      out[category] = toPolishInsightDisplay(source, astroResult.contentLocale !== 'pl');
    }
    return out;
  }, [astroResult]);

  const categoriesToRender = filter === 'all' ? CATEGORIES : [filter];

  if (!activeProfile || !astroResult) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.title}>Brak praktyk</Text>
          <Text style={styles.text}>Wygeneruj dane astro dla aktywnego profilu.</Text>
          {activeProfile ? (
            <ButtonPrimary
              label="Generuj dane"
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
          <SectionTitle title="Praktyki" subtitle="Wnioski i praktyki w jednym miejscu" />
          <View style={styles.filters}>
            {FILTERS.map((item) => (
              <Pressable
                key={item}
                style={[styles.filterChip, item === filter && styles.filterChipActive]}
                onPress={() => setFilter(item)}>
                <Text style={[styles.filterText, item === filter && styles.filterTextActive]}>{FILTER_LABELS[item]}</Text>
              </Pressable>
            ))}
          </View>

          {categoriesToRender.map((category) => {
            const categoryPractices = cards.filter((item) => item.category === category);
            const insight = insightsByCategory[category];
            return (
              <View key={category} style={styles.categoryStack}>
                <Card>
                  <SectionTitle title={insight.title} subtitle={FILTER_LABELS[category]} />
                  <Text style={styles.text}>{insight.whyItMatters}</Text>
                </Card>

                {categoryPractices.length === 0 ? (
                  <Card>
                    <Text style={styles.text}>Wkrotce wiecej praktyk w tej kategorii.</Text>
                  </Card>
                ) : (
                  categoryPractices.map((item) => (
                    <Card key={item.id}>
                      <SectionTitle
                        title={item.title}
                        subtitle={`${FILTER_LABELS[item.category]} • ${item.durationMin} min`}
                      />
                      <SectionTitle title="Kroki" />
                      {item.steps.map((step, index) => (
                        <Text key={`${item.id}-${index}`} style={styles.text}>{`${index + 1}. ${step}`}</Text>
                      ))}
                      <SectionTitle title="Oczekiwany efekt" />
                      <Text style={styles.text}>{item.expectedOutcome}</Text>
                    </Card>
                  ))
                )}
              </View>
            );
          })}
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
  categoryStack: {
    gap: spacing.md,
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
  text: {
    color: colors.textSecondary,
    fontSize: typography.bodySm,
    lineHeight: 22,
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
});
