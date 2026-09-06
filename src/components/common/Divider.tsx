import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/theme';

export function Divider({ inset = false }: { inset?: boolean }) {
  return <View style={[styles.divider, inset && styles.inset]} />;
}

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  inset: {
    marginHorizontal: spacing.lg,
  },
});
