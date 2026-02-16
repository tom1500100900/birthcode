import Ionicons from '@expo/vector-icons/Ionicons';
import * as Clipboard from 'expo-clipboard';
import { router, useNavigation } from 'expo-router';
import { useCallback, useLayoutEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CollapsibleCard from '@/components/CollapsibleCard';
import InfoSheet from '@/components/InfoSheet';
import Row from '@/components/Row';
import SectionTitle from '@/components/SectionTitle';
import { getDegreePhase } from '@/lib/astro/labels';
import { getContent } from '@/lib/content/contentRepo';
import { buildSimpleListText } from '@/lib/copy/textBuilders';
import { useLocale } from '@/lib/i18n/useLocale';
import { getElementMeaning, getModalityMeaning } from '@/lib/profile/dominantMeaning';
import { buildFullReport, buildSummaryReport } from '@/lib/reports/profileReport';
import { ButtonPrimary } from '@/src/components';
import { colors } from '@/src/theme/colors';
import { radius } from '@/src/theme/radius';
import { spacing } from '@/src/theme/spacing';
import { typography } from '@/src/theme/typography';
import { selectActiveAstroResult, selectActiveProfile, useBirthcodeStore } from '@/store/useBirthcodeStore';
import { AppLocale } from '@/store/useLocaleStore';
import { PlanetPlacement } from '@/types/astro';

interface StateScreenProps {
  title: string;
  message: string;
}

interface InfoContent {
  title: string;
  message: string;
}

const SIGN_LABELS: Record<string, { en: string; pl: string }> = {
  Aries: { en: 'Aries', pl: 'Baran' },
  Taurus: { en: 'Taurus', pl: 'Byk' },
  Gemini: { en: 'Gemini', pl: 'Bliznieta' },
  Cancer: { en: 'Cancer', pl: 'Rak' },
  Leo: { en: 'Leo', pl: 'Lew' },
  Virgo: { en: 'Virgo', pl: 'Panna' },
  Libra: { en: 'Libra', pl: 'Waga' },
  Scorpio: { en: 'Scorpio', pl: 'Skorpion' },
  Sagittarius: { en: 'Sagittarius', pl: 'Strzelec' },
  Capricorn: { en: 'Capricorn', pl: 'Koziorozec' },
  Aquarius: { en: 'Aquarius', pl: 'Wodnik' },
  Pisces: { en: 'Pisces', pl: 'Ryby' },
};

const ELEMENT_LABELS: Record<string, { en: string; pl: string }> = {
  Fire: { en: 'Fire', pl: 'Ogień' },
  Earth: { en: 'Earth', pl: 'Ziemia' },
  Air: { en: 'Air', pl: 'Powietrze' },
  Water: { en: 'Water', pl: 'Woda' },
};

const MODALITY_LABELS: Record<string, { en: string; pl: string }> = {
  Cardinal: { en: 'Cardinal', pl: 'Kardynalna' },
  Fixed: { en: 'Fixed', pl: 'Stala' },
  Mutable: { en: 'Mutable', pl: 'Zmienna' },
};

function safeArray<T>(value: T[] | undefined | null): T[] {
  return Array.isArray(value) ? value : [];
}

function localizeSign(sign: string, language: AppLocale): string {
  const entry = SIGN_LABELS[sign];
  return entry ? entry[language] : sign;
}

function localizeElement(element: string, language: AppLocale): string {
  const entry = ELEMENT_LABELS[element];
  return entry ? entry[language] : element;
}

function localizeModality(modality: string, language: AppLocale): string {
  const entry = MODALITY_LABELS[modality];
  return entry ? entry[language] : modality;
}

function localizePhase(phase: 'Early' | 'Mid' | 'Late', language: AppLocale): string {
  if (language === 'pl') {
    if (phase === 'Early') return 'Wczesny';
    if (phase === 'Mid') return 'Srodkowy';
    return 'Pozny';
  }
  return phase;
}

function formatLocalizedPlacement(placement: PlanetPlacement, language: AppLocale): string {
  return `${localizeSign(placement.sign, language)} - ${localizePhase(getDegreePhase(placement.degree), language)}`;
}

function formatLocalizedDegree(degree: number, language: AppLocale): string {
  return language === 'pl' ? `${degree.toFixed(1)} st.` : `${degree.toFixed(1)} deg`;
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

export default function ProfileScreen() {
  const { t, language } = useLocale();
  const content = getContent(language);
  const navigation = useNavigation();
  const activeProfile = useBirthcodeStore(selectActiveProfile);
  const astroResult = useBirthcodeStore(selectActiveAstroResult);
  const isLoading = useBirthcodeStore((state) => state.isLoading);
  const error = useBirthcodeStore((state) => state.error);
  const generateAstroResultForProfile = useBirthcodeStore((state) => state.generateAstroResultForProfile);
  const [infoContent, setInfoContent] = useState<InfoContent | null>(null);

  const bigThreeInfo: InfoContent = {
    title: t('profile.info.bigThreeTitle'),
    message: t('profile.info.bigThreeMessage'),
  };

  const dominantInfo: InfoContent = {
    title: t('profile.info.dominantTitle'),
    message: t('profile.info.dominantMessage'),
  };

  const degreeInfo: InfoContent = {
    title: t('profile.info.degreesTitle'),
    message: t('profile.info.degreesMessage'),
  };

  const shareSummary = useCallback(async () => {
    if (!activeProfile) {
      return;
    }
    await Clipboard.setStringAsync(buildSummaryReport(activeProfile));
  }, [activeProfile]);

  const shareText = useCallback(async (full: boolean) => {
    if (!activeProfile) {
      return;
    }
    const message = full ? buildFullReport(activeProfile) : buildSummaryReport(activeProfile);
    await Share.share({ message });
  }, [activeProfile]);

  const openShareActions = useCallback(() => {
    if (!activeProfile) {
      return;
    }
    Alert.alert(t('profile.shareTitle'), t('profile.shareSubtitle'), [
      { text: t('settings.cancel'), style: 'cancel' },
      { text: t('profile.copySummary'), onPress: () => void shareSummary() },
      { text: t('profile.shareSummary'), onPress: () => void shareText(false) },
      { text: t('profile.shareFullReport'), onPress: () => void shareText(true) },
    ]);
  }, [activeProfile, shareSummary, shareText, t]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={openShareActions} hitSlop={8} style={styles.shareButton}>
          <Ionicons name="share-social-outline" size={18} color={colors.textPrimary} />
        </Pressable>
      ),
    });
  }, [navigation, openShareActions]);

  if (isLoading) {
    return <StateScreen title={t('profile.loadingTitle')} message={t('profile.loadingMessage')} />;
  }

  if (error) {
    return <StateScreen title={t('profile.errorTitle')} message={error} />;
  }

  if (!activeProfile) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.title}>{t('profile.emptyTitle')}</Text>
          <Text style={styles.body}>{t('profile.emptyMessage')}</Text>
          <ButtonPrimary label={t('welcome.profiles')} onPress={() => router.push('/profiles')} />
        </View>
      </SafeAreaView>
    );
  }

  if (!astroResult) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.title}>{t('profile.emptyTitle')}</Text>
          <Text style={styles.body}>{t('profile.emptyForActive')}</Text>
          <ButtonPrimary
            label={t('profile.generateNow')}
            onPress={() => void generateAstroResultForProfile(activeProfile.id)}
          />
        </View>
      </SafeAreaView>
    );
  }

  const elementBalance = safeArray(astroResult.chart?.elementBalance);
  const modalityBalance = safeArray(astroResult.chart?.modalityBalance);

  const sunPlacement = astroResult.chart?.sun ?? { name: 'Sun', sign: t('profile.unknownLabel'), degree: 0 };
  const moonPlacement = astroResult.chart?.moon ?? { name: 'Moon', sign: t('profile.unknownLabel'), degree: 0 };
  const ascendantPlacement: PlanetPlacement = {
    name: 'Ascendant',
    sign: astroResult.chart?.ascendant?.sign ?? t('profile.unknownLabel'),
    degree: astroResult.chart?.ascendant?.degree ?? 0,
  };
  const dominantElementKey = getElementMeaning(astroResult.chart?.dominantElement ?? 'Fire');
  const dominantModalityKey = getModalityMeaning(astroResult.chart?.dominantModality ?? 'Cardinal');
  const elementMeaningLines = t(dominantElementKey).split('\n');
  const modalityMeaningLines = t(dominantModalityKey).split('\n');

  const bigThreeCopy = [
    t('profile.bigThree'),
    t('profile.bigThreeIntro'),
    '',
    `${t('profile.sun')}: ${formatLocalizedPlacement(sunPlacement, language)} (${formatLocalizedDegree(sunPlacement.degree, language)})`,
    t('profile.sunDescription'),
    '',
    `${t('profile.moon')}: ${formatLocalizedPlacement(moonPlacement, language)} (${formatLocalizedDegree(moonPlacement.degree, language)})`,
    t('profile.moonDescription'),
    '',
    `${t('profile.ascendant')}: ${formatLocalizedPlacement(ascendantPlacement, language)} (${formatLocalizedDegree(ascendantPlacement.degree, language)})`,
    t('profile.ascendantDescription'),
  ].join('\n');

  const dominantCopy = [
    t('profile.dominantUnifiedTitle'),
    '',
    t('profile.elementRanking'),
    ...elementBalance.map((item) => `${localizeElement(item.element, language)}: ${item.percentage.toFixed(1)}%`),
    '',
    t('profile.modalityRanking'),
    ...modalityBalance.map((item) => `${localizeModality(item.modality, language)}: ${item.percentage.toFixed(1)}%`),
    '',
    t('profile.whatThisMeans'),
    ...elementMeaningLines,
    ...modalityMeaningLines,
  ].join('\n');

  const traitsNarrative = content.getString('traits.profile.narrative');
  const strengths = content.getArray<string>('traits.profile.strengths');
  const risks = content.getArray<string>('traits.profile.risks');
  const recommendations = content.getArray<string>('traits.profile.recommendations');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <SectionTitle title={t('profile.title')} />
          <Text style={styles.intro}>{t('profile.intro')}</Text>
          <Pressable style={styles.activeProfilePill} onPress={() => router.push('/profiles')}>
            <Text style={styles.activeProfilePillText}>
              {t('profile.activeProfile', { label: activeProfile?.label ?? '-' })}
            </Text>
          </Pressable>

          <CollapsibleCard
            title={t('profile.bigThree')}
            copyText={bigThreeCopy}
            onPressInfo={() => setInfoContent(bigThreeInfo)}>
            <Text style={styles.body}>{t('profile.bigThreeIntro')}</Text>
            <Text style={styles.inlineHint}>{t('profile.bigThreeLayeredIntro')}</Text>
            <Row
              label={t('profile.sun')}
              value={formatLocalizedPlacement(sunPlacement, language)}
              subValue={formatLocalizedDegree(sunPlacement.degree, language)}
            />
            <Text style={styles.inlineHint}>{t('profile.sunDescription')}</Text>
            <Row
              label={t('profile.moon')}
              value={formatLocalizedPlacement(moonPlacement, language)}
              subValue={formatLocalizedDegree(moonPlacement.degree, language)}
            />
            <Text style={styles.inlineHint}>{t('profile.moonDescription')}</Text>
            <Row
              label={t('profile.ascendant')}
              value={formatLocalizedPlacement(ascendantPlacement, language)}
              subValue={formatLocalizedDegree(ascendantPlacement.degree, language)}
            />
            <Text style={styles.inlineHint}>{t('profile.ascendantDescription')}</Text>
            <Pressable style={styles.inlineInfo} onPress={() => setInfoContent(degreeInfo)}>
              <Ionicons name="help-circle-outline" size={16} color={colors.textMuted} />
              <Text style={styles.inlineInfoText}>{t('profile.degreeHelp')}</Text>
            </Pressable>
          </CollapsibleCard>

          <CollapsibleCard
            title={t('profile.dominantUnifiedTitle')}
            copyText={dominantCopy}
            onPressInfo={() => setInfoContent(dominantInfo)}>
            <SectionTitle title={t('profile.elementRanking')} />
            {elementBalance.map((item, index) => (
              <Row
                key={item.element}
                label={`${localizeElement(item.element, language)}${index === 0 ? ` (${t('profile.dominantTag')})` : ''}`}
                value={`${item.percentage.toFixed(1)}%`}
              />
            ))}
            <SectionTitle title={t('profile.modalityRanking')} />
            {modalityBalance.map((item, index) => (
              <Row
                key={item.modality}
                label={`${localizeModality(item.modality, language)}${index === 0 ? ` (${t('profile.dominantTag')})` : ''}`}
                value={`${item.percentage.toFixed(1)}%`}
              />
            ))}
            <SectionTitle title={t('profile.whatThisMeans')} />
            <Text style={styles.blockTitle}>{t('profile.elementMeaningTitle')}</Text>
            {elementMeaningLines.map((line, index) => (
              <Text key={`element-${index}`} style={styles.body}>- {line}</Text>
            ))}
            <Text style={styles.blockTitle}>{t('profile.modalityMeaningTitle')}</Text>
            {modalityMeaningLines.map((line, index) => (
              <Text key={`modality-${index}`} style={styles.body}>- {line}</Text>
            ))}
          </CollapsibleCard>

          <CollapsibleCard title={t('profile.traits')} copyText={traitsNarrative}>
            <Text style={styles.body}>{traitsNarrative}</Text>
          </CollapsibleCard>

          <CollapsibleCard
            title={t('profile.strengths')}
            copyText={buildSimpleListText(t('profile.strengths'), strengths)}>
            {strengths.length > 0 ? strengths.map((item, index) => (
              <Text key={`strength-${index}`} style={styles.body}>- {item}</Text>
            )) : <Text style={styles.body}>{t('profile.noData')}</Text>}
          </CollapsibleCard>

          <CollapsibleCard
            title={t('profile.risks')}
            copyText={buildSimpleListText(t('profile.risks'), risks)}>
            {risks.length > 0 ? risks.map((item, index) => (
              <Text key={`risk-${index}`} style={styles.body}>- {item}</Text>
            )) : <Text style={styles.body}>{t('profile.noData')}</Text>}
          </CollapsibleCard>

          <CollapsibleCard
            title={t('profile.recommendations')}
            copyText={buildSimpleListText(t('profile.recommendations'), recommendations)}>
            {recommendations.length > 0 ? recommendations.map((item, index) => (
              <Text key={`recommendation-${index}`} style={styles.body}>- {item}</Text>
            )) : <Text style={styles.body}>{t('profile.noData')}</Text>}
          </CollapsibleCard>
          <Text style={styles.disclaimer}>{t('profile.disclaimer')}</Text>
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
  intro: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 22,
  },
  shareButton: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgSoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginRight: spacing.xs,
  },
  activeProfilePill: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgSoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignSelf: 'flex-start',
  },
  activeProfilePillText: {
    color: colors.textSecondary,
    fontSize: typography.bodySm,
    fontWeight: '700',
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
  inlineHint: {
    color: colors.textMuted,
    fontSize: typography.bodySm,
    lineHeight: 20,
    marginTop: -spacing.xs,
  },
  blockTitle: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '700',
  },
  body: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 22,
  },
  disclaimer: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 18,
  },
});
