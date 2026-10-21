export interface SizeMeasurement {
  size: 'S' | 'M' | 'L' | 'XL';
  length: number; // 着丈
  chest: number; // 身幅
  shoulder: number; // 肩幅
  sleeve: number; // 裄丈 / 袖丈
  waist?: number; // ウエスト (for pants)
  inseam?: number; // 股下 (for pants)
}

export type Category = 'ALL' | 'OUTERWEAR' | 'TOPS' | 'BOTTOMS' | 'GOODS';

export type ReleaseSeason = '2026 S/S' | '2025 F/W' | 'ARCHIVE';

export interface Product {
  id: string;
  code: string;
  titleEn: string;
  titleJp: string;
  category: Category;
  season: ReleaseSeason;
  releaseDate: string;
  priceJpy: number;
  priceUsd: number;
  colors: {
    name: string;
    hex: string;
  }[];
  material: string;
  origin: string;
  descriptionEn: string;
  descriptionJp: string;
  primaryImage: string;
  status: 'ARCHIVE' | 'RELEASED' | 'LOTTERY CLOSED';
  measurements: SizeMeasurement[];
  details: string[];
}

export interface CartItem {
  productId: string;
  size: string;
  quantity: number;
}
