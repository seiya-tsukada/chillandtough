import { CURRENCY_CONFIG, JPY_TAX_INCLUDED_SUFFIX } from '../constants/currency';
import { Currency, Product } from '../types/catalog';

/** Formats an amount with the currency symbol and locale grouping, e.g. ¥39,600 / $260. */
export const formatAmount = (amount: number, currency: Currency): string => {
  const { symbol, locale } = CURRENCY_CONFIG[currency];
  return `${symbol}${amount.toLocaleString(locale)}`;
};

/** Same as formatAmount, with the tax-included suffix for JPY. */
export const formatAmountWithTax = (amount: number, currency: Currency): string =>
  formatAmount(amount, currency) + (currency === 'JPY' ? JPY_TAX_INCLUDED_SUFFIX : '');

export const getUnitPrice = (product: Product, currency: Currency): number =>
  currency === 'JPY' ? product.priceJpy : product.priceUsd;

/** Today's date in the catalog's release date format (YYYY.MM.DD, UTC). */
export const todayAsReleaseDate = (): string =>
  new Date().toISOString().slice(0, 10).replace(/-/g, '.');
