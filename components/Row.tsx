import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';
import { typography } from '@/src/theme/typography';

interface RowProps {
  label: string;
  value: string;
  subValue?: string;
}

export default function Row({ label, value, subValue }: RowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueWrap}>
        <Text style={styles.value}>{value}</Text>
        {subValue ? <Text style={styles.subValue}>{subValue}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  label: {
    color: colors.textMuted,
    fontSize: typography.bodySm,
    flex: 1,
  },
  valueWrap: {
    flex: 2,
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  value: {
    color: colors.textSecondary,
    fontSize: typography.bodySm,
    textAlign: 'right',
  },
  subValue: {
    color: colors.textMuted,
    fontSize: typography.caption,
    textAlign: 'right',
  },
});
