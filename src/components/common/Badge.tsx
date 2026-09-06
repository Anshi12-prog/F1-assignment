import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/theme';
import { AppText } from './AppText';

type Tone = 'brand' | 'success' | 'warning' | 'danger' | 'neutral';

const TONES: Record<Tone, { background: string; text: string }> = {
  brand: { background: colors.brandSoft, text: colors.brandDark },
  success: { background: colors.successSoft, text: colors.successText },
  warning: { background: colors.warningSoft, text: colors.warning },
  danger: { background: colors.dangerSoft, text: colors.danger },
  neutral: { background: colors.surfaceMuted, text: colors.textSecondary },
};

interface Props {
  label: string;
  tone?: Tone;
}

export function Badge({ label, tone = 'neutral' }: Props) {
  const palette = TONES[tone];
  return (
    <View style={[styles.badge, { backgroundColor: palette.background }]}>
      <AppText variant="captionStrong" style={{ color: palette.text }} numberOfLines={1}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
});
