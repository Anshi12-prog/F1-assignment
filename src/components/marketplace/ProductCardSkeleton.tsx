import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, shadow, spacing } from '@/theme';
import { Skeleton } from '@/components/common';

/** Mirrors ProductCard's geometry so the grid does not reflow when data lands. */
export function ProductCardSkeleton({ width }: { width: number }) {
  return (
    <View style={[styles.card, { width }]}>
      <View style={styles.imageWrap}>
        <Skeleton height={width - spacing.lg} borderRadius={radius.md} />
      </View>
      <View style={styles.body}>
        <Skeleton width="40%" height={10} />
        <Skeleton width="85%" height={16} />
        <Skeleton width="55%" height={12} />
        <Skeleton width="70%" height={18} />
        <Skeleton width="60%" height={22} borderRadius={radius.sm} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadow.card,
  },
  imageWrap: {
    padding: spacing.sm,
  },
  body: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
});
