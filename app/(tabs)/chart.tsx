import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Card from '@/components/Card';
import InfoSheet from '@/components/InfoSheet';
import Row from '@/components/Row';
import SectionTitle from '@/components/SectionTitle';
import { formatDegreeText, formatPlacementLabel } from '@/lib/astro/labels';
import { useLocale } from '@/lib/i18n/useLocale';
import { ButtonPrimary } from '@/src/components';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';
import { typography } from '@/src/theme/typography';
import { selectActiveAstroResult, selectActiveProfile, useBirthcodeStore } from '@/store/useBirthcodeStore';
import { PlanetPlacement } from '@/types/astro';

interface StateScreenProps {
  title: string;
  message: string;
}

interface InfoContent {
  title: string;
  message: string;
}

function StateScreen({ title, message }: StateScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.centered}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{message}</Text>
      </View>
    </SafeAreaView>
  );
}

function SectionHeaderWithInfo({
  title,
  onPressInfo,
}: {
  title: string;
  onPressInfo: () => void;
}) {
  return (
    <View style={styles.sectionHeaderRow}>
      <SectionTitle title={title} />
      <Pressable onPress={onPressInfo} hitSlop={8}>
        <Ionicons name="help-circle-outline" size={20} color={colors.textMuted} />
      </Pressable>
    </View>
  );
}

export default function ChartScreen() {
  const { t } = useLocale();
  const activeProfile = useBirthcodeStore(selectActiveProfile);
  const astroResult = useBirthcodeStore(selectActiveAstroResult);
  const isLoading = useBirthcodeStore((state) => state.isLoading);
  const error = useBirthcodeStore((state) => state.error);
  const generateAstroResultForProfile = useBirthcodeStore((state) => state.generateAstroResultForProfile);
  const [infoContent, setInfoContent] = useState<InfoContent | null>(null);

  const planetsInfo: InfoContent = {
    title: t('chart.info.planetsTitle'),
    message: t('chart.info.planetsMessage'),
  };

  const ascendantInfo: InfoContent = {
    title: t('chart.info.ascendantTitle'),
    message: t('chart.info.ascendantMessage'),
  };

  const aspectsInfo: InfoContent = {
    title: t('chart.info.aspectsTitle'),
    message: t('chart.info.aspectsMessage'),
  };

  const degreeInfo: InfoContent = {
    title: t('chart.info.degreesTitle'),
    message: t('chart.info.degreesMessage'),
  };

  if (isLoading) {
    return <StateScreen title={t('chart.loadingTitle')} message={t('chart.loadingMessage')} />;
  }

  if (error) {
    return <StateScreen title={t('chart.errorTitle')} message={error} />;
  }

  if (!astroResult) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.title}>{t('chart.emptyTitle')}</Text>
          <Text style={styles.body}>{t('chart.emptyMessage')}</Text>
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

  const ascendantPlacement: PlanetPlacement = {
    name: 'Ascendant',
    sign: astroResult.chart.ascendant.sign,
    degree: astroResult.chart.ascendant.degree,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <SectionTitle title={t('chart.title')} subtitle={t('chart.subtitle')} />

          <Card>
            <SectionHeaderWithInfo
              title={t('chart.ascendant')}
              onPressInfo={() => setInfoContent(ascendantInfo)}
            />
            <Row
              label={t('chart.ascendant')}
              value={formatPlacementLabel(ascendantPlacement)}
              subValue={formatDegreeText(ascendantPlacement.degree)}
            />
          </Card>

          <Card>
            <SectionHeaderWithInfo title={t('chart.planets')} onPressInfo={() => setInfoContent(planetsInfo)} />
            <Row
              label={astroResult.chart.sun.name}
              value={formatPlacementLabel(astroResult.chart.sun)}
              subValue={formatDegreeText(astroResult.chart.sun.degree)}
            />
            <Row
              label={astroResult.chart.moon.name}
              value={formatPlacementLabel(astroResult.chart.moon)}
              subValue={formatDegreeText(astroResult.chart.moon.degree)}
            />
            {astroResult.chart.planets.map((planet) => (
              <Row
                key={planet.name}
                label={planet.name}
                value={formatPlacementLabel(planet)}
                subValue={formatDegreeText(planet.degree)}
              />
            ))}
            <Pressable style={styles.inlineInfo} onPress={() => setInfoContent(degreeInfo)}>
              <Ionicons name="help-circle-outline" size={16} color={colors.textMuted} />
              <Text style={styles.inlineInfoText}>{t('chart.degreeHelp')}</Text>
            </Pressable>
          </Card>

          <Card>
            <SectionHeaderWithInfo title={t('chart.aspects')} onPressInfo={() => setInfoContent(aspectsInfo)} />
            {astroResult.chart.aspects.map((aspect, index) => (
              <Row
                key={`${aspect.from}-${aspect.to}-${index}`}
                label={t('chart.aspectLabel', { from: aspect.from, to: aspect.to })}
                value={aspect.type}
                subValue={t('chart.orbFormat', { value: aspect.orb.toFixed(2) })}
              />
            ))}
          </Card>

          <Card>
            <SectionTitle title={t('chart.dominants')} />
            <Row label={t('chart.element')} value={astroResult.chart.dominantElement} />
            <Row label={t('chart.modality')} value={astroResult.chart.dominantModality} />
          </Card>
        </View>
      </ScrollView>

      <InfoSheet
        visible={Boolean(infoContent)}
        title={infoContent?.title ?? ''}
        message={infoContent?.message ?? ''}
        onClose={() => setInfoContent(null)}
      />
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
  body: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 22,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  inlineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  inlineInfoText: {
    color: colors.textMuted,
    fontSize: typography.caption,
  },
});
