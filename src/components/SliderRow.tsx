import { useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';
import { typography } from '@/src/theme/typography';

type SliderRowProps = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (nextValue: number) => void;
};

export function SliderRow({ label, value, min = 0, max = 100, onChange }: SliderRowProps) {
  const [trackWidth, setTrackWidth] = useState(1);
  const normalized = Math.max(0, Math.min(1, (value - min) / (max - min)));

  const handleLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(Math.max(1, event.nativeEvent.layout.width));
  };

  const updateFromX = (x: number) => {
    const ratio = Math.max(0, Math.min(1, x / trackWidth));
    const nextValue = Math.round(min + ratio * (max - min));
    onChange(nextValue);
  };

  return (
    <View style={styles.container}>
      <View style={styles.labels}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{Math.round(value)}%</Text>
      </View>
      <Pressable
        style={styles.track}
        onLayout={handleLayout}
        onPress={(event) => updateFromX(event.nativeEvent.locationX)}>
        <View style={[styles.fill, { width: `${normalized * 100}%` }]} />
        <View
          style={[
            styles.thumb,
            { left: Math.max(0, Math.min(trackWidth - 16, normalized * trackWidth - 8)) },
          ]}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: colors.textSecondary,
    fontSize: typography.bodySm,
    fontWeight: '600',
  },
  value: {
    color: colors.textPrimary,
    fontSize: typography.bodySm,
    fontWeight: '700',
  },
  track: {
    height: 16,
    borderRadius: 999,
    backgroundColor: colors.border,
    justifyContent: 'center',
    overflow: 'visible',
  },
  fill: {
    height: 16,
    borderRadius: 999,
    backgroundColor: colors.accentStrong,
  },
  thumb: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 999,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.textPrimary,
  },
});
