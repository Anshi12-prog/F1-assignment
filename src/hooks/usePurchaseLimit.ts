import { useCallback } from 'react';
import { fetchPurchaseLimit } from '@/api';
import { PurchaseLimit } from '@/types/marketplace';
import { AsyncResource, useAsyncResource } from './useAsyncResource';

export function usePurchaseLimit(): AsyncResource<PurchaseLimit> {
  const fetcher = useCallback(
    (options: Parameters<typeof fetchPurchaseLimit>[0]) => fetchPurchaseLimit(options),
    [],
  );

  return useAsyncResource(fetcher, []);
}
