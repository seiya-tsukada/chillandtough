import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import { CheckoutModal } from './CheckoutModal';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    cartCount
  } = useCommerce();

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  if (!isCartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        />

        {/* Slide-over panel */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-neutral-900" />
                <h2 className="text-base font-bold text-neutral-900">
                  ショッピングバッグ ({cartCount})
                </h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-full transition-colors cursor-pointer"
                aria-label="Close Cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-neutral-100">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <ShoppingBag className="w-12 h-12 text-neutral-300 mb-3 stroke-1" />
                  <p className="text-sm font-semibold text-neutral-800">
                    ショッピングバッグは空です
                  </p>
                  <p className="text-xs text-neutral-500 mt-1 mb-6">
                    Instagramフィードの写真上のタグからアイテムを追加できます。
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
                  >
                    フィードを見る
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="py-4 flex gap-4">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-18 h-18 rounded-lg object-cover bg-neutral-100 shrink-0 border border-neutral-100"
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <p className="text-xs font-medium text-neutral-500">
                            {item.product.brand}
                          </p>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <h4 className="text-xs font-semibold text-neutral-900 truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-xs font-bold text-neutral-900 mt-0.5 tabular-nums">
                          ¥{item.product.price.toLocaleString()}
                        </p>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-neutral-200 rounded-md">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="p-1 text-neutral-600 hover:text-neutral-900 cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold text-neutral-900 tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="p-1 text-neutral-600 hover:text-neutral-900 cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer & Checkout Summary */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-neutral-200 bg-neutral-50">
                <div className="space-y-1.5 text-xs mb-4">
                  <div className="flex justify-between text-neutral-600">
                    <span>小計</span>
                    <span className="font-semibold text-neutral-900 tabular-nums">
                      ¥{cartSubtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>送料</span>
                    <span className="text-emerald-700 font-medium">無料</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                    <span>お支払い合計（税込）</span>
                    <span className="tabular-nums">
                      ¥{cartSubtotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsCheckoutModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-sm"
                >
                  <span>ご注文手続きへ進む</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-700" />
                  <span>Stripe & Apple Pay 暗号化セキュア決済</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutModalOpen && (
        <CheckoutModal onClose={() => setIsCheckoutModalOpen(false)} />
      )}
    </>
  );
};
