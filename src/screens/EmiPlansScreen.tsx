import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/theme';
import {
  AppHeader,
  AppText,
  Button,
  Card,
  Screen,
  Skeleton,
  StateView,
} from '@/components/common';
import { EmiPlanCard, InfoRow, ProductImage, StickyFooter } from '@/components/marketplace';
import { useEmiPlans, useProduct } from '@/hooks';
import { useCheckout } from '@/store/CheckoutContext';
import { ScreenProps } from '@/navigation/types';
import { formatCurrency } from '@/utils/currency';

/**
 * EMI plan selection.
 *
 * Plans come from the data layer already annotated with eligibility, so this
 * screen only renders and selects - it never re-derives pricing.
 */
export function EmiPlansScreen({ route, navigation }: ScreenProps<'EmiPlans'>) {
  const { productId, variantId } = route.params;

  const product = useProduct(productId);
  const plans = useEmiPlans(productId, variantId);
  const { plan: selectedPlan, selectPlan, beginCheckout } = useCheckout();

  const variant = useMemo(
    () => product.data?.variants.find((item) => item.id === variantId) ?? null,
    [product.data, variantId],
  );

  const variantLabel = useMemo(
    () => variant?.attributes.map((attribute) => attribute.value).join(' \u00B7 ') ?? '',
    [variant],
  );

  const anyEligible = (plans.data ?? []).some((plan) => plan.eligible);

  const summary = product.data && variant ? (
    <Card style={styles.summary} elevated={false}>
      <View style={styles.summaryImage}>
        <ProductImage uri={variant.imageUrl} category={product.data.category} />
      </View>
      <View style={styles.summaryText}>
        <AppText variant="captionStrong" numberOfLines={2}>
          {product.data.brand} {product.data.name}
        </AppText>
        <AppText variant="caption" numberOfLines={1}>
          {variantLabel}
        </AppText>
        <AppText variant="subheading">{formatCurrency(variant.price)}</AppText>
      </View>
    </Card>
  ) : null;

  const body = () => {
    if (plans.isLoading || product.isLoading) {
      return (
        <View style={styles.loading}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} height={104} borderRadius={radius.lg} />
          ))}
        </View>
      );
    }

    if (plans.status === 'error') {
      return (
        <StateView
          icon="alert"
          tone="danger"
          title="We could not price your EMI plans"
          message={plans.error?.message}
          actionLabel={plans.error?.retryable ? 'Try again' : undefined}
          onAction={plans.retry}
        />
      );
    }

    if (!plans.data || plans.data.length === 0) {
      return (
        <StateView
          icon="info"
          title="No plans available"
          message="This merchant has not enabled EMI on this item yet."
        />
      );
    }

    return (
      <View style={styles.plans} accessibilityRole="radiogroup">
        {plans.data.map((plan) => (
          <EmiPlanCard
            key={plan.id}
            plan={plan}
            selected={selectedPlan?.id === plan.id}
            onSelect={(picked) => {
              if (product.data && variant) {
                beginCheckout(product.data, variant);
              }
              selectPlan(picked);
            }}
          />
        ))}
      </View>
    );
  };

  return (
    <Screen background="surface">
      <AppHeader title="Choose an EMI plan" subtitle={variantLabel} onBack={navigation.goBack} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {summary}

        {body()}

        {!anyEligible && plans.status === 'success' ? (
          <Card style={styles.limitNote} elevated={false}>
            <InfoRow
              icon="info"
              title="Above your available limit"
              subtitle="Pledge more mutual fund units to raise your purchase limit, then come back to this plan."
            />
          </Card>
        ) : null}

        <Card style={styles.trustCard} elevated={false}>
          <InfoRow
            icon="shield"
            title="Your units stay invested"
            subtitle="A lien is marked on selected units. SIPs keep running and returns keep accruing."
          />
          <InfoRow
            icon="tag"
            title="No hidden charges"
            subtitle="No processing, foreclosure or lien-release fees. Prepay in full whenever you like."
          />
          <InfoRow
            icon="info"
            title="3-day cooling-off"
            subtitle="Cancel any drawdown within 3 days at no cost."
          />
        </Card>
      </ScrollView>

      <StickyFooter>
        <View style={styles.footerRow}>
          <View style={styles.footerText}>
            <AppText variant="caption">
              {selectedPlan ? `${selectedPlan.tenureMonths} months` : 'Select a plan'}
            </AppText>
            <AppText variant="subheading">
              {selectedPlan ? `${formatCurrency(selectedPlan.monthlyEmi)}/mo` : '--'}
            </AppText>
          </View>
          <Button
            label="Proceed"
            disabled={!selectedPlan || !selectedPlan.eligible}
            onPress={() => navigation.navigate('ReviewOrder')}
            style={styles.footerButton}
          />
        </View>
      </StickyFooter>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: colors.background,
  },
  summaryImage: {
    width: 64,
  },
  summaryText: {
    flex: 1,
    gap: spacing.xxs,
  },
  loading: {
    gap: spacing.md,
  },
  plans: {
    gap: spacing.md,
  },
  limitNote: {
    backgroundColor: colors.warningSoft,
    borderColor: colors.warningSoft,
  },
  trustCard: {
    gap: spacing.lg,
    backgroundColor: colors.background,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  footerText: {
    flexShrink: 1,
  },
  footerButton: {
    flex: 1,
  },
});
