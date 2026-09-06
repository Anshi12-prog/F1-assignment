import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/theme';
import { AppHeader, AppText, Button, Card, Divider, Screen, StateView } from '@/components/common';
import { InfoRow, ProductImage, StickyFooter } from '@/components/marketplace';
import { createOrder, toApiError } from '@/api';
import { useCheckout } from '@/store/CheckoutContext';
import { ScreenProps } from '@/navigation/types';
import { formatCurrency } from '@/utils/currency';

/**
 * Final review before the lien is placed.
 *
 * Everything shown here is read back from the checkout context, so the numbers on
 * this screen are literally the ones the user selected - nothing is recomputed at
 * the last step.
 */
export function ReviewOrderScreen({ navigation }: ScreenProps<'ReviewOrder'>) {
  const { product, variant, plan, completeOrder } = useCheckout();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const placeOrder = useCallback(async () => {
    if (!product || !variant || !plan) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const order = await createOrder({
        productId: product.id,
        variantId: variant.id,
        planId: plan.id,
      });
      completeOrder(order);
      navigation.replace('OrderConfirmed', { orderId: order.orderId });
    } catch (thrown) {
      setError(toApiError(thrown).message);
    } finally {
      setSubmitting(false);
    }
  }, [product, variant, plan, completeOrder, navigation]);

  if (!product || !variant || !plan) {
    return (
      <Screen background="surface">
        <AppHeader title="Review" onBack={navigation.goBack} />
        <StateView
          icon="info"
          title="Your selection expired"
          message="Pick the product and EMI plan again to continue."
          actionLabel="Back to Shop"
          onAction={() => navigation.navigate('Shop')}
        />
      </Screen>
    );
  }

  const variantLabel = variant.attributes.map((attribute) => attribute.value).join(' \u00B7 ');

  return (
    <Screen background="surface">
      <AppHeader title="Review your purchase" onBack={navigation.goBack} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.summary} elevated={false}>
          <View style={styles.summaryImage}>
            <ProductImage uri={variant.imageUrl} category={product.category} />
          </View>
          <View style={styles.summaryText}>
            <AppText variant="captionStrong" numberOfLines={2}>
              {product.brand} {product.name}
            </AppText>
            <AppText variant="caption">{variantLabel}</AppText>
            <AppText variant="caption">Sold by {product.merchant.name}</AppText>
          </View>
        </Card>

        <Card style={styles.breakdown}>
          <AppText variant="captionStrong">Payment breakdown</AppText>
          <Row label="Product price" value={formatCurrency(variant.price)} />
          <Row
            label="Interest"
            value={plan.isNoCost ? 'No cost' : formatCurrency(plan.interestComponent)}
            highlight={plan.isNoCost}
          />
          <Row label="Processing fee" value="Nil" highlight />
          <Divider />
          <Row label="Total payable" value={formatCurrency(plan.totalPayable)} strong />
          <Row
            label="Monthly EMI"
            value={`${formatCurrency(plan.monthlyEmi)} \u00D7 ${plan.tenureMonths}`}
            strong
          />
        </Card>

        <Card style={styles.pledge} elevated={false}>
          <InfoRow
            icon="shield"
            title={`${formatCurrency(plan.pledgeAmount)} will be lien-marked`}
            subtitle="Selected mutual fund units stay invested and are released once the loan is repaid."
          />
          <InfoRow
            icon="truck"
            title={product.merchant.deliveryEta}
            subtitle={`${product.merchant.warranty} \u00B7 ${product.merchant.returnWindowDays}-day returns`}
          />
        </Card>

        <AppText variant="caption" style={styles.legal}>
          By continuing you authorise a lien on the selected units and agree to the lending
          partner's loan terms. Loans are provided by an RBI-regulated NBFC; 1Fi acts as the
          lending service provider.
        </AppText>

        {error ? (
          <Card style={styles.error} elevated={false}>
            <AppText variant="caption" style={styles.errorText}>
              {error}
            </AppText>
          </Card>
        ) : null}
      </ScrollView>

      <StickyFooter>
        <Button
          label="Confirm and place lien"
          caption={`${formatCurrency(plan.monthlyEmi)}/month for ${plan.tenureMonths} months`}
          loading={submitting}
          onPress={placeOrder}
        />
      </StickyFooter>
    </Screen>
  );
}

function Row({
  label,
  value,
  strong,
  highlight,
}: {
  label: string;
  value: string;
  strong?: boolean;
  highlight?: boolean;
}) {
  return (
    <View style={styles.row}>
      <AppText variant={strong ? 'bodyStrong' : 'body'} style={styles.rowLabel}>
        {label}
      </AppText>
      <AppText
        variant={strong ? 'bodyStrong' : 'body'}
        style={highlight ? styles.highlight : undefined}
      >
        {value}
      </AppText>
    </View>
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
  breakdown: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  rowLabel: {
    flexShrink: 1,
  },
  highlight: {
    color: colors.successText,
  },
  pledge: {
    gap: spacing.lg,
    backgroundColor: colors.brandSurface,
    borderColor: colors.brandSoft,
  },
  legal: {
    paddingHorizontal: spacing.xs,
  },
  error: {
    backgroundColor: colors.dangerSoft,
    borderColor: colors.dangerSoft,
  },
  errorText: {
    color: colors.danger,
  },
});
