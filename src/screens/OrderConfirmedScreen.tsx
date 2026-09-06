import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/theme';
import { AppText, Button, Card, Divider, Icon, Screen } from '@/components/common';
import { InfoRow, StickyFooter } from '@/components/marketplace';
import { useCheckout } from '@/store/CheckoutContext';
import { ScreenProps } from '@/navigation/types';
import { formatCurrency } from '@/utils/currency';
import { formatShortDate } from '@/utils/date';

export function OrderConfirmedScreen({ route, navigation }: ScreenProps<'OrderConfirmed'>) {
  const { order, reset } = useCheckout();
  const orderId = order?.orderId ?? route.params.orderId;

  const goToShop = () => {
    reset();
    navigation.popToTop();
  };

  return (
    <Screen background="surface">
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.tick}>
          <Icon name="check" size={30} color="textOnBrand" strokeWidth={3} />
        </View>

        <AppText variant="title" align="center">
          Purchase confirmed
        </AppText>
        <AppText variant="caption" align="center" style={styles.subtitle}>
          The lien is being marked on your selected units. The merchant is paid as soon as your
          lender releases the funds.
        </AppText>

        <Card style={styles.card}>
          <View style={styles.row}>
            <AppText variant="caption">Order ID</AppText>
            <AppText variant="bodyStrong">{orderId}</AppText>
          </View>
          <Divider />

          {order ? (
            <>
              <View style={styles.row}>
                <AppText variant="caption">Item</AppText>
                <AppText variant="body" style={styles.value} numberOfLines={2}>
                  {order.productName}
                </AppText>
              </View>
              <View style={styles.row}>
                <AppText variant="caption">Variant</AppText>
                <AppText variant="body" style={styles.value}>
                  {order.variantLabel}
                </AppText>
              </View>
              <View style={styles.row}>
                <AppText variant="caption">Amount</AppText>
                <AppText variant="body">{formatCurrency(order.amount)}</AppText>
              </View>
              <View style={styles.row}>
                <AppText variant="caption">EMI</AppText>
                <AppText variant="body">
                  {formatCurrency(order.plan.monthlyEmi)} × {order.plan.tenureMonths} months
                </AppText>
              </View>
              <View style={styles.row}>
                <AppText variant="caption">First EMI</AppText>
                <AppText variant="body">{formatShortDate(order.firstEmiDate)}</AppText>
              </View>
            </>
          ) : null}
        </Card>

        <Card style={styles.nextCard} elevated={false}>
          <InfoRow
            icon="info"
            title={`${order?.coolingOffDays ?? 3}-day cooling-off period`}
            subtitle="Cancel this drawdown at no cost within the cooling-off window."
          />
          <InfoRow
            icon="shield"
            title="Set up autopay"
            subtitle="Turn on autopay so EMIs are debited automatically each month."
          />
        </Card>
      </ScrollView>

      <StickyFooter>
        <Button label="Back to Shop" onPress={goToShop} />
      </StickyFooter>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.md,
    alignItems: 'stretch',
    paddingBottom: spacing.xxl,
  },
  tick: {
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  subtitle: {
    marginBottom: spacing.lg,
  },
  card: {
    gap: spacing.md,
  },
  nextCard: {
    gap: spacing.lg,
    backgroundColor: colors.background,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.lg,
  },
  value: {
    flex: 1,
    textAlign: 'right',
  },
});
