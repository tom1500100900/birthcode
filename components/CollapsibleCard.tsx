import Ionicons from '@expo/vector-icons/Ionicons';
import { ReactNode, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';
import { typography } from '@/src/theme/typography';

import Card from './Card';
import CopyButton from './CopyButton';

interface CollapsibleCardProps {
  title: string;
  children: ReactNode;
  copyText?: string;
  defaultExpanded?: boolean;
  onPressInfo?: () => void;
}

export default function CollapsibleCard({
  title,
  children,
  copyText,
  defaultExpanded = false,
  onPressInfo,
}: CollapsibleCardProps) {
  const [expanded, setExpanded] = useState<boolean>(defaultExpanded);

  return (
    <Card>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.actions}>
          {copyText ? <CopyButton textToCopy={copyText} /> : null}
          {onPressInfo ? (
            <Pressable onPress={onPressInfo} hitSlop={8}>
              <Ionicons name="help-circle-outline" size={20} color={colors.textMuted} />
            </Pressable>
          ) : null}
          <Pressable onPress={() => setExpanded((current) => !current)} hitSlop={8}>
            <Ionicons
              name={expanded ? 'chevron-up-outline' : 'chevron-down-outline'}
              size={20}
              color={colors.textMuted}
            />
          </Pressable>
        </View>
      </View>
      {expanded ? <View style={styles.content}>{children}</View> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  title: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  content: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
});
