import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '@/src/theme/colors';
import { radius } from '@/src/theme/radius';
import { spacing } from '@/src/theme/spacing';
import { typography } from '@/src/theme/typography';

type ProfileHeaderPillProps = {
  label: string;
  onPress: () => void;
};

export function ProfileHeaderPill({ label, onPress }: ProfileHeaderPillProps) {
  return (
    <Pressable onPress={onPress} style={styles.pill}>
      <Text style={styles.text} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    maxWidth: 220,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgSoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    fontWeight: '700',
  },
});
