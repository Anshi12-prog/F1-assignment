import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '@/theme';
import { AppText, Screen, SegmentedTabs, SegmentedTabItem } from '@/components/common';
import { ProductSummary } from '@/types/marketplace';
import { ScreenProps } from '@/navigation/types';
import { MarketplaceSection } from './MarketplaceSection';
import { NearbyStoresSection } from './NearbyStoresSection';
import { TopBrandsSection } from './TopBrandsSection';

type ShopTabId = 'top-brands' | 'nearby-stores' | 'marketplace';

const TABS: ReadonlyArray<SegmentedTabItem<ShopTabId>> = [
  { id: 'top-brands', label: 'Top Brands' },
  { id: 'nearby-stores', label: 'Nearby Stores' },
  { id: 'marketplace', label: '1Fi Marketplace' },
];

/**
 * The Shop page.
 *
 * The three options are segments of one page. 1Fi Marketplace opens by default
 * because it is the only one with inventory behind it today; the other two are
 * placeholders per the brief.
 */
export function ShopScreen({ navigation }: ScreenProps<'Shop'>) {
  const [tab, setTab] = useState<ShopTabId>('marketplace');

  const openProduct = useCallback(
    (product: ProductSummary) => {
      navigation.navigate('ProductDetail', {
        productId: product.id,
        productName: `${product.brand} ${product.name}`,
      });
    },
    [navigation],
  );

  return (
    <Screen>
      <View style={styles.titleBlock}>
        <AppText variant="title">Shop</AppText>
        <AppText variant="caption">Buy now, pay in EMIs backed by your mutual funds</AppText>
      </View>

      <View style={styles.tabs}>
        <SegmentedTabs items={TABS} value={tab} onChange={setTab} />
      </View>

      <View style={styles.body}>
        {tab === 'top-brands' ? <TopBrandsSection /> : null}
        {tab === 'nearby-stores' ? <NearbyStoresSection /> : null}
        {tab === 'marketplace' ? <MarketplaceSection onSelectProduct={openProduct} /> : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  titleBlock: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    gap: spacing.xxs,
  },
  tabs: {
    paddingHorizontal: spacing.lg,
  },
  body: {
    flex: 1,
  },
});
