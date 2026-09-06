import productsPayload from './mock/products.json';
import limitPayload from './mock/limit.json';
import { ApiError, RequestOptions, request } from './client';
import {
  EmiPlan,
  Product,
  ProductListQuery,
  ProductSummary,
  PurchaseLimit,
} from '@/types/marketplace';
import { buildEmiPlans, startingEmiFor } from '@/utils/emi';
import { addMonths } from '@/utils/date';

/**
 * Marketplace data access.
 *
 * Every screen talks to the app through these functions and nothing else, so the
 * UI has no idea whether the data came from a JSON fixture or a live endpoint.
 */

const products = productsPayload as unknown as Product[];
const limit = limitPayload as PurchaseLimit;

function toSummary(product: Product): ProductSummary {
  const cheapest = [...product.variants].sort((a, b) => a.price - b.price)[0];
  const { amount, tenure } = startingEmiFor(product, cheapest.price);

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    category: product.category,
    tagline: product.tagline,
    rating: product.rating,
    ratingCount: product.ratingCount,
    mrp: cheapest.mrp,
    price: cheapest.price,
    imageUrl: cheapest.imageUrl ?? null,
    startingEmi: amount,
    longestNoCostTenure: tenure,
    inStock: product.variants.some((variant) => variant.inStock),
    badges: product.badges,
  };
}

function matchesQuery(product: Product, query: ProductListQuery): boolean {
  const { category, search } = query;

  if (category && category !== 'all' && product.category !== category) {
    return false;
  }

  if (search && search.trim().length > 0) {
    const needle = search.trim().toLowerCase();
    const haystack = [product.name, product.brand, product.tagline, product.category]
      .join(' ')
      .toLowerCase();
    if (!haystack.includes(needle)) {
      return false;
    }
  }

  return true;
}

export function fetchProducts(
  query: ProductListQuery = {},
  options?: RequestOptions,
): Promise<ProductSummary[]> {
  const key = `products:${query.category ?? 'all'}:${query.search ?? ''}`;
  return request(key, () => products.filter((p) => matchesQuery(p, query)).map(toSummary), options);
}

export function fetchProductById(productId: string, options?: RequestOptions): Promise<Product> {
  return request(
    `product:${productId}`,
    () => {
      const match = products.find((product) => product.id === productId);
      if (!match) {
        throw new ApiError('not_found', 'This product is no longer available.', 404);
      }
      return match;
    },
    options,
  );
}

export function fetchPurchaseLimit(options?: RequestOptions): Promise<PurchaseLimit> {
  return request('limit', () => limit, { ttlMs: 30_000, ...options });
}

/**
 * EMI plans are priced server-side in production (the ladder depends on the
 * lender's live policy), so the client asks for them per variant rather than
 * deriving them in a component.
 */
export function fetchEmiPlans(
  productId: string,
  variantId: string,
  options?: RequestOptions,
): Promise<EmiPlan[]> {
  return request(
    `emi:${productId}:${variantId}`,
    () => {
      const product = products.find((item) => item.id === productId);
      const variant = product?.variants.find((item) => item.id === variantId);

      if (!product || !variant) {
        throw new ApiError('not_found', 'We could not price this variant.', 404);
      }

      return buildEmiPlans({ product, variant, limit });
    },
    { ttlMs: 30_000, ...options },
  );
}

export interface CreateOrderInput {
  productId: string;
  variantId: string;
  planId: string;
}

export function createOrder(input: CreateOrderInput, options?: RequestOptions) {
  return request(
    `order:${input.productId}:${input.variantId}:${input.planId}:${Date.now()}`,
    () => {
      const product = products.find((item) => item.id === input.productId);
      const variant = product?.variants.find((item) => item.id === input.variantId);

      if (!product || !variant) {
        throw new ApiError('not_found', 'This item is no longer available.', 404);
      }

      const plan = buildEmiPlans({ product, variant, limit }).find(
        (item) => item.id === input.planId,
      );

      if (!plan) {
        throw new ApiError('server', 'That EMI plan has expired. Please pick another.');
      }
      if (!plan.eligible) {
        throw new ApiError('server', 'This plan is above your available purchase limit.');
      }

      return {
        orderId: `1FI${Date.now().toString().slice(-8)}`,
        productName: `${product.brand} ${product.name}`,
        variantLabel: variant.attributes.map((attribute) => attribute.value).join(' \u00B7 '),
        amount: variant.price,
        plan,
        firstEmiDate: addMonths(new Date(), 1).toISOString(),
        coolingOffDays: 3,
      };
    },
    { ttlMs: 0, ...options },
  );
}
