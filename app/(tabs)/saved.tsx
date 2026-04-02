import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Card from '@/components/Card';
import CopyButton from '@/components/CopyButton';
import SectionTitle from '@/components/SectionTitle';
import { buildInsightCardText, buildPracticeCardText } from '@/lib/copy/textBuilders';
import { useLocale } from '@/lib/i18n/useLocale';
import { ButtonPrimary } from '@/src/components';
import { colors } from '@/src/theme/colors';
import { radius } from '@/src/theme/radius';
import { spacing } from '@/src/theme/spacing';
import { typography } from '@/src/theme/typography';
import { selectActiveAstroResult, selectActiveProfile, useBirthcodeStore } from '@/store/useBirthcodeStore';

type SavedFilter = 'all' | 'insights' | 'practices';
type SavedItem = {
  id: string;
  type: 'insight' | 'practice';
  title: string;
  subtitle: string;
  detailLines: string[];
  copyText: string;
};

const FILTERS: SavedFilter[] = ['all', 'insights', 'practices'];

export default function SavedScreen() {
  const { t } = useLocale();
  const [filter, setFilter] = useState<SavedFilter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const activeProfile = useBirthcodeStore(selectActiveProfile);
  const astroResult = useBirthcodeStore(selectActiveAstroResult);
  const isLoading = useBirthcodeStore((state) => state.isLoading);
  const error = useBirthcodeStore((state) => state.error);
  const savedInsightIdsByProfile = useBirthcodeStore((state) => state.savedInsightIdsByProfile);
  const savedPracticeIdsByProfile = useBirthcodeStore((state) => state.savedPracticeIdsByProfile);
  const toggleInsightSaved = useBirthcodeStore((state) => state.toggleInsightSaved);
  const togglePracticeSaved = useBirthcodeStore((state) => state.togglePracticeSaved);
  const generateAstroResultForProfile = useBirthcodeStore((state) => state.generateAstroResultForProfile);

  const savedInsightIds = useMemo(
    () => (activeProfile ? savedInsightIdsByProfile[activeProfile.id] ?? [] : []),
    [activeProfile, savedInsightIdsByProfile]
  );
  const savedPracticeIds = useMemo(
    () => (activeProfile ? savedPracticeIdsByProfile[activeProfile.id] ?? [] : []),
    [activeProfile, savedPracticeIdsByProfile]
  );

  const savedItems = useMemo(() => {
    if (!astroResult) {
      return [] as SavedItem[];
    }

    const insights: SavedItem[] = astroResult.insights
      .filter((item) => savedInsightIds.includes(item.id))
      .map((item) => ({
        id: item.id,
        type: 'insight',
        title: item.title,
        subtitle: t(`categories.${item.category}`),
        detailLines: [item.whyItMatters, ...item.questions.map((question) => `- ${question}`)],
        copyText: buildInsightCardText(item),
      }));

    const practices: SavedItem[] = astroResult.acts
      .filter((item) => savedPracticeIds.includes(item.id))
      .map((item) => ({
        id: item.id,
        type: 'practice',
        title: item.title,
        subtitle: t(`categories.${item.category}`),
        detailLines: [
          t('saved.duration', { duration: item.durationMinutes }),
          ...item.steps.map((step, index) => `${index + 1}. ${step}`),
          `${t('saved.expectedOutcome')}: ${item.expectedOutcome}`,
        ],
        copyText: buildPracticeCardText(item),
      }));

    return [...insights, ...practices];
  }, [astroResult, savedInsightIds, savedPracticeIds, t]);

  const filteredItems = useMemo(() => {
    if (filter === 'all') {
      return savedItems;
    }
    if (filter === 'insights') {
      return savedItems.filter((item) => item.type === 'insight');
    }
    return savedItems.filter((item) => item.type === 'practice');
  }, [filter, savedItems]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.title}>{t('saved.loadingTitle')}</Text>
          <Text style={styles.text}>{t('saved.loadingMessage')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.title}>{t('saved.errorTitle')}</Text>
          <Text style={styles.text}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!astroResult) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.title}>{t('saved.emptyTitle')}</Text>
          <Text style={styles.text}>{t('saved.emptyMessage')}</Text>
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
          <SectionTitle title={t('saved.title')} subtitle={t('saved.subtitle')} />

          <View style={styles.filters}>
            {FILTERS.map((item) => {
              const active = item === filter;
              return (
                <Pressable
                  key={item}
                  onPress={() => setFilter(item)}
                  style={[styles.filterChip, active && styles.filterChipActive]}>
                  <Text style={[styles.filterText, active && styles.filterTextActive]}>
                    {t(`saved.filters.${item}`)}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {filteredItems.length === 0 ? (
            <Card>
              <Text style={styles.text}>{t('saved.none')}</Text>
            </Card>
          ) : (
            filteredItems.map((item) => {
              const expanded = expandedId === item.id;
              const badgeStyle = item.type === 'insight' ? styles.insightBadge : styles.practiceBadge;
              return (
                <Card key={`${item.type}-${item.id}`}>
                  <Pressable onPress={() => setExpandedId(expanded ? null : item.id)} style={styles.itemHeader}>
                    <View style={styles.headerTextWrap}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                    </View>
                    <View style={styles.itemHeaderRight}>
                      <View style={[styles.badge, badgeStyle]}>
                        <Text style={styles.badgeText}>
                          {item.type === 'insight' ? t('saved.badges.insight') : t('saved.badges.practice')}
                        </Text>
                      </View>
                      <CopyButton textToCopy={item.copyText} />
                    </View>
                  </Pressable>

                  {expanded ? (
                    <View style={styles.detailBlock}>
                      {item.detailLines.map((line, index) => (
                        <Text key={`${item.id}-${index}`} style={styles.text}>{line}</Text>
                      ))}
                    </View>
                  ) : null}

                  <View style={styles.footer}>
                    <Text style={styles.footerHint}>{t('saved.tapToExpand')}</Text>
                    <Pressable
                      style={styles.removeButton}
                      onPress={() => {
                        if (!activeProfile) {
                          return;
                        }
                        if (item.type === 'insight') {
                          toggleInsightSaved(activeProfile.id, item.id);
                        } else {
                          togglePracticeSaved(activeProfile.id, item.id);
                        }
                      }}>
                      <Text style={styles.removeButtonText}>{t('saved.remove')}</Text>
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
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  headerTextWrap: {
    flex: 1,
    gap: spacing.xs,
  },
  itemHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  itemTitle: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '700',
  },
  itemSubtitle: {
    color: colors.textMuted,
    fontSize: typography.caption,
  },
  badge: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  insightBadge: {
    backgroundColor: '#2d8dff',
  },
  practiceBadge: {
    backgroundColor: '#8f65ff',
  },
  badgeText: {
    color: colors.textPrimary,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  detailBlock: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  footer: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  footerHint: {
    color: colors.textMuted,
    fontSize: typography.caption,
    flex: 1,
  },
  removeButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.bgSoft,
    minWidth: 80,
    alignItems: 'center',
  },
  removeButtonText: {
    color: colors.textPrimary,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  text: {
    color: colors.textSecondary,
    fontSize: typography.bodySm,
    lineHeight: 22,
  },
});
