import React, { useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/theme';
import {
  AppHeader,
  AppText,
  Badge,
  Button,
  Card,
  Screen,
  Skeleton,
  StateView,
} from '@/components/common';
import {
  InfoRow,
  PriceBlock,
  ProductImage,
  RatingPill,
  SpecificationList,
  StickyFooter,
  VariantSelector,
} from '@/components/marketplace';
import { useEmiPlans, useProduct, useVariantSelection } from '@/hooks';
import { useCheckout } from '@/store/CheckoutContext';
import { ScreenProps } from '@/navigation/types';
import { formatCurrency } from '@/utils/currency';

export function ProductDetailScreen({ route, navigation }: ScreenProps<'ProductDetail'>) {
  const { productId, productName } = route.params;

  const product = useProduct(productId);
  const { groups, selectedVariant, selectAttribute } = useVariantSelection(product.data);
  const emiPlans = useEmiPlans(productId, selectedVariant?.id);
  const { beginCheckout } = useCheckout();

  /** Keep the flow's source of truth in sync as the user switches variants. */
  useEffect(() => {
    if (product.data && selectedVariant) {
      beginCheckout(product.data, selectedVariant);
    }
  }, [product.data, selectedVariant, beginCheckout]);

  const bestPlan = useMemo(() => {
    const eligible = (emiPlans.data ?? []).filter((plan) => plan.eligible && plan.isNoCost);
    return eligible.sort((a, b) => a.monthlyEmi - b.monthlyEmi)[0] ?? null;
  }, [emiPlans.data]);

  if (product.isLoading) {
    return (
      <Screen background="surface">
        <AppHeader title={productName} onBack={navigation.goBack} />
        <View style={styles.loading}>
          <Skeleton height={260} borderRadius={radius.lg} />
          <Skeleton width="60%" height={22} />
          <Skeleton width="40%" height={18} />
          <Skeleton height={90} borderRadius={radius.lg} />
          <Skeleton height={120} borderRadius={radius.lg} />
        </View>
      </Screen>
    );
  }

  if (product.status === 'error' || !product.data || !selectedVariant) {
    return (
      <Screen background="surface">
        <AppHeader title="Product" onBack={navigation.goBack} />
        <StateView
          icon="alert"
          tone="danger"
          title="We could not load this product"
          message={product.error?.message ?? 'Please try again in a moment.'}
          actionLabel="Try again"
          onAction={product.retry}
        />
      </Screen>
    );
  }

  const item = product.data;
  const outOfStock = !selectedVariant.inStock;

  return (
    <Screen background="surface" edges={['top', 'left', 'right']}>
      <AppHeader title={item.name} subtitle={item.brand} onBack={navigation.goBack} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <ProductImage
            uri={selectedVariant.imageUrl}
            category={item.category}
            aspectRatio={1.15}
          />
        </View>

        <View style={styles.block}>
          <AppText variant="overline">{item.brand}</AppText>
          <AppText variant="title">{item.name}</AppText>
          <AppText variant="caption">{item.tagline}</AppText>
          <RatingPill rating={item.rating} count={item.ratingCount} />
        </View>

        <View style={styles.block}>
          <PriceBlock price={selectedVariant.price} mrp={selectedVariant.mrp} size="lg" />
          <AppText variant="caption">Inclusive of all taxes</AppText>
          {outOfStock ? <Badge label="Currently out of stock" tone="danger" /> : null}
        </View>

        <View style={styles.block}>
          <VariantSelector groups={groups} onSelect={selectAttribute} />
        </View>

        <Card style={styles.emiCard}>
          <View style={styles.emiHeader}>
            <AppText variant="captionStrong">Pay with no-cost EMI</AppText>
            <Badge label={`Up to ${Math.max(...item.availableTenures)} months`} tone="brand" />
          </View>

          {emiPlans.isLoading ? (
            <View style={styles.emiLoading}>
              <Skeleton width="55%" height={20} />
              <Skeleton width="75%" height={12} />
            </View>
          ) : emiPlans.status === 'error' ? (
            <AppText variant="caption">
              EMI pricing is unavailable right now. You can still open the plan list to retry.
            </AppText>
          ) : bestPlan ? (
            <>
              <AppText variant="heading">
                {formatCurrency(bestPlan.monthlyEmi)}
                <AppText variant="caption">{`  / month for ${bestPlan.tenureMonths} months`}</AppText>
              </AppText>
              <AppText variant="caption">
                0% interest. You repay only {formatCurrency(selectedVariant.price)} in total.
              </AppText>
            </>
          ) : (
            <AppText variant="caption">
              This amount is above your available limit. Pledge more units to unlock a plan.
            </AppText>
          )}
        </Card>

        <View style={styles.block}>
          <AppText variant="heading">Highlights</AppText>
          {item.highlights.map((highlight) => (
            <View key={highlight} style={styles.bulletRow}>
              <View style={styles.bullet} />
              <AppText variant="body" style={styles.bulletText}>
                {highlight}
              </AppText>
            </View>
          ))}
        </View>

        <Card style={styles.merchantCard} elevated={false}>
          <InfoRow icon="store" title={item.merchant.name} subtitle="Verified 1Fi partner merchant" />
          <InfoRow icon="truck" title={item.merchant.deliveryEta} />
          <InfoRow
            icon="shield"
            title={item.merchant.warranty}
            subtitle={`${item.merchant.returnWindowDays}-day return window`}
          />
        </Card>

        <View style={styles.block}>
          <AppText variant="heading">Specifications</AppText>
          <SpecificationList groups={item.specifications} />
        </View>

        <View style={styles.block}>
          <AppText variant="heading">About</AppText>
          <AppText variant="body">{item.description}</AppText>
        </View>
      </ScrollView>

      <StickyFooter>
        <View style={styles.footerRow}>
          <View style={styles.footerPrice}>
            <AppText variant="caption">
              {bestPlan ? `From ${formatCurrency(bestPlan.monthlyEmi)}/mo` : 'Total'}
            </AppText>
            <AppText variant="subheading">{formatCurrency(selectedVariant.price)}</AppText>
          </View>
          <Button
            label={outOfStock ? 'Out of stock' : 'View EMI plans'}
            disabled={outOfStock}
            onPress={() =>
              navigation.navigate('EmiPlans', {
                productId: item.id,
                variantId: selectedVariant.id,
              })
            }
            style={styles.footerButton}
          />
        </View>
      </StickyFooter>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xxl,
  },
  loading: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  block: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    gap: spacing.sm,
  },
  emiCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    backgroundColor: colors.brandSurface,
    gap: spacing.sm,
  },
  emiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  emiLoading: {
    gap: spacing.sm,
  },
  merchantCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    gap: spacing.lg,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.brand,
    marginTop: 9,
  },
  bulletText: {
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  footerPrice: {
    flexShrink: 1,
  },
  footerButton: {
    flex: 1,
  },
});
