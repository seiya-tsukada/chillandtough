import React from 'react';
import { X, ShoppingBag, ShieldCheck, Truck, RefreshCw, Star } from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';

export const ProductModal: React.FC = () => {
  const { selectedProductModal, setSelectedProductModal, addToCart } = useCommerce();

  if (!selectedProductModal) return null;

  const product = selectedProductModal;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={() => setSelectedProductModal(null)}
          className="absolute top-3 right-3 z-20 p-1.5 text-neutral-500 hover:text-neutral-900 bg-white/80 hover:bg-white rounded-full transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Column */}
        <div className="w-full md:w-1/2 aspect-square md:aspect-auto bg-neutral-100 relative">
          <img
            src={product.imageUrl}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Details Column */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Brand & Stock */}
            <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
              <span className="font-semibold uppercase tracking-wider text-neutral-700">
                {product.brand}
              </span>
              <span className="text-neutral-500">
                在庫数: {product.inventoryCount}点
              </span>
            </div>

            {/* Title */}
            <h2 className="text-lg font-bold text-neutral-900 mb-2 leading-tight">
              {product.name}
            </h2>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-bold text-neutral-900 tabular-nums">
                ¥{product.price.toLocaleString()}
              </span>
              <span className="text-xs text-neutral-500">税込 · 全国送料無料</span>
            </div>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-1.5 text-xs text-neutral-600 mb-4 pb-4 border-b border-neutral-100">
                <div className="flex text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                </div>
                <span className="font-semibold text-neutral-900 tabular-nums">
                  {product.rating}
                </span>
                <span className="text-neutral-400">
                  ({product.reviewCount} 件の購入体験レビュー)
                </span>
              </div>
            )}

            {/* Description */}
            <p className="text-xs text-neutral-600 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Trust Markers */}
            <div className="space-y-2 text-xs text-neutral-500 mb-6">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-neutral-700 shrink-0" />
                <span>最短翌日発送（東京都内より発送）</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-neutral-700 shrink-0" />
                <span>正規工房・アトリエ直接納品 100%品質保証</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-neutral-700 shrink-0" />
                <span>到着後14日以内 返品・交換対応</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => {
              addToCart(product, 1);
              setSelectedProductModal(null);
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>ショッピングバッグに追加</span>
          </button>
        </div>
      </div>
    </div>
  );
};
