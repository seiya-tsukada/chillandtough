import React, { useState } from 'react';
import { Product } from '../types/catalog';
import { ArrowUpRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  currency: 'JPY' | 'USD';
  onSelect: (product: Product) => void;
  columns: 2 | 3 | 4;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  onSelect,
  columns,
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formattedPrice =
    currency === 'JPY'
      ? `¥${product.priceJpy.toLocaleString('ja-JP')}`
      : `$${product.priceUsd.toLocaleString('en-US')}`;

  return (
    <article
      onClick={() => onSelect(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer flex flex-col text-left transition-all duration-200"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-white border border-neutral-200/90 rounded-none transition-colors group-hover:border-neutral-900">
        {!imageFailed ? (
          <img
            src={product.primaryImage}
            alt={product.titleEn}
            referrerPolicy="no-referrer"
            onError={() => setImageFailed(true)}
            className="w-full h-full object-contain p-4 md:p-6 transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          /* Styled Fallback Container */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-neutral-100 text-neutral-400">
            <span className="font-mono text-xs tracking-wider uppercase mb-1">
              {product.code}
            </span>
            <span className="text-xs font-medium text-neutral-600 text-center">
              {product.titleEn}
            </span>
          </div>
        )}

        {/* Discreet Corner Tag */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[11px] font-mono-nums text-neutral-500 uppercase">
          <span>{product.code}</span>
          <span>·</span>
          <span>{product.season}</span>
        </div>

        {/* Hover inspect indicator */}
        <div
          className={`absolute bottom-3 right-3 flex items-center gap-1 text-[11px] font-mono-nums text-neutral-900 bg-white/90 backdrop-blur-sm px-2 py-1 border border-neutral-200 transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span>SPEC</span>
          <ArrowUpRight className="w-3 h-3" />
        </div>
      </div>

      {/* Product Details Section - Zero Pill Discipline */}
      <div className="pt-3 pb-1 flex flex-col gap-1">
        {/* Title */}
        <div className="flex items-baseline justify-between gap-2">
          <h2
            className={`font-semibold tracking-tight text-neutral-900 group-hover:text-neutral-600 transition-colors ${
              columns === 4 ? 'text-xs md:text-sm' : 'text-sm md:text-base'
            }`}
          >
            {product.titleEn}
          </h2>
          <span className="font-mono-nums font-medium text-xs md:text-sm text-neutral-950 whitespace-nowrap shrink-0">
            {formattedPrice}
          </span>
        </div>

        {/* Japanese Subtitle */}
        <p className="text-[11px] text-neutral-500 line-clamp-1">
          {product.titleJp}
        </p>

        {/* Metadata Row: Category, Colors, Origin (Unboxed Text with Typographic Separators) */}
        <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-neutral-500 pt-1 font-mono-nums">
          <span>{product.category}</span>
          <span aria-hidden="true">·</span>
          <span>{product.colors.map((c) => c.name).join(' / ')}</span>
          <span aria-hidden="true">·</span>
          <span>{product.origin}</span>
        </div>
      </div>
    </article>
  );
};
