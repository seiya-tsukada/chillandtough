import React, { useState, useEffect } from 'react';
import { Currency, Product } from '../types/catalog';
import { DEFAULT_SIZES, FREE_SIZE } from '../constants/catalog';
import { formatAmountWithTax, getUnitPrice } from '../utils/format';
import { getFallbackImageSrc } from '../utils/image';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  currency: Currency;
  onPrevProduct: () => void;
  onNextProduct: () => void;
  onAddToCart: (product: Product, size: string) => void;
  onQuickBuy: (product: Product, size: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  currency,
  onPrevProduct,
  onNextProduct,
  onAddToCart,
  onQuickBuy,
}) => {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setImgSrc(product.primaryImage);
      setSelectedSize(null);
      setJustAdded(false);
    }
  }, [product]);

  useKeyboardShortcuts({
    Escape: onClose,
    ArrowLeft: onPrevProduct,
    ArrowRight: onNextProduct,
  });

  if (!product) return null;

  const formattedPrice = formatAmountWithTax(getUnitPrice(product, currency), currency);

  const handleImageError = () => {
    const fallback = getFallbackImageSrc(imgSrc);
    if (fallback) setImgSrc(fallback);
  };

  // Distinct list of available sizes (e.g., S, M, L, XL or FREE)
  const availableSizes =
    product.measurements && product.measurements.length > 0 && product.measurements[0].size
      ? product.category === 'GOODS'
        ? [FREE_SIZE]
        : product.measurements.map((m) => m.size)
      : DEFAULT_SIZES;

  // Single-size items (e.g. FREE) need no explicit selection
  const activeSize = availableSizes.length === 1 ? availableSizes[0] : selectedSize;

  const handleAddToCart = () => {
    if (!activeSize) return;
    onAddToCart(product, activeSize);
    setJustAdded(true);
  };

  const handleQuickBuy = () => {
    if (!activeSize) return;
    onQuickBuy(product, activeSize);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-[420px] bg-white border border-neutral-200 shadow-2xl overflow-hidden transition-all transform scale-100 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navigation strip */}
        <div className="flex items-center justify-end px-4 py-2.5 border-b border-neutral-100 bg-white">
          <div className="flex items-center gap-1">
            <button
              onClick={onPrevProduct}
              className="p-1 text-neutral-400 hover:text-neutral-900 transition-colors"
              title="Previous item (←)"
              aria-label="Previous product"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={onNextProduct}
              className="p-1 text-neutral-400 hover:text-neutral-900 transition-colors"
              title="Next item (→)"
              aria-label="Next product"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1 ml-1 text-neutral-400 hover:text-neutral-950 transition-colors"
              title="Close (Esc)"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Image */}
        <div className="relative aspect-[4/3] w-full bg-[#fdfdfd] border-b border-neutral-100 flex items-center justify-center p-6">
          <img
            src={imgSrc || product.primaryImage}
            alt={product.titleEn}
            onError={handleImageError}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain select-none"
          />
        </div>

        <div className="p-5 space-y-4 text-left">
          {/* Title & Japanese Subtitle */}
          <div>
            <h2 className="text-base font-bold tracking-tight text-neutral-950 font-sans leading-snug">
              {product.titleEn}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5 font-sans">
              {product.titleJp}
            </p>
          </div>

          {/* Price */}
          <div className="font-mono-nums text-sm font-semibold text-neutral-900">
            {formattedPrice}
          </div>

          {/* Sizes */}
          <div className="flex items-center gap-2 pt-1 border-t border-neutral-100">
            <span className="text-[11px] font-mono-nums uppercase text-neutral-400">
              SIZE:
            </span>
            <div className="flex items-center gap-1.5">
              {availableSizes.map((size) => {
                const isSelected = activeSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      setSelectedSize(size);
                      setJustAdded(false);
                    }}
                    aria-pressed={isSelected}
                    className={`px-2 py-0.5 text-xs font-mono-nums border transition-colors ${
                      isSelected
                        ? 'border-neutral-950 bg-neutral-950 text-white'
                        : 'border-neutral-200 text-neutral-800 bg-neutral-50 hover:border-neutral-500'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Purchase CTAs */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!activeSize}
              className="w-full py-2.5 text-xs font-semibold tracking-wide bg-neutral-950 text-white hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
            >
              {justAdded ? 'カートに追加しました ✓' : 'カートに入れる'}
            </button>
            <button
              type="button"
              onClick={handleQuickBuy}
              disabled={!activeSize}
              className="w-full py-2.5 text-xs font-semibold tracking-wide border border-neutral-950 text-neutral-950 hover:bg-neutral-100 disabled:border-neutral-300 disabled:text-neutral-300 disabled:cursor-not-allowed transition-colors"
            >
              Quick buy
            </button>
            {!activeSize && (
              <p className="text-[11px] text-neutral-400 font-sans">サイズを選択してください</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
