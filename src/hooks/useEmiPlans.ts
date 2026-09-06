import { useCallback } from 'react';
import { fetchEmiPlans } from '@/api';
import { EmiPlan } from '@/types/marketplace';
import { AsyncResource, useAsyncResource } from './useAsyncResource';

export function useEmiPlans(
  productId: string | undefined,
  variantId: string | undefined,
): AsyncResource<EmiPlan[]> {
  const fetcher = useCallback(
    (options: Parameters<typeof fetchEmiPlans>[2]) =>
      fetchEmiPlans(productId as string, variantId as string, options),
    [productId, variantId],
  );

  return useAsyncResource(fetcher, [productId, variantId], {
    enabled: Boolean(productId && variantId),
  });
}
