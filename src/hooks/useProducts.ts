import { useCallback } from 'react';
import { fetchProducts } from '@/api';
import { ProductCategoryId, ProductSummary } from '@/types/marketplace';
import { AsyncResource, useAsyncResource } from './useAsyncResource';

interface Params {
  category: ProductCategoryId;
  search: string;
}

export function useProducts({ category, search }: Params): AsyncResource<ProductSummary[]> {
  const fetcher = useCallback(
    (options: Parameters<typeof fetchProducts>[1]) => fetchProducts({ category, search }, options),
    [category, search],
  );

  return useAsyncResource(fetcher, [category, search]);
}
