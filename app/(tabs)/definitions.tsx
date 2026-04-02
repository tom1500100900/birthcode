import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Card from '@/components/Card';
import SectionTitle from '@/components/SectionTitle';
import { getContent, tContent } from '@/lib/content/contentRepo';
import { useLocale } from '@/lib/i18n/useLocale';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';
import { typography } from '@/src/theme/typography';

export default function DefinitionsScreen() {
  const { language, setLanguage, t } = useLocale();
  const content = getContent(language);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <SectionTitle
            title={content.getString('definitions.screen.title')}
            subtitle={content.getString('definitions.screen.subtitle')}
          />
          <Card>
            <SectionTitle title={content.getString('definitions.intro.title')} />
            <Text style={styles.text}>{content.getString('definitions.intro.body')}</Text>
          </Card>
          <Card>
            <SectionTitle title={t('settings.languageTitle')} />
            <View style={styles.languageRow}>
              <Pressable
                style={[styles.languageButton, language === 'en' && styles.languageButtonActive]}
                onPress={() => void setLanguage('en')}>
                <Text style={styles.languageButtonText}>{t('settings.languageEnglish')}</Text>
              </Pressable>
              <Pressable
                style={[styles.languageButton, language === 'pl' && styles.languageButtonActive]}
                onPress={() => void setLanguage('pl')}>
                <Text style={styles.languageButtonText}>{t('settings.languagePolish')}</Text>
              </Pressable>
            </View>
          </Card>

          <Card>
            <SectionTitle title={tContent('definitions.big_three.title', language)} />
            <Text style={styles.text}>{tContent('definitions.big_three.body', language)}</Text>
            <Text style={styles.text}>{tContent('definitions.big_three.sun', language)}</Text>
            <Text style={styles.text}>{tContent('definitions.big_three.moon', language)}</Text>
            <Text style={styles.text}>{tContent('definitions.big_three.ascendant', language)}</Text>
          </Card>

          <Card>
            <SectionTitle title={content.getString('definitions.degrees.title')} />
            <Text style={styles.text}>{content.getString('definitions.degrees.body')}</Text>
          </Card>

          <Card>
            <SectionTitle title={content.getString('definitions.aspects.title')} />
            <Text style={styles.text}>{content.getString('definitions.aspects.body')}</Text>
          </Card>

          <Card>
            <SectionTitle title={content.getString('definitions.orb.title')} />
            <Text style={styles.text}>{content.getString('definitions.orb.body')}</Text>
          </Card>

          <Card>
            <SectionTitle title={content.getString('definitions.dominants.title')} />
            <Text style={styles.text}>{content.getString('definitions.dominants.body')}</Text>
          </Card>

          <Card>
            <SectionTitle title={content.getString('definitions.insights.title')} />
            <Text style={styles.text}>{content.getString('definitions.insights.body')}</Text>
            <SectionTitle title={content.getString('definitions.practices.title')} />
            <Text style={styles.text}>{content.getString('definitions.practices.body')}</Text>
          </Card>

          <Card>
            <SectionTitle title={content.getString('definitions.saved.title')} />
            <Text style={styles.text}>{content.getString('definitions.saved.body')}</Text>
          </Card>

          <Card>
            <SectionTitle title={content.getString('definitions.disclaimer.title')} />
            <Text style={styles.text}>{content.getString('definitions.disclaimer.body')}</Text>
          </Card>
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
  text: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 22,
  },
  languageRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  languageButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.bgSoft,
    alignItems: 'center',
  },
  languageButtonActive: {
    borderColor: colors.accentStrong,
    backgroundColor: colors.cardElevated,
  },
  languageButtonText: {
    color: colors.textPrimary,
    fontSize: typography.bodySm,
    fontWeight: '700',
  },
});
