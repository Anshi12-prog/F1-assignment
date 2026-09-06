/**
 * Domain models for the 1Fi Marketplace.
 *
 * These types are the contract between the data layer (`src/api`) and the UI.
 * Components never invent shapes of their own - if the real backend lands, only
 * `src/api` changes.
 */

export type ProductCategoryId =
  | 'all'
  | 'smartphones'
  | 'laptops'
  | 'wearables'
  | 'audio'
  | 'television'
  | 'appliances';

export interface ProductCategory {
  id: ProductCategoryId;
  label: string;
}

/** A single selectable attribute of a variant, e.g. Storage = 256 GB. */
export interface VariantAttribute {
  /** Stable key used to group options, e.g. "storage" | "color". */
  key: string;
  /** Human label for the group, e.g. "Storage". */
  groupLabel: string;
  /** Value shown on the chip, e.g. "256 GB". */
  value: string;
  /** Optional swatch for colour-type attributes. */
  hex?: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  attributes: VariantAttribute[];
  /** Listed price before discount, in paise-free rupees. */
  mrp: number;
  /** Actual payable price. */
  price: number;
  inStock: boolean;
  /** Remote image; the UI falls back to a generated glyph when absent/broken. */
  imageUrl?: string | null;
}

export interface SpecificationGroup {
  title: string;
  items: Array<{ label: string; value: string }>;
}

export interface Merchant {
  id: string;
  name: string;
  /** e.g. "Delivered in 2-4 days". */
  deliveryEta: string;
  warranty: string;
  returnWindowDays: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: Exclude<ProductCategoryId, 'all'>;
  tagline: string;
  description: string;
  rating: number;
  ratingCount: number;
  highlights: string[];
  specifications: SpecificationGroup[];
  merchant: Merchant;
  variants: ProductVariant[];
  /** Tenures the merchant has funded for no-cost EMI on this product. */
  noCostTenures: number[];
  /** Every tenure the lender offers on this product. */
  availableTenures: number[];
  /** Annualised rate applied to tenures outside `noCostTenures`. */
  interestRate: number;
  badges?: string[];
}

/** Lightweight projection used by the listing grid - keeps the list payload small. */
export interface ProductSummary {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: Exclude<ProductCategoryId, 'all'>;
  tagline: string;
  rating: number;
  ratingCount: number;
  mrp: number;
  price: number;
  imageUrl?: string | null;
  /** Cheapest monthly instalment across the no-cost tenures. */
  startingEmi: number;
  longestNoCostTenure: number;
  inStock: boolean;
  badges?: string[];
}

export interface EmiPlan {
  id: string;
  tenureMonths: number;
  monthlyEmi: number;
  /** Principal + interest across the full tenure. */
  totalPayable: number;
  interestComponent: number;
  interestRate: number;
  isNoCost: boolean;
  /** Mutual fund value that gets lien-marked for this drawdown. */
  pledgeAmount: number;
  /** True when the user's available purchase limit covers this plan. */
  eligible: boolean;
  ineligibleReason?: string;
  tag?: 'RECOMMENDED' | 'LOWEST_EMI' | 'FASTEST_PAYOFF';
}

export interface PurchaseLimit {
  totalLimit: number;
  availableLimit: number;
  utilisedLimit: number;
  pledgedPortfolioValue: number;
  ltvPercent: number;
  lastRefreshedAt: string;
}

export interface OrderConfirmation {
  orderId: string;
  productName: string;
  variantLabel: string;
  amount: number;
  plan: EmiPlan;
  firstEmiDate: string;
  coolingOffDays: number;
}

export interface ProductListQuery {
  category?: ProductCategoryId;
  search?: string;
}
