import { EmiPlan, Product, ProductVariant, PurchaseLimit } from '@/types/marketplace';

/**
 * EMI maths for a mutual-fund backed drawdown.
 *
 * 1Fi's core promise is no-cost EMI on merchant-funded tenures - the customer
 * repays principal only. Longer tenures outside that window are priced at the
 * lender's reducing-balance rate, which is what `amortisedEmi` models.
 *
 * Kept as pure functions so the same logic can be unit-tested and later reused by
 * a real backend without touching the UI.
 */

/** Standard reducing-balance instalment. */
export function amortisedEmi(principal: number, annualRate: number, months: number): number {
  if (annualRate <= 0) {
    return principal / months;
  }
  const monthlyRate = annualRate / 12 / 100;
  const factor = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * factor) / (factor - 1);
}

/**
 * A lien is marked at the lender's LTV, so the pledged mutual fund value is
 * always larger than the drawdown itself.
 */
export function pledgeRequirement(principal: number, ltvPercent: number): number {
  if (ltvPercent <= 0) {
    return principal;
  }
  return Math.ceil((principal / (ltvPercent / 100)) / 100) * 100;
}

interface BuildPlansArgs {
  product: Pick<Product, 'availableTenures' | 'noCostTenures' | 'interestRate'>;
  variant: Pick<ProductVariant, 'price'>;
  limit: PurchaseLimit | null;
}

/**
 * Produces the full ladder of EMI plans for a variant, annotated with
 * eligibility against the user's live purchase limit.
 */
export function buildEmiPlans({ product, variant, limit }: BuildPlansArgs): EmiPlan[] {
  const principal = variant.price;

  const plans = product.availableTenures.map<EmiPlan>((tenureMonths) => {
    const isNoCost = product.noCostTenures.includes(tenureMonths);
    const interestRate = isNoCost ? 0 : product.interestRate;
    const monthlyEmi = Math.round(amortisedEmi(principal, interestRate, tenureMonths));
    const totalPayable = isNoCost ? principal : monthlyEmi * tenureMonths;
    const pledgeAmount = pledgeRequirement(principal, limit?.ltvPercent ?? 50);

    const eligible = limit ? principal <= limit.availableLimit : true;

    return {
      id: `${tenureMonths}m`,
      tenureMonths,
      monthlyEmi,
      totalPayable,
      interestComponent: Math.max(0, totalPayable - principal),
      interestRate,
      isNoCost,
      pledgeAmount,
      eligible,
      ineligibleReason: eligible
        ? undefined
        : 'Purchase amount is above your available limit. Pledge more units to unlock.',
    };
  });

  return tagPlans(plans);
}

/**
 * Merchandising tags. Only ever one of each, and never on an ineligible plan -
 * recommending something the user cannot pick is a trust problem, not a nudge.
 */
function tagPlans(plans: EmiPlan[]): EmiPlan[] {
  const eligible = plans.filter((plan) => plan.eligible);
  if (eligible.length === 0) {
    return plans;
  }

  const longestNoCost = eligible
    .filter((plan) => plan.isNoCost)
    .sort((a, b) => b.tenureMonths - a.tenureMonths)[0];

  const lowestEmi = [...eligible].sort((a, b) => a.monthlyEmi - b.monthlyEmi)[0];
  const shortest = [...eligible].sort((a, b) => a.tenureMonths - b.tenureMonths)[0];

  return plans.map((plan) => {
    if (longestNoCost && plan.id === longestNoCost.id) {
      return { ...plan, tag: 'RECOMMENDED' as const };
    }
    if (lowestEmi && plan.id === lowestEmi.id && plan.id !== longestNoCost?.id) {
      return { ...plan, tag: 'LOWEST_EMI' as const };
    }
    if (shortest && plan.id === shortest.id && plan.id !== longestNoCost?.id && plan.id !== lowestEmi?.id) {
      return { ...plan, tag: 'FASTEST_PAYOFF' as const };
    }
    return plan;
  });
}

export function planTagLabel(tag: EmiPlan['tag']): string | null {
  switch (tag) {
    case 'RECOMMENDED':
      return 'Recommended';
    case 'LOWEST_EMI':
      return 'Lowest EMI';
    case 'FASTEST_PAYOFF':
      return 'Fastest payoff';
    default:
      return null;
  }
}

/** Starting EMI shown on listing cards - cheapest no-cost instalment. */
export function startingEmiFor(
  product: Pick<Product, 'noCostTenures'>,
  price: number,
): { amount: number; tenure: number } {
  const longest = [...product.noCostTenures].sort((a, b) => b - a)[0] ?? 12;
  return { amount: Math.round(price / longest), tenure: longest };
}
