import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Card from '@/components/Card';
import CollapsibleCard from '@/components/CollapsibleCard';
import SectionTitle from '@/components/SectionTitle';
import { buildMatchReport } from '@/lib/content-engine/buildMatchReport';
import { toChartDataSwiss, toNormalizedAstroV2FromChart } from '@/lib/content-engine/chartAdapters';
import { buildBirthcodeSignals } from '@/lib/content-engine/psychoNarrative';
import { scoreMatch } from '@/lib/match-engine/scoreMatch';
import { useLocale } from '@/lib/i18n/useLocale';
import { useLocaleStore } from '@/store/useLocaleStore';
import { ButtonPrimary } from '@/src/components';
import { colors } from '@/src/theme/colors';
import { radius } from '@/src/theme/radius';
import { spacing } from '@/src/theme/spacing';
import { typography } from '@/src/theme/typography';
import { useBirthcodeStore } from '@/store/useBirthcodeStore';

type UiState = 'idle' | 'loading' | 'error' | 'success';

export default function MatchTab() {
  useLocale();
  const profiles = useBirthcodeStore((state) => state.profiles);
  const generateOrLoadAstroResult = useBirthcodeStore((state) => state.generateOrLoadAstroResult);
  const [profileAId, setProfileAId] = useState<string | null>(null);
  const [profileBId, setProfileBId] = useState<string | null>(null);
  const [uiState, setUiState] = useState<UiState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReturnType<typeof buildMatchReport> | null>(null);
  const [debugMeta, setDebugMeta] = useState<{ score: number; ids: string[] } | null>(null);

  useEffect(() => {
    if (!profileAId && profiles[0]) {
      setProfileAId(profiles[0].id);
    }
    if (!profileBId && profiles[1]) {
      setProfileBId(profiles[1].id);
    }
  }, [profileAId, profileBId, profiles]);

  const profileA = useMemo(() => profiles.find((item) => item.id === profileAId) ?? null, [profiles, profileAId]);
  const profileB = useMemo(() => profiles.find((item) => item.id === profileBId) ?? null, [profiles, profileBId]);

  const runMatch = async () => {
    setError(null);
    setResult(null);
    setDebugMeta(null);

    if (!profileAId || !profileBId) {
      setUiState('error');
      setError('Wybierz dwie osoby.');
      return;
    }
    if (profileAId === profileBId) {
      setUiState('error');
      setError('Wybierz dwa różne profile.');
      return;
    }

    setUiState('loading');
    try {
      const aCurrent = useBirthcodeStore.getState().profiles.find((item) => item.id === profileAId) ?? null;
      const bCurrent = useBirthcodeStore.getState().profiles.find((item) => item.id === profileBId) ?? null;
      if (!aCurrent || !bCurrent) {
        throw new Error('Nie znaleziono wybranych profili.');
      }

      if (!aCurrent.astroResult) {
        await generateOrLoadAstroResult(profileAId);
      }
      if (!bCurrent.astroResult) {
        await generateOrLoadAstroResult(profileBId);
      }

      const aReady = useBirthcodeStore.getState().profiles.find((item) => item.id === profileAId) ?? null;
      const bReady = useBirthcodeStore.getState().profiles.find((item) => item.id === profileBId) ?? null;
      if (!aReady?.astroResult || !bReady?.astroResult) {
        throw new Error('Nie udało się przygotować danych astro dla obu profili.');
      }

      // Derive BirthcodeSignals for signal-enhanced scoring
      const signalsA = buildBirthcodeSignals(toNormalizedAstroV2FromChart(aReady.astroResult.chart));
      const signalsB = buildBirthcodeSignals(toNormalizedAstroV2FromChart(bReady.astroResult.chart));

      const currentLang = useLocaleStore.getState().language;
      const score = scoreMatch({
        lang: currentLang,
        profileA: toChartDataSwiss(aReady.astroResult.chart),
        profileB: toChartDataSwiss(bReady.astroResult.chart),
        signalsA,
        signalsB,
      });
      const report = buildMatchReport({
        lang: currentLang,
        profileA: toChartDataSwiss(aReady.astroResult.chart),
        profileB: toChartDataSwiss(bReady.astroResult.chart),
        matchScore: score.score100,
        breakdownMeta: score.breakdown,
        pairLabel: `${aReady.label} × ${bReady.label}`,
      });
      setResult(report);
      setDebugMeta({
        score: score.score100,
        ids: score.breakdown.map((item) => item.id),
      });
      setUiState('success');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Nie udało się wygenerować raportu.';
      setError(message);
      setUiState('error');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <SectionTitle title="MATCH" subtitle="Raport dopasowania pary" />
          <Card>
            <SectionTitle title="Profil A" />
            <View style={styles.chips}>
              {profiles.map((profile) => (
                <Pressable
                  key={`a-${profile.id}`}
                  style={[styles.chip, profileAId === profile.id && styles.chipActive]}
                  onPress={() => setProfileAId(profile.id)}>
                  <Text style={[styles.chipText, profileAId === profile.id && styles.chipTextActive]}>
                    {profile.label}
                  </Text>
                </Pressable>
              ))}
            </View>
            <SectionTitle title="Profil B" />
            <View style={styles.chips}>
              {profiles.map((profile) => (
                <Pressable
                  key={`b-${profile.id}`}
                  style={[styles.chip, profileBId === profile.id && styles.chipActive]}
                  onPress={() => setProfileBId(profile.id)}>
                  <Text style={[styles.chipText, profileBId === profile.id && styles.chipTextActive]}>
                    {profile.label}
                  </Text>
                </Pressable>
              ))}
            </View>
            <ButtonPrimary label={uiState === 'loading' ? 'Licze dopasowanie...' : 'Match'} onPress={() => void runMatch()} disabled={uiState === 'loading'} />

            {!profileAId || !profileBId ? <Text style={styles.hint}>Wybierz dwie osoby.</Text> : null}
            {profileAId && profileBId && profileAId === profileBId ? <Text style={styles.hint}>Wybierz dwa różne profile.</Text> : null}
            {uiState === 'error' && error ? (
              <View style={styles.stateBox}>
                <Text style={styles.errorText}>{error}</Text>
                <ButtonPrimary label="Spróbuj ponownie" onPress={() => void runMatch()} />
              </View>
            ) : null}
          </Card>

          {uiState === 'success' && result ? (
            <Card>
              <SectionTitle title={result.pairLabel} subtitle={`Score: ${result.score100}/100`} />
              {result.breakdown.map((item) => (
                <Text key={item.id} style={styles.text}>
                  {`${item.label}: ${item.points}/${item.maxPoints} — ${item.reason}`}
                </Text>
              ))}
              {result.sections.map((section) => (
                <CollapsibleCard key={section.id} title={section.title} defaultExpanded={section.id === 'overall'}>
                  {section.paragraphs.map((paragraph, index) => (
                    <Text key={`${section.id}-${index}`} style={styles.text}>{paragraph}</Text>
                  ))}
                </CollapsibleCard>
              ))}
              {__DEV__ && debugMeta ? (
                <View style={styles.debugBox}>
                  <Text style={styles.debugText}>{`[DEBUG] score=${debugMeta.score}`}</Text>
                  <Text style={styles.debugText}>{`[DEBUG] breakdown=${debugMeta.ids.join(', ')}`}</Text>
                </View>
              ) : null}
            </Card>
          ) : null}
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
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    backgroundColor: colors.bgSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chipActive: {
    borderColor: colors.accentStrong,
    backgroundColor: colors.cardElevated,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  chipTextActive: {
    color: colors.textPrimary,
  },
  text: {
    color: colors.textSecondary,
    fontSize: typography.bodySm,
    lineHeight: 22,
  },
  hint: {
    color: colors.textMuted,
    fontSize: typography.caption,
  },
  stateBox: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.bodySm,
  },
  debugBox: {
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.sm,
    backgroundColor: colors.bgSoft,
  },
  debugText: {
    color: colors.textMuted,
    fontSize: typography.caption,
  },
});
