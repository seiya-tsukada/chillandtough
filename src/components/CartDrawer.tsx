import React, { useEffect } from 'react';
import { CartItem, Product } from '../types/catalog';
import { X, Minus, Plus } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  products: Product[];
  currency: 'JPY' | 'USD';
  onUpdateQuantity: (productId: string, size: string, quantity: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  products,
  currency,
  onUpdateQuantity,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatPrice = (product: Product, quantity = 1) =>
    currency === 'JPY'
      ? `¥${(product.priceJpy * quantity).toLocaleString('ja-JP')}`
      : `$${(product.priceUsd * quantity).toLocaleString('en-US')}`;

  // Skip items whose product was removed from the catalog
  const lines = items
    .map((item) => ({ item, product: products.find((p) => p.id === item.productId) }))
    .filter((line): line is { item: CartItem; product: Product } => !!line.product);

  const subtotal = lines.reduce(
    (sum, { item, product }) =>
      sum + (currency === 'JPY' ? product.priceJpy : product.priceUsd) * item.quantity,
    0
  );
  const formattedSubtotal =
    currency === 'JPY'
      ? `¥${subtotal.toLocaleString('ja-JP')} (税込)`
      : `$${subtotal.toLocaleString('en-US')}`;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Cart"
    >
      <div
        className="w-full max-w-[380px] h-full bg-white border-l border-neutral-200 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
          <span className="text-xs font-mono-nums uppercase text-neutral-500">
            Cart ({lines.reduce((n, { item }) => n + item.quantity, 0)})
          </span>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-950 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-neutral-100">
          {lines.length === 0 && (
            <p className="p-6 text-xs text-neutral-400 font-sans">カートは空です</p>
          )}
          {lines.map(({ item, product }) => (
            <div key={`${item.productId}-${item.size}`} className="flex gap-3 p-4">
              <img
                src={product.primaryImage}
                alt={product.titleEn}
                className="w-16 h-16 object-contain bg-[#fdfdfd] border border-neutral-100"
              />
              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-xs font-bold text-neutral-950 truncate">{product.titleEn}</p>
                <p className="text-[11px] font-mono-nums text-neutral-500">SIZE: {item.size}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-neutral-200">
                    <button
                      onClick={() => onUpdateQuantity(item.productId, item.size, item.quantity - 1)}
                      className="p-1 text-neutral-500 hover:text-neutral-950"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 text-xs font-mono-nums">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.productId, item.size, item.quantity + 1)}
                      className="p-1 text-neutral-500 hover:text-neutral-950"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="text-xs font-mono-nums font-semibold">
                    {formatPrice(product, item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-neutral-100 p-4 space-y-3">
          <div className="flex items-center justify-between text-sm font-mono-nums font-semibold">
            <span className="text-[11px] uppercase text-neutral-400">Subtotal</span>
            <span>{formattedSubtotal}</span>
          </div>
          {/* Payment provider is not wired up yet */}
          <button
            disabled
            className="w-full py-2.5 text-xs font-semibold tracking-wide bg-neutral-300 text-white cursor-not-allowed"
          >
            購入手続きへ（準備中）
          </button>
        </div>
      </div>
    </div>
  );
};
