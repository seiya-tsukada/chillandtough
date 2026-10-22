import { Product, ProductColor, SizeMeasurement } from '../types/catalog';
import { SAMPLE_IMAGES } from './images';

export type AdminTab = 'PRODUCTS' | 'VERCEL_SPEC' | 'DATA';

export const ADMIN_TABS: { id: AdminTab; label: string; showCount?: boolean }[] = [
  { id: 'PRODUCTS', label: 'CATALOG ITEMS', showCount: true },
  { id: 'VERCEL_SPEC', label: 'VERCEL & PYTHON SPEC' },
  { id: 'DATA', label: 'BACKUP & IMPORT' },
];

export const NOTICE_DURATION_MS = 3000;

export const EXPORT_FILE_PREFIX = 'chillandtough_catalog_';

/** Color added by the editor's "add color" action. */
export const NEW_COLOR: ProductColor = { name: 'NAVY', hex: '#1a2332' };

export const DEFAULT_COLOR: ProductColor = { name: 'BLACK', hex: '#111111' };

export const DEFAULT_MEASUREMENTS: SizeMeasurement[] = [
  { size: 'S', length: 68, chest: 62, shoulder: 54, sleeve: 60 },
  { size: 'M', length: 71, chest: 65, shoulder: 56, sleeve: 62 },
  { size: 'L', length: 74, chest: 68, shoulder: 58, sleeve: 64 },
  { size: 'XL', length: 77, chest: 71, shoulder: 60, sleeve: 66 },
];

/** Initial editor state before the open/reset effect runs. */
export const INITIAL_EDITOR_VALUES: Omit<Product, 'id'> = {
  code: '',
  titleEn: '',
  titleJp: '',
  category: 'OUTERWEAR',
  season: '2026 S/S',
  releaseDate: '',
  priceJpy: 30000,
  priceUsd: 200,
  material: '',
  origin: 'MADE IN JAPAN (TOKYO)',
  descriptionEn: '',
  descriptionJp: '',
  primaryImage: SAMPLE_IMAGES[0].url,
  status: 'ARCHIVE',
  colors: [DEFAULT_COLOR],
  measurements: DEFAULT_MEASUREMENTS,
  details: ['Tokyo minimal cut', 'Pre-washed fabric'],
};

/** Prefilled values for a newly created product (code and releaseDate are generated). */
export const NEW_PRODUCT_DEFAULTS: Omit<Product, 'id' | 'code' | 'releaseDate'> = {
  titleEn: 'NEW CATALOG ITEM',
  titleJp: '新規カタログアイテム',
  category: 'TOPS',
  season: '2026 S/S',
  priceJpy: 25000,
  priceUsd: 165,
  material: '100% Japanese Combed Cotton',
  origin: 'MADE IN JAPAN (TOKYO)',
  descriptionEn: 'Minimalist everyday garment crafted with Tokyo design specifications.',
  descriptionJp: '東京の美意識に基づき仕立てられたミニマルなデイリーウェア。',
  primaryImage: SAMPLE_IMAGES[0].url,
  status: 'ARCHIVE',
  colors: [DEFAULT_COLOR, { name: 'WHITE', hex: '#ffffff' }],
  measurements: DEFAULT_MEASUREMENTS,
  details: ['Relaxed silhouette', 'High durability seams', 'Made in Tokyo'],
};

export const NEW_PRODUCT_CODE_PREFIX = 'AT-NEW';
