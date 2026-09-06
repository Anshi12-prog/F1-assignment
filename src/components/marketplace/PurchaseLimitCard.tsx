import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/theme';
import { AppText, Icon, Skeleton } from '@/components/common';
import { PurchaseLimit } from '@/types/marketplace';
import { formatCompactCurrency, formatCurrency } from '@/utils/currency';
import { formatTime } from '@/utils/date';

interface Props {
  limit: PurchaseLimit | null;
  loading: boolean;
  errored: boolean;
}

/**
 * The user's mutual-fund backed purchase limit, shown before anything else.
 *
 * Everything in the Marketplace is priced against this number, so it anchors the
 * screen rather than sitting in a menu. It degrades to a neutral message on error
 * instead of blocking the catalogue - browsing should never depend on it.
 */
export function PurchaseLimitCard({ limit, loading, errored }: Props) {
  const used = limit ? limit.utilisedLimit / limit.totalLimit : 0;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <AppText variant="overline" style={styles.overline}>
          Available purchase limit
        </AppText>
        <Icon name="shield" size={16} color="textOnBrand" />
      </View>

      {loading ? (
        <View style={styles.loadingBlock}>
          <Skeleton width="55%" height={30} />
          <Skeleton width="80%" height={12} />
        </View>
      ) : errored || !limit ? (
        <AppText variant="body" style={styles.errorCopy}>
          Limit unavailable right now. You can still browse; we will refresh it at checkout.
        </AppText>
      ) : (
        <>
          <AppText variant="displayLg" style={styles.amount}>
            {formatCurrency(limit.availableLimit)}
          </AppText>

          <View style={styles.track}>
            <View style={[styles.fill, { width: `${Math.min(100, used * 100)}%` }]} />
          </View>

          <View style={styles.metaRow}>
            <AppText variant="caption" style={styles.meta}>
              {formatCompactCurrency(limit.utilisedLimit)} used of{' '}
              {formatCompactCurrency(limit.totalLimit)}
            </AppText>
            <AppText variant="caption" style={styles.meta}>
              Updated {formatTime(limit.lastRefreshedAt)}
            </AppText>
          </View>

          <AppText variant="caption" style={styles.footnote}>
            Backed by {formatCompactCurrency(limit.pledgedPortfolioValue)} in pledged units at{' '}
            {limit.ltvPercent}% LTV. Your SIPs keep running.
          </AppText>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.brandDark,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  overline: {
    color: colors.brandSoft,
  },
  amount: {
    color: colors.textInverse,
  },
  loadingBlock: {
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  errorCopy: {
    color: colors.brandSoft,
  },
  track: {
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.22)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.brandSoft,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  meta: {
    color: colors.brandSoft,
  },
  footnote: {
    color: 'rgba(237,233,254,0.72)',
  },
});
