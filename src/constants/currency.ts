import { Currency } from '../types/catalog';

export const DEFAULT_CURRENCY: Currency = 'JPY';

export const CURRENCY_CONFIG: Record<Currency, { symbol: string; locale: string; label: string }> = {
  JPY: { symbol: '¥', locale: 'ja-JP', label: '¥ JPY' },
  USD: { symbol: '$', locale: 'en-US', label: '$ USD' },
};

/** Suffix appended to tax-inclusive JPY prices. */
export const JPY_TAX_INCLUDED_SUFFIX = ' (税込)';
