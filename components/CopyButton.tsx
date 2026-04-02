import Ionicons from '@expo/vector-icons/Ionicons';
import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useLocale } from '@/lib/i18n/useLocale';
import { colors } from '@/src/theme/colors';
import { radius } from '@/src/theme/radius';
import { spacing } from '@/src/theme/spacing';
import { typography } from '@/src/theme/typography';
import { useToastStore } from '@/store/useToastStore';

type CopyButtonProps = {
  textToCopy: string;
  label?: string;
  variant?: 'inline' | 'section';
};

export default function CopyButton({
  textToCopy,
  label,
  variant = 'inline',
}: CopyButtonProps) {
  const { t } = useLocale();
  const showToast = useToastStore((state) => state.showToast);
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    if (!textToCopy) {
      return;
    }
    await Clipboard.setStringAsync(textToCopy);
    setCopied(true);
    showToast(t('common.copied_to_clipboard'));
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <Pressable
      onPress={() => void onCopy()}
      accessibilityRole="button"
      accessibilityLabel={label ?? t('common.copy')}
      style={({ pressed }) => [
        styles.base,
        variant === 'section' ? styles.section : styles.inline,
        pressed && styles.pressed,
      ]}>
      <Ionicons
        name={copied ? 'checkmark' : 'copy-outline'}
        size={14}
        color={copied ? colors.success : colors.textPrimary}
      />
      {variant === 'section' ? (
        <Text style={styles.text}>{copied ? t('common.copied') : (label ?? t('common.copy'))}</Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.bgSoft,
    gap: spacing.xs,
  },
  inline: {
    width: 28,
    height: 28,
  },
  section: {
    minHeight: 28,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  pressed: {
    opacity: 0.85,
  },
  text: {
    color: colors.textPrimary,
    fontSize: typography.caption,
    fontWeight: '700',
  },
});
