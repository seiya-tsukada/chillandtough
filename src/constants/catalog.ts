import { Category, GridColumns, ProductStatus, ReleaseSeason, SizeMeasurement, ViewTab } from '../types/catalog';

/** Filter value meaning "no filter" (categories, seasons). */
export const ALL_FILTER = 'ALL';

/** Real product categories (without the 'ALL' filter value). */
export const PRODUCT_CATEGORIES: Exclude<Category, 'ALL'>[] = ['OUTERWEAR', 'TOPS', 'BOTTOMS', 'GOODS'];

/** Category filter options shown in catalog and admin lists. */
export const CATEGORY_FILTERS: Category[] = [ALL_FILTER, ...PRODUCT_CATEGORIES];

export const RELEASE_SEASONS: ReleaseSeason[] = ['2026 S/S', '2025 F/W', 'ARCHIVE'];

export const PRODUCT_STATUSES: ProductStatus[] = ['ARCHIVE', 'RELEASED', 'LOTTERY CLOSED'];

/** Status cycle used by the admin status toggle: ARCHIVE → RELEASED → LOTTERY CLOSED → ARCHIVE. */
export const NEXT_PRODUCT_STATUS: Record<ProductStatus, ProductStatus> = {
  ARCHIVE: 'RELEASED',
  RELEASED: 'LOTTERY CLOSED',
  'LOTTERY CLOSED': 'ARCHIVE',
};

/** Sizes offered when a product has no measurement data. */
export const DEFAULT_SIZES = ['S', 'M', 'L', 'XL'];

/** Single size used for GOODS. */
export const FREE_SIZE = 'FREE';

export const VIEW_TABS: { id: ViewTab; label: string; showCount?: boolean }[] = [
  { id: 'CATALOG', label: 'Catalog' },
  { id: 'INDEX', label: 'Index', showCount: true },
  { id: 'LOOKBOOK', label: 'Lookbook' },
  { id: 'INFO', label: 'About' },
];

export const DEFAULT_VIEW_TAB: ViewTab = 'CATALOG';

export const DEFAULT_GRID_COLUMNS: GridColumns = 3;

export const GRID_OPTIONS: { columns: GridColumns; title: string; ariaLabel: string }[] = [
  { columns: 2, title: '2 Columns (Large)', ariaLabel: '2 columns view' },
  { columns: 3, title: '3 Columns (Standard)', ariaLabel: '3 columns view' },
  { columns: 4, title: '4 Columns (Dense)', ariaLabel: '4 columns view' },
];

export type MeasurementField = Exclude<keyof SizeMeasurement, 'size'>;

/** Editable measurement columns (cm). BOTTOMS additionally use BOTTOMS_MEASUREMENT_COLUMNS. */
export const MEASUREMENT_COLUMNS: { field: MeasurementField; label: string }[] = [
  { field: 'length', label: 'LENGTH (着丈)' },
  { field: 'chest', label: 'CHEST (身幅)' },
  { field: 'shoulder', label: 'SHOULDER (肩幅)' },
  { field: 'sleeve', label: 'SLEEVE (袖丈)' },
];

export const BOTTOMS_MEASUREMENT_COLUMNS: { field: MeasurementField; label: string }[] = [
  { field: 'waist', label: 'WAIST (ウエスト)' },
  { field: 'inseam', label: 'INSEAM (股下)' },
];
