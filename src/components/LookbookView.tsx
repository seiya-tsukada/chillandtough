import React from 'react';
import { Currency, Product } from '../types/catalog';
import { LOOKBOOK_SUBTITLE, LOOKBOOK_TITLE, LOOKS, LookProductRef } from '../data/looks';
import { ArrowUpRight } from 'lucide-react';

interface LookbookViewProps {
  products: Product[];
  onSelect: (product: Product) => void;
  currency: Currency;
}

const resolveProduct = (products: Product[], ref: LookProductRef): Product =>
  products.find((p) => p.code === ref.code) || products[ref.fallbackIndex];

// USD is intentionally shown without digit grouping here
const formatLookPrice = (product: Product, currency: Currency) =>
  currency === 'JPY' ? `¥${product.priceJpy.toLocaleString('ja-JP')}` : `$${product.priceUsd}`;

interface LookProductCardProps {
  product: Product;
  currency: Currency;
  onSelect: (product: Product) => void;
}

const LookProductCard: React.FC<LookProductCardProps> = ({ product, currency, onSelect }) => (
  <div
    onClick={() => onSelect(product)}
    className="group cursor-pointer bg-white border border-neutral-200 p-6 flex flex-col justify-between hover:border-neutral-900 transition-colors"
  >
    <div className="aspect-[4/3] w-full flex items-center justify-center overflow-hidden">
      <img
        src={product.primaryImage}
        alt={product.titleEn}
        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        referrerPolicy="no-referrer"
      />
    </div>
    <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
      <div>
        <span className="font-mono-nums text-[11px] text-neutral-400 uppercase">
          {product.code}
        </span>
        <h3 className="text-xs font-semibold text-neutral-900 font-sans">
          {product.titleEn}
        </h3>
      </div>
      <div className="flex items-center gap-1 text-xs font-mono-nums text-neutral-900">
        <span>{formatLookPrice(product, currency)}</span>
        <ArrowUpRight className="w-3.5 h-3.5" />
      </div>
    </div>
  </div>
);

export const LookbookView: React.FC<LookbookViewProps> = ({
  products,
  onSelect,
  currency,
}) => {
  const looks = LOOKS.map((look) => ({
    ...look,
    primaryProduct: resolveProduct(products, look.primary),
    secondaryProduct: resolveProduct(products, look.secondary),
  }));

  return (
    <div className="space-y-16 py-4">
      <div className="border-b border-neutral-200 pb-4">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-950 font-sans">
          {LOOKBOOK_TITLE}
        </h2>
        <p className="text-xs font-mono-nums text-neutral-500 mt-1">
          {LOOKBOOK_SUBTITLE}
        </p>
      </div>

      <div className="space-y-20">
        {looks.map((look) => (
          <div
            key={look.id}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-b border-neutral-200/80 pb-16"
          >
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <LookProductCard product={look.primaryProduct} currency={currency} onSelect={onSelect} />
              <LookProductCard product={look.secondaryProduct} currency={currency} onSelect={onSelect} />
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="text-xs font-mono-nums text-neutral-400 uppercase flex items-center gap-2">
                <span>{look.season}</span>
                <span>·</span>
                <span>{look.location}</span>
              </div>

              <div>
                <h3 className="text-lg font-bold tracking-tight text-neutral-950 font-sans">
                  {look.titleEn}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {look.titleJp}
                </p>
              </div>

              <p className="text-xs md:text-sm text-neutral-600 leading-relaxed">
                {look.notes}
              </p>

              <div className="pt-2 text-xs font-mono-nums text-neutral-500 space-y-1">
                <div>PRIMARY: {look.primaryProduct.titleEn} ({look.primaryProduct.code})</div>
                <div>SECONDARY: {look.secondaryProduct.titleEn} ({look.secondaryProduct.code})</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
