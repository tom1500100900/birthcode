import { router } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SectionTitle from '@/components/SectionTitle';
import { buildBirthcodeReport } from '@/lib/content-engine/buildBirthcodeReport';
import { toNormalizedAstroV2FromChart } from '@/lib/content-engine/chartAdapters';
import { buildBirthcodeSignals } from '@/lib/content-engine/psychoNarrative';
import { useLocale } from '@/lib/i18n/useLocale';
import { ButtonPrimary } from '@/src/components';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';
import { typography } from '@/src/theme/typography';
import { selectActiveAstroResult, selectActiveProfile, useBirthcodeStore } from '@/store/useBirthcodeStore';

export default function BirthcodeTab() {
  useLocale();
  const activeProfile = useBirthcodeStore(selectActiveProfile);
  const astroResult = useBirthcodeStore(selectActiveAstroResult);
  const generateAstroResultForProfile = useBirthcodeStore((state) => state.generateAstroResultForProfile);
  const lang = 'pl';

  const report = useMemo(() => {
    if (!astroResult) {
      return null;
    }
    const normalized = toNormalizedAstroV2FromChart(astroResult.chart);
    const signals = buildBirthcodeSignals(normalized);
    return buildBirthcodeReport({
      lang,
      signals,
    });
  }, [astroResult, lang]);

  if (!activeProfile || !astroResult || !report) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.title}>Brak raportu Birthcode</Text>
          <Text style={styles.text}>Wybierz profil i wygeneruj dane astro.</Text>
          {activeProfile ? (
            <ButtonPrimary
              label="Generuj raport"
              onPress={() => void generateAstroResultForProfile(activeProfile.id)}
            />
          ) : (
            <ButtonPrimary label="Wybierz profil" onPress={() => router.push('/profiles')} />
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <SectionTitle title="BIRTHCODE" subtitle={activeProfile.label} />
          {report.header.archetype ? <Text style={styles.archetype}>{report.header.archetype}</Text> : null}

          {report.sections.map((section) => (
            <View key={section.id} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.paragraphs.map((paragraph, index) => (
                <Text key={`${section.id}-${index}`} style={styles.text}>{paragraph}</Text>
              ))}
            </View>
          ))}
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
  archetype: {
    color: colors.textPrimary,
    fontSize: typography.bodyLg,
    lineHeight: 24,
    fontWeight: '700',
  },
  section: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.bodyLg,
    lineHeight: 24,
    fontWeight: '700',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.titleMd,
    fontWeight: '700',
  },
  text: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 22,
  },
});