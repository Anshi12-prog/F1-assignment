import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/theme';
import { AppText, Icon } from '@/components/common';

interface Props {
  rating: number;
  count?: number;
}

export function RatingPill({ rating, count }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.pill}>
        <Icon name="star" size={11} color="successText" strokeWidth={2.4} />
        <AppText variant="captionStrong" style={styles.value}>
          {rating.toFixed(1)}
        </AppText>
      </View>
      {typeof count === 'number' ? (
        <AppText variant="caption">
          {count > 999 ? `${(count / 1000).toFixed(1)}k` : count} ratings
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.successSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  value: {
    color: colors.successText,
  },
});
