import React, { useState } from 'react';
import { Product } from '../types/catalog';
import { getFallbackImageSrc } from '../utils/image';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
}) => {
  const [imgSrc, setImgSrc] = useState(product.primaryImage);
  const [imageFailed, setImageFailed] = useState(false);

  const handleError = () => {
    const fallback = getFallbackImageSrc(imgSrc);
    if (fallback) {
      setImgSrc(fallback);
    } else {
      setImageFailed(true);
    }
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group cursor-pointer select-none transition-all duration-200"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(product);
        }
      }}
      aria-label={product.titleEn}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-white border border-neutral-200/90 transition-colors duration-200 group-hover:border-neutral-900">
        {!imageFailed ? (
          <img
            src={imgSrc}
            alt={product.titleEn}
            referrerPolicy="no-referrer"
            onError={handleError}
            loading="lazy"
            className="w-full h-full object-contain p-3 sm:p-5 md:p-6 transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-6 bg-neutral-100 text-neutral-400 font-mono-nums text-xs uppercase">
            <span>{product.code}</span>
          </div>
        )}
      </div>
    </div>
  );
};
