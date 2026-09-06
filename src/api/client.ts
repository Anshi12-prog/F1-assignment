/**
 * Mock transport layer.
 *
 * The Marketplace has no backend yet, so this module stands in for one. It is
 * deliberately shaped like a real HTTP client - latency, cancellation, typed
 * errors, retries and a small response cache - so that swapping it for `fetch`
 * against a live service is a one-file change and no screen or hook has to move.
 */

export type ApiErrorKind = 'network' | 'timeout' | 'not_found' | 'server' | 'cancelled';

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;
  readonly retryable: boolean;

  constructor(kind: ApiErrorKind, message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
    this.retryable = kind === 'network' || kind === 'timeout' || kind === 'server';
  }
}

export interface RequestOptions {
  signal?: AbortSignal;
  /** Skip the cache for this call (used by pull-to-refresh). */
  forceRefresh?: boolean;
  /** Cache time-to-live in ms. Defaults to 60s. */
  ttlMs?: number;
}

/**
 * Runtime switches a reviewer can flip from the in-app dev panel to see the
 * loading and error states without editing code.
 */
export const mockConfig = {
  minLatencyMs: 320,
  maxLatencyMs: 900,
  /** 0 = never fail, 1 = always fail. */
  failureRate: 0,
};

interface CacheEntry {
  value: unknown;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

export function invalidateCache(prefix?: string): void {
  if (!prefix) {
    cache.clear();
    return;
  }
  for (const key of Array.from(cache.keys())) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
}

function randomLatency(): number {
  const { minLatencyMs, maxLatencyMs } = mockConfig;
  return minLatencyMs + Math.random() * Math.max(0, maxLatencyMs - minLatencyMs);
}

function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new ApiError('cancelled', 'Request cancelled'));
      return;
    }

    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);

    function onAbort() {
      clearTimeout(timer);
      reject(new ApiError('cancelled', 'Request cancelled'));
    }

    signal?.addEventListener('abort', onAbort);
  });
}

/**
 * Resolves `producer` as though it came off the wire.
 *
 * `producer` is lazy so the "payload" is only materialised after the simulated
 * round trip succeeds - the same ordering a real request would have.
 */
export async function request<T>(
  key: string,
  producer: () => T,
  options: RequestOptions = {},
): Promise<T> {
  const { signal, forceRefresh = false, ttlMs = 60_000 } = options;

  if (!forceRefresh) {
    const hit = cache.get(key);
    if (hit && hit.expiresAt > Date.now()) {
      return hit.value as T;
    }
  }

  await wait(randomLatency(), signal);

  if (Math.random() < mockConfig.failureRate) {
    throw new ApiError('network', 'We could not reach the 1Fi servers. Check your connection.');
  }

  const value = producer();
  cache.set(key, { value, expiresAt: Date.now() + ttlMs });
  return value;
}

/** Normalises anything thrown inside the data layer into an ApiError. */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }
  if (error instanceof Error) {
    return new ApiError('server', error.message);
  }
  return new ApiError('server', 'Something went wrong. Please try again.');
}

export function isCancellation(error: unknown): boolean {
  return error instanceof ApiError && error.kind === 'cancelled';
}
