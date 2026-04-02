import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/src/theme/colors';
import { radius } from '@/src/theme/radius';
import { spacing } from '@/src/theme/spacing';
import { typography } from '@/src/theme/typography';

type SegmentedOption = {
  label: string;
  value: string;
};

type SegmentedControlProps = {
  options: SegmentedOption[];
  value: string;
  onChange: (nextValue: string) => void;
};

export function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.option, active && styles.optionActive]}>
            <Text style={[styles.text, active && styles.textActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.bgSoft,
    borderRadius: radius.md,
    padding: spacing.xs,
    gap: spacing.xs,
  },
  option: {
    flex: 1,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  optionActive: {
    backgroundColor: colors.cardElevated,
  },
  text: {
    color: colors.textMuted,
    fontSize: typography.bodySm,
    fontWeight: '600',
  },
  textActive: {
    color: colors.textPrimary,
  },
});
