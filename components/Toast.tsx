import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/src/theme/colors';
import { radius } from '@/src/theme/radius';
import { spacing } from '@/src/theme/spacing';
import { typography } from '@/src/theme/typography';
import { useToastStore } from '@/store/useToastStore';

export default function Toast() {
  const visible = useToastStore((state) => state.visible);
  const message = useToastStore((state) => state.message);
  const hideToast = useToastStore((state) => state.hideToast);
  const fade = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    if (!visible) {
      return;
    }

    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 140,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 140,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 0,
          duration: 160,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 10,
          duration: 160,
          useNativeDriver: true,
        }),
      ]).start(() => hideToast());
    }, 1500);

    return () => clearTimeout(timer);
  }, [visible, fade, translateY, hideToast]);

  if (!visible) {
    return null;
  }

  return (
    <View pointerEvents="none" style={styles.root}>
      <Animated.View
        style={[
          styles.toast,
          {
            opacity: fade,
            transform: [{ translateY }],
          },
        ]}>
        <Text style={styles.text}>{message}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 28,
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  toast: {
    backgroundColor: colors.cardElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    maxWidth: 320,
  },
  text: {
    color: colors.textPrimary,
    fontSize: typography.bodySm,
    fontWeight: '700',
    textAlign: 'center',
  },
});
