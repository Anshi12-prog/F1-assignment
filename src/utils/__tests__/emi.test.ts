import { amortisedEmi, buildEmiPlans, pledgeRequirement, startingEmiFor } from '../emi';
import { formatCompactCurrency, formatCurrency, groupIndian } from '../currency';
import { PurchaseLimit } from '@/types/marketplace';

const limit: PurchaseLimit = {
  totalLimit: 350000,
  availableLimit: 182500,
  utilisedLimit: 167500,
  pledgedPortfolioValue: 700000,
  ltvPercent: 50,
  lastRefreshedAt: '2026-09-06T09:12:00.000Z',
};

describe('currency formatting', () => {
  it('groups in the Indian system', () => {
    expect(groupIndian(1234567)).toBe('12,34,567');
    expect(groupIndian(99999)).toBe('99,999');
    expect(groupIndian(500)).toBe('500');
  });

  it('formats compact values', () => {
    expect(formatCompactCurrency(182500)).toBe('\u20B91.83L');
    expect(formatCompactCurrency(45000)).toBe('\u20B945K');
  });

  it('prefixes the rupee sign', () => {
    expect(formatCurrency(119900)).toBe('\u20B91,19,900');
  });
});

describe('EMI maths', () => {
  it('splits principal evenly for no-cost tenures', () => {
    expect(amortisedEmi(120000, 0, 12)).toBe(10000);
  });

  it('charges interest on priced tenures', () => {
    const emi = amortisedEmi(100000, 12, 12);
    expect(emi).toBeGreaterThan(100000 / 12);
    expect(Math.round(emi)).toBe(8885);
  });

  it('marks a lien above the drawdown at the lender LTV', () => {
    expect(pledgeRequirement(100000, 50)).toBe(200000);
  });
});

describe('buildEmiPlans', () => {
  const product = {
    availableTenures: [3, 6, 9, 12, 18],
    noCostTenures: [3, 6, 9],
    interestRate: 12,
  };

  it('prices no-cost tenures at zero interest', () => {
    const plans = buildEmiPlans({ product, variant: { price: 90000 }, limit });
    const nineMonth = plans.find((plan) => plan.tenureMonths === 9);

    expect(nineMonth?.isNoCost).toBe(true);
    expect(nineMonth?.interestComponent).toBe(0);
    expect(nineMonth?.totalPayable).toBe(90000);
  });

  it('flags plans above the available limit as ineligible', () => {
    const plans = buildEmiPlans({ product, variant: { price: 224990 }, limit });
    expect(plans.every((plan) => !plan.eligible)).toBe(true);
    expect(plans[0].ineligibleReason).toBeDefined();
  });

  it('never tags an ineligible plan as recommended', () => {
    const plans = buildEmiPlans({ product, variant: { price: 224990 }, limit });
    expect(plans.some((plan) => plan.tag === 'RECOMMENDED')).toBe(false);
  });

  it('recommends the longest no-cost tenure the user can afford', () => {
    const plans = buildEmiPlans({ product, variant: { price: 90000 }, limit });
    const recommended = plans.find((plan) => plan.tag === 'RECOMMENDED');
    expect(recommended?.tenureMonths).toBe(9);
  });
});

describe('startingEmiFor', () => {
  it('uses the longest no-cost tenure for the listing card', () => {
    expect(startingEmiFor({ noCostTenures: [3, 6, 12] }, 120000)).toEqual({
      amount: 10000,
      tenure: 12,
    });
  });
});
