import React from 'react';
import { Currency, Product } from '../types/catalog';
import { formatAmount, getUnitPrice } from '../utils/format';
import { ArrowUpRight } from 'lucide-react';

interface IndexTableProps {
  products: Product[];
  currency: Currency;
  onSelect: (product: Product) => void;
}

export const IndexTable: React.FC<IndexTableProps> = ({
  products,
  currency,
  onSelect,
}) => {
  return (
    <div className="w-full overflow-x-auto border border-neutral-200 bg-white">
      <table className="w-full text-left text-xs font-mono-nums whitespace-nowrap">
        <thead className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider">
          <tr>
            <th className="py-3 px-4 font-medium">SKU / CODE</th>
            <th className="py-3 px-3 font-medium">PREVIEW</th>
            <th className="py-3 px-4 font-medium">ITEM NAME</th>
            <th className="py-3 px-4 font-medium">CATEGORY</th>
            <th className="py-3 px-4 font-medium">SEASON</th>
            <th className="py-3 px-4 font-medium">COLORS</th>
            <th className="py-3 px-4 font-medium">MATERIAL</th>
            <th className="py-3 px-4 font-medium">PRICE</th>
            <th className="py-3 px-4 font-medium">RELEASE</th>
            <th className="py-3 px-3 font-medium text-right">VIEW</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100 text-neutral-800">
          {products.map((product) => {
            const price = formatAmount(getUnitPrice(product, currency), currency);

            return (
              <tr
                key={product.id}
                onClick={() => onSelect(product)}
                className="hover:bg-neutral-50/90 cursor-pointer transition-colors group"
              >
                {/* Code */}
                <td className="py-3 px-4 font-semibold text-neutral-950">
                  {product.code}
                </td>

                {/* Thumbnail */}
                <td className="py-2 px-3">
                  <div className="w-12 h-9 bg-neutral-50 border border-neutral-200 overflow-hidden flex items-center justify-center">
                    <img
                      src={product.primaryImage}
                      alt={product.titleEn}
                      className="w-full h-full object-contain p-0.5 group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </td>

                {/* Name */}
                <td className="py-3 px-4">
                  <div className="font-sans font-medium text-neutral-900 group-hover:text-neutral-600 transition-colors">
                    {product.titleEn}
                  </div>
                  <div className="text-[11px] text-neutral-400 font-sans">
                    {product.titleJp}
                  </div>
                </td>

                {/* Category */}
                <td className="py-3 px-4 text-neutral-600">
                  {product.category}
                </td>

                {/* Season */}
                <td className="py-3 px-4 text-neutral-600">
                  {product.season}
                </td>

                {/* Colors */}
                <td className="py-3 px-4 text-neutral-600">
                  {product.colors.map((c) => c.name).join(' / ')}
                </td>

                {/* Material */}
                <td className="py-3 px-4 max-w-xs truncate text-neutral-500" title={product.material}>
                  {product.material.split('/')[0]}
                </td>

                {/* Price */}
                <td className="py-3 px-4 font-semibold text-neutral-950">
                  {price}
                </td>

                {/* Release */}
                <td className="py-3 px-4 text-neutral-500">
                  {product.releaseDate}
                </td>

                {/* View Link */}
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(product);
                    }}
                    className="p-1 text-neutral-400 group-hover:text-neutral-950 transition-colors inline-flex items-center"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
