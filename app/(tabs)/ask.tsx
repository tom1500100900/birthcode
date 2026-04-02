import * as Clipboard from 'expo-clipboard';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  ButtonPrimary,
  Card,
  Chip,
  Divider,
  Screen,
  SectionHeader,
  TextField,
} from '@/src/components';
import { generateAnswer } from '@/src/lib/ask/answer';
import { getSuggestedQuestions } from '@/src/lib/ask/questions';
import { computeChartCore } from '@/src/lib/engine/derive';
import { addQA, getProfile, getQAHistory } from '@/src/lib/storage';
import { colors } from '@/src/theme/colors';
import { radius } from '@/src/theme/radius';
import { spacing } from '@/src/theme/spacing';
import { typography } from '@/src/theme/typography';
import type { AskCategory, BirthProfile, QAItem } from '@/src/types';

const CATEGORIES: AskCategory[] = [
  'Career',
  'Relationships',
  'Money',
  'Purpose',
  'Growth',
  'Stress',
];

export default function AskScreen() {
  const [profile, setProfile] = useState<BirthProfile | null>(null);
  const [history, setHistory] = useState<QAItem[]>([]);
  const [category, setCategory] = useState<AskCategory>('Career');
  const [question, setQuestion] = useState('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [loadedProfile, loadedHistory] = await Promise.all([getProfile(), getQAHistory()]);
      setProfile(loadedProfile);
      setHistory(loadedHistory);
    };
    void load();
  }, []);

  const suggestions = useMemo(() => getSuggestedQuestions(category), [category]);
  const latestAnswer = history[0];

  const onAsk = async () => {
    if (!profile || !question.trim()) {
      return;
    }
    setBusy(true);
    try {
      const chartCore = computeChartCore(profile);
      const result = generateAnswer(category, question.trim(), chartCore);
      const answerText = [
        result.theme,
        '',
        result.paragraphs[0],
        '',
        result.paragraphs[1],
        '',
        `- ${result.actions[0]}`,
        `- ${result.actions[1]}`,
        `- ${result.actions[2]}`,
      ].join('\n');

      const item: QAItem = {
        id: `${Date.now()}`,
        createdAtISO: new Date().toISOString(),
        category,
        question: question.trim(),
        answer: answerText,
        references: result.references,
        followUps: result.followUps,
      };
      await addQA(item);
      setHistory((prev) => [item, ...prev]);
      setQuestion('');
    } finally {
      setBusy(false);
    }
  };

  const copyAnswer = async (item: QAItem) => {
    await Clipboard.setStringAsync(item.answer);
  };

  return (
    <Screen scroll>
      <View style={styles.container}>
        <SectionHeader
          title="Ask BirthCode"
          subtitle="Offline reflection powered by your chart dynamics and practical prompts."
        />

        <View style={styles.chips}>
          {CATEGORIES.map((item) => (
            <Chip
              key={item}
              label={item}
              active={item === category}
              onPress={() => setCategory(item)}
            />
          ))}
        </View>

        <Card>
          <Text style={styles.label}>Suggested questions</Text>
          <View style={styles.suggestions}>
            {suggestions.map((item) => (
              <Pressable
                key={item.id}
                style={styles.suggestionButton}
                onPress={() => setQuestion(item.question)}>
                <Text style={styles.suggestionText}>{item.question}</Text>
              </Pressable>
            ))}
          </View>
          <Divider />
          <TextField
            label="Your question"
            placeholder="Write your question..."
            value={question}
            onChangeText={setQuestion}
          />
          <View style={styles.askButton}>
            <ButtonPrimary
              label={busy ? 'Generating...' : 'Ask'}
              onPress={() => void onAsk()}
              disabled={busy || !profile || !question.trim()}
            />
          </View>
        </Card>

        {!profile ? (
          <Card>
            <Text style={styles.text}>
              Complete onboarding first to generate personalized answers from your stored profile.
            </Text>
          </Card>
        ) : null}

        {latestAnswer ? (
          <Card>
            <SectionHeader title="Latest answer" />
            <Text style={styles.question}>Q: {latestAnswer.question}</Text>
            <Text style={styles.text}>{latestAnswer.answer}</Text>
            <Text style={styles.meta}>References: {latestAnswer.references.join(' • ')}</Text>
            <Text style={styles.meta}>Follow-ups: {latestAnswer.followUps.join(' • ')}</Text>
            <View style={styles.askButton}>
              <ButtonPrimary label="Copy answer" onPress={() => void copyAnswer(latestAnswer)} />
            </View>
          </Card>
        ) : null}

        <Card>
          <SectionHeader title="History" subtitle={`${history.length} saved answers`} />
          {history.length === 0 ? (
            <Text style={styles.text}>
              Ask your first question to build a private, offline reflection history.
            </Text>
          ) : (
            history.map((item) => (
              <View key={item.id} style={styles.historyItem}>
                <Pressable onPress={() => setExpanded((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}>
                  <Text style={styles.question}>{item.category}: {item.question}</Text>
                  <Text style={styles.meta}>{new Date(item.createdAtISO).toLocaleString()}</Text>
                </Pressable>
                {expanded[item.id] ? (
                  <View style={styles.historyBody}>
                    <Text style={styles.text}>{item.answer}</Text>
                    <Text style={styles.meta}>References: {item.references.join(' • ')}</Text>
                    <Text style={styles.meta}>Follow-ups: {item.followUps.join(' • ')}</Text>
                    <View style={styles.askButton}>
                      <ButtonPrimary label="Copy answer" onPress={() => void copyAnswer(item)} />
                    </View>
                  </View>
                ) : null}
              </View>
            ))
          )}
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
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  label: {
    color: colors.textSecondary,
    fontSize: typography.bodySm,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  suggestions: {
    gap: spacing.sm,
  },
  suggestionButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: colors.bgSoft,
  },
  suggestionText: {
    color: colors.textSecondary,
    fontSize: typography.bodySm,
  },
  askButton: {
    marginTop: spacing.md,
  },
  question: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  text: {
    color: colors.textSecondary,
    fontSize: typography.bodySm,
    lineHeight: 20,
  },
  meta: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 18,
    marginTop: spacing.sm,
  },
  historyItem: {
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: spacing.md,
    marginTop: spacing.md,
  },
  historyBody: {
    marginTop: spacing.sm,
  },
});
