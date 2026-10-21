import React, { useState, useEffect } from 'react';
import { Product } from '../types/catalog';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  currency: 'JPY' | 'USD';
  onPrevProduct: () => void;
  onNextProduct: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  currency,
  onPrevProduct,
  onNextProduct,
}) => {
  const [imgSrc, setImgSrc] = useState<string>('');

  useEffect(() => {
    if (product) {
      setImgSrc(product.primaryImage);
    }
  }, [product]);

  // Keyboard navigation & escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrevProduct();
      if (e.key === 'ArrowRight') onNextProduct();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrevProduct, onNextProduct]);

  if (!product) return null;

  const formattedPrice =
    currency === 'JPY'
      ? `¥${product.priceJpy.toLocaleString('ja-JP')} (税込)`
      : `$${product.priceUsd.toLocaleString('en-US')}`;

  const handleImageError = () => {
    if (imgSrc.startsWith('/src/assets/images/')) {
      const filename = imgSrc.replace('/src/assets/images/', '');
      setImgSrc(`/images/${filename}`);
    }
  };

  // Distinct list of available sizes (e.g., S, M, L, XL or FREE)
  const availableSizes =
    product.measurements && product.measurements.length > 0 && product.measurements[0].size
      ? product.category === 'GOODS'
        ? ['FREE']
        : product.measurements.map((m) => m.size)
      : ['S', 'M', 'L', 'XL'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Centered Compact Floating Modal */}
      <div
        className="relative w-full max-w-[420px] bg-white border border-neutral-200 shadow-2xl overflow-hidden transition-all transform scale-100 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header / Navigation Strip */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-100 bg-white">
          <div className="flex items-center gap-1.5 text-xs font-mono-nums text-neutral-400">
            <span>{product.code}</span>
            <span>·</span>
            <span>{product.season}</span>
          </div>

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

        {/* Product Info Body: Title, Price, Sizes, Description */}
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

          {/* Available Sizes (S, M, L, XL) */}
          <div className="flex items-center gap-2 pt-1 border-t border-neutral-100">
            <span className="text-[11px] font-mono-nums uppercase text-neutral-400">
              SIZE:
            </span>
            <div className="flex items-center gap-1.5">
              {availableSizes.map((size) => (
                <span
                  key={size}
                  className="px-2 py-0.5 text-xs font-mono-nums border border-neutral-200 text-neutral-800 bg-neutral-50"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>

          {/* Colorways */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-mono-nums text-neutral-600">
              <span className="text-[11px] uppercase text-neutral-400">
                COLOR:
              </span>
              <span>{product.colors.map((c) => c.name).join(' / ')}</span>
            </div>
          )}

          {/* Natural Description (Concise & Clean) */}
          <div className="pt-2 border-t border-neutral-100 text-xs text-neutral-600 leading-relaxed font-sans space-y-1">
            <p>{product.descriptionEn}</p>
            <p className="text-neutral-400 text-[11px]">{product.descriptionJp}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
