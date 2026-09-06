import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, shadow, spacing } from '@/theme';
import { AppText, Badge } from '@/components/common';
import { ProductSummary } from '@/types/marketplace';
import { formatCurrency } from '@/utils/currency';
import { PriceBlock } from './PriceBlock';
import { ProductImage } from './ProductImage';
import { RatingPill } from './RatingPill';

interface Props {
  product: ProductSummary;
  onPress: (product: ProductSummary) => void;
  /** Width is owned by the grid so the card stays layout-agnostic. */
  width: number;
}

function ProductCardComponent({ product, onPress, width }: Props) {
  return (
    <Pressable
      onPress={() => onPress(product)}
      accessibilityRole="button"
      accessibilityLabel={`${product.brand} ${product.name}, ${formatCurrency(product.price)}`}
      style={({ pressed }) => [styles.card, { width }, pressed && styles.pressed]}
    >
      <View style={styles.imageWrap}>
        <ProductImage uri={product.imageUrl} category={product.category} />
        {!product.inStock ? (
          <View style={styles.outOfStock}>
            <AppText variant="captionStrong" style={styles.outOfStockLabel}>
              Out of stock
            </AppText>
          </View>
        ) : null}
      </View>

      <View style={styles.body}>
        <AppText variant="overline" numberOfLines={1}>
          {product.brand}
        </AppText>
        <AppText variant="bodyStrong" numberOfLines={2} style={styles.name}>
          {product.name}
        </AppText>

        <RatingPill rating={product.rating} />

        <PriceBlock price={product.price} mrp={product.mrp} />

        <View style={styles.emiRow}>
          <Badge
            label={`${formatCurrency(product.startingEmi)}/mo \u00B7 ${product.longestNoCostTenure}m`}
            tone="brand"
          />
        </View>
        <AppText variant="caption" numberOfLines={1}>
          No-cost EMI on your mutual funds
        </AppText>
      </View>
    </Pressable>
  );
}

/**
 * Memoised: the grid re-renders on every keystroke in search, and the cards that
 * survive the filter should not re-render with it.
 */
export const ProductCard = memo(ProductCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadow.card,
  },
  pressed: {
    opacity: 0.9,
  },
  imageWrap: {
    padding: spacing.sm,
  },
  outOfStock: {
    position: 'absolute',
    left: spacing.md,
    top: spacing.md,
    backgroundColor: colors.overlay,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  outOfStockLabel: {
    color: colors.textInverse,
  },
  body: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  name: {
    marginBottom: spacing.xxs,
  },
  emiRow: {
    marginTop: spacing.xxs,
  },
});
