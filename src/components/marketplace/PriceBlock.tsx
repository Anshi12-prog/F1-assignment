import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/theme';
import { AppText } from '@/components/common';
import { discountPercent, formatCurrency } from '@/utils/currency';

interface Props {
  price: number;
  mrp: number;
  size?: 'sm' | 'lg';
}

export function PriceBlock({ price, mrp, size = 'sm' }: Props) {
  const discount = discountPercent(mrp, price);

  return (
    <View style={styles.row}>
      <AppText variant={size === 'lg' ? 'title' : 'bodyStrong'}>{formatCurrency(price)}</AppText>
      {discount > 0 ? (
        <>
          <AppText variant="caption" style={styles.struck}>
            {formatCurrency(mrp)}
          </AppText>
          <AppText variant="captionStrong" style={styles.discount}>
            {discount}% off
          </AppText>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  struck: {
    textDecorationLine: 'line-through',
    color: colors.textTertiary,
  },
  discount: {
    color: colors.successText,
  },
});
