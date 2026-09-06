import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError, RequestOptions, isCancellation, toApiError } from '@/api';

export type ResourceStatus = 'idle' | 'loading' | 'refreshing' | 'success' | 'error';

export interface AsyncResource<T> {
  data: T | null;
  error: ApiError | null;
  status: ResourceStatus;
  /** True only on the first load, when there is nothing to show yet. */
  isLoading: boolean;
  /** True while a pull-to-refresh is in flight over existing data. */
  isRefreshing: boolean;
  refresh: () => void;
  retry: () => void;
}

type Fetcher<T> = (options: RequestOptions) => Promise<T>;

interface Config {
  /** Skip fetching until this flips true (e.g. waiting on a variant id). */
  enabled?: boolean;
}

/**
 * One place where async state lives.
 *
 * Handles the four things every screen otherwise re-implements badly: first-load
 * vs refresh distinction, request cancellation on unmount or param change,
 * typed errors, and retry. Screens then only render state, never manage it.
 */
export function useAsyncResource<T>(
  fetcher: Fetcher<T>,
  deps: ReadonlyArray<unknown>,
  config: Config = {},
): AsyncResource<T> {
  const { enabled = true } = config;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [status, setStatus] = useState<ResourceStatus>(enabled ? 'loading' : 'idle');

  const controllerRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      controllerRef.current?.abort();
    };
  }, []);

  const load = useCallback(
    async (mode: 'initial' | 'refresh') => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      setStatus(mode === 'refresh' ? 'refreshing' : 'loading');
      if (mode === 'initial') {
        setError(null);
      }

      try {
        const result = await fetcherRef.current({
          signal: controller.signal,
          forceRefresh: mode === 'refresh',
        });

        if (!mountedRef.current || controller.signal.aborted) {
          return;
        }

        setData(result);
        setError(null);
        setStatus('success');
      } catch (thrown) {
        if (isCancellation(thrown) || !mountedRef.current) {
          return;
        }
        setError(toApiError(thrown));
        setStatus('error');
      }
    },
    [],
  );

  useEffect(() => {
    if (!enabled) {
      setStatus('idle');
      return;
    }
    void load('initial');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, load, ...deps]);

  const refresh = useCallback(() => {
    if (enabled) {
      void load('refresh');
    }
  }, [enabled, load]);

  const retry = useCallback(() => {
    if (enabled) {
      void load('initial');
    }
  }, [enabled, load]);

  return {
    data,
    error,
    status,
    isLoading: status === 'loading',
    isRefreshing: status === 'refreshing',
    refresh,
    retry,
  };
}
