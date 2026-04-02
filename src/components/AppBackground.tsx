import { ReactNode, useState } from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { colors } from '@/src/theme/colors';

const STARFIELD_SOURCE = require('../../assets/bg-stars.png');

type AppBackgroundProps = {
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  showStars?: boolean;
};

export function AppBackground({ children, contentStyle, showStars = true }: AppBackgroundProps) {
  const [hideStars, setHideStars] = useState(false);

  return (
    <View style={styles.root}>
      <View style={[styles.glow, styles.glowTop]} />
      <View style={[styles.glow, styles.glowBottom]} />
      {showStars && !hideStars ? (
        <Image
          source={STARFIELD_SOURCE}
          resizeMode="cover"
          onError={() => setHideStars(true)}
          style={styles.stars}
        />
      ) : null}
      <View style={styles.overlay} />
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  glow: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: colors.glowSoft,
  },
  glowTop: {
    width: 320,
    height: 320,
    top: -120,
    right: -80,
  },
  glowBottom: {
    width: 280,
    height: 280,
    bottom: -120,
    left: -80,
  },
  stars: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.13,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  content: {
    flex: 1,
  },
});
