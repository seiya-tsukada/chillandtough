import React, { useState } from 'react';
import { Product } from '../types/catalog';

interface ProductCardProps {
  product: Product;
  currency: 'JPY' | 'USD';
  onSelect: (product: Product) => void;
  columns: 2 | 3 | 4;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
}) => {
  const [imgSrc, setImgSrc] = useState(product.primaryImage);
  const [imageFailed, setImageFailed] = useState(false);

  // Fallback to /images/ if bundled path fails
  const handleError = () => {
    if (imgSrc.startsWith('/src/assets/images/')) {
      const filename = imgSrc.replace('/src/assets/images/', '');
      setImgSrc(`/images/${filename}`);
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
      {/* Product Card: Product Image Only */}
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
