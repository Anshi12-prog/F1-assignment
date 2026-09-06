import { useCallback } from 'react';
import { fetchProductById } from '@/api';
import { Product } from '@/types/marketplace';
import { AsyncResource, useAsyncResource } from './useAsyncResource';

export function useProduct(productId: string): AsyncResource<Product> {
  const fetcher = useCallback(
    (options: Parameters<typeof fetchProductById>[1]) => fetchProductById(productId, options),
    [productId],
  );

  return useAsyncResource(fetcher, [productId]);
}
