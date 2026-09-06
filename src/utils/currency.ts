/**
 * Indian-locale currency helpers.
 *
 * `Intl` support inside the Hermes engine is inconsistent across RN versions, so
 * the lakh/crore grouping is done by hand to guarantee identical output on every
 * device.
 */

export function groupIndian(value: number): string {
  const rounded = Math.round(Math.abs(value));
  const asString = String(rounded);

  if (asString.length <= 3) {
    return asString;
  }

  const lastThree = asString.slice(-3);
  const rest = asString.slice(0, -3);
  const grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');

  return `${grouped},${lastThree}`;
}

export function formatCurrency(value: number, options?: { withDecimals?: boolean }): string {
  const sign = value < 0 ? '-' : '';

  if (options?.withDecimals) {
    const whole = Math.floor(Math.abs(value));
    const decimals = Math.round((Math.abs(value) - whole) * 100);
    return `${sign}\u20B9${groupIndian(whole)}.${String(decimals).padStart(2, '0')}`;
  }

  return `${sign}\u20B9${groupIndian(value)}`;
}

/** Compact form used on cards and chips, e.g. "₹1.2L", "₹84K". */
export function formatCompactCurrency(value: number): string {
  const abs = Math.abs(value);

  if (abs >= 10000000) {
    return `\u20B9${(value / 10000000).toFixed(abs % 10000000 === 0 ? 0 : 2)}Cr`;
  }
  if (abs >= 100000) {
    return `\u20B9${(value / 100000).toFixed(abs % 100000 === 0 ? 0 : 2)}L`;
  }
  if (abs >= 1000) {
    return `\u20B9${(value / 1000).toFixed(abs % 1000 === 0 ? 0 : 1)}K`;
  }
  return formatCurrency(value);
}

export function discountPercent(mrp: number, price: number): number {
  if (mrp <= 0 || price >= mrp) {
    return 0;
  }
  return Math.round(((mrp - price) / mrp) * 100);
}
