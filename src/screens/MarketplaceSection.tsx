import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { colors, spacing } from '@/theme';
import { AppText, SearchField, SegmentedTabs, StateView } from '@/components/common';
import {
  DevPanel,
  ProductCard,
  ProductCardSkeleton,
  PurchaseLimitCard,
} from '@/components/marketplace';
import { PRODUCT_CATEGORIES } from '@/api';
import { useDebouncedValue, useProducts, usePurchaseLimit } from '@/hooks';
import { ProductCategoryId, ProductSummary } from '@/types/marketplace';

const GUTTER = spacing.lg;
const GAP = spacing.md;

interface Props {
  onSelectProduct: (product: ProductSummary) => void;
}

/**
 * The 1Fi Marketplace listing.
 *
 * Owns three pieces of local UI state (category, search text, refresh) and reads
 * everything else through hooks. The limit and the catalogue load independently,
 * so a failure in one never blanks the other.
 */
export function MarketplaceSection({ onSelectProduct }: Props) {
  const { width } = useWindowDimensions();

  const [category, setCategory] = useState<ProductCategoryId>('all');
  const [searchInput, setSearchInput] = useState('');
  const search = useDebouncedValue(searchInput);

  const products = useProducts({ category, search });
  const limit = usePurchaseLimit();

  /**
   * Column count is derived from the live viewport rather than a device check,
   * so it also handles split-screen, foldables and rotation.
   */
  const { columns, cardWidth } = useMemo(() => {
    const available = width - GUTTER * 2;
    const count = width >= 900 ? 4 : width >= 620 ? 3 : 2;
    return {
      columns: count,
      cardWidth: Math.floor((available - GAP * (count - 1)) / count),
    };
  }, [width]);

  const refreshAll = useCallback(() => {
    products.refresh();
    limit.refresh();
  }, [products, limit]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ProductSummary>) => (
      <ProductCard product={item} onPress={onSelectProduct} width={cardWidth} />
    ),
    [cardWidth, onSelectProduct],
  );

  const header = (
    <View style={styles.header}>
      <PurchaseLimitCard
        limit={limit.data}
        loading={limit.isLoading}
        errored={limit.status === 'error'}
      />

      <View style={styles.searchRow}>
        <View style={styles.searchField}>
          <SearchField value={searchInput} onChangeText={setSearchInput} />
        </View>
        {__DEV__ ? (
          <View style={styles.devSlot}>
            <DevPanel onChange={refreshAll} />
          </View>
        ) : null}
      </View>

      <View style={styles.categories}>
        <SegmentedTabs
          scrollable
          items={PRODUCT_CATEGORIES}
          value={category}
          onChange={setCategory}
        />
      </View>

      {products.status === 'success' && products.data ? (
        <AppText variant="caption" style={styles.count}>
          {products.data.length} {products.data.length === 1 ? 'product' : 'products'} available on
          no-cost EMI
        </AppText>
      ) : null}
    </View>
  );

  if (products.isLoading && !products.data) {
    return (
      <ScrollView
        contentContainerStyle={styles.loadingWrap}
        showsVerticalScrollIndicator={false}
      >
        {header}
        <View style={styles.skeletonGrid}>
          {Array.from({ length: columns * 2 }).map((_, index) => (
            <ProductCardSkeleton key={index} width={cardWidth} />
          ))}
        </View>
      </ScrollView>
    );
  }

  return (
    <FlatList
      // numColumns cannot change on a mounted list, so the key forces a remount
      // when the viewport crosses a breakpoint.
      key={`grid-${columns}`}
      data={products.data ?? []}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      numColumns={columns}
      columnWrapperStyle={columns > 1 ? styles.column : undefined}
      ListHeaderComponent={header}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl
          refreshing={products.isRefreshing}
          onRefresh={refreshAll}
          tintColor={colors.brand}
          colors={[colors.brand]}
        />
      }
      ListEmptyComponent={
        products.status === 'error' ? (
          <StateView
            icon="alert"
            tone="danger"
            title="We could not load the Marketplace"
            message={products.error?.message}
            actionLabel={products.error?.retryable ? 'Try again' : undefined}
            onAction={products.retry}
          />
        ) : (
          <StateView
            icon="search"
            title="No products matched"
            message={
              search
                ? `Nothing here for "${search}". Try a different brand or category.`
                : 'This category is empty right now. Check back soon.'
            }
            actionLabel={search ? 'Clear search' : undefined}
            onAction={() => setSearchInput('')}
          />
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: GUTTER,
    paddingBottom: spacing.huge,
    gap: GAP,
  },
  loadingWrap: {
    paddingHorizontal: GUTTER,
    paddingBottom: spacing.huge,
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },
  header: {
    gap: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xs,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  searchField: {
    flex: 1,
  },
  devSlot: {
    width: 28,
  },
  categories: {
    marginHorizontal: -GUTTER,
  },
  count: {
    marginTop: -spacing.xs,
  },
  column: {
    gap: GAP,
  },
});
