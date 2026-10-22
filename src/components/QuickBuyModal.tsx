import React, { useEffect, useState } from 'react';
import { Currency, QuickBuyItem } from '../types/catalog';
import { PREFECTURES, QUANTITY_OPTIONS } from '../constants/checkout';
import { formatAmount as formatCurrencyAmount, getUnitPrice } from '../utils/format';
import { X, Lock } from 'lucide-react';

interface QuickBuyModalProps {
  item: QuickBuyItem | null;
  onClose: () => void;
  currency: Currency;
}

const inputClass =
  'w-full px-2.5 py-2 text-xs font-sans border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-300 focus:outline-none focus:border-neutral-950 transition-colors';

const labelClass = 'block text-[11px] font-mono-nums uppercase text-neutral-400 mb-1';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-[11px] font-mono-nums uppercase tracking-wide text-neutral-950 font-semibold">
    {children}
  </h3>
);

export const QuickBuyModal: React.FC<QuickBuyModalProps> = ({ item, onClose, currency }) => {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
  }, [item]);

  useEffect(() => {
    if (!item) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose]);

  if (!item) return null;
  const { product, size } = item;

  const unitPrice = getUnitPrice(product, currency);
  const formatAmount = (amount: number) => formatCurrencyAmount(amount, currency);
  const total = unitPrice * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: hand off to the payment provider (card data must go through its hosted fields, not this form)
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Quick buy"
    >
      <div
        className="relative w-full max-w-[460px] max-h-[calc(100vh-2rem)] flex flex-col bg-white border border-neutral-200 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-100">
          <span className="text-xs font-mono-nums uppercase text-neutral-500">Quick buy</span>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-950 transition-colors"
            title="Close (Esc)"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-6 text-left">
          {/* Order Summary */}
          <div className="flex gap-3">
            <img
              src={product.primaryImage}
              alt={product.titleEn}
              className="w-16 h-16 object-contain bg-[#fdfdfd] border border-neutral-100"
            />
            <div className="flex-1 min-w-0 space-y-1">
              <p className="text-xs font-bold text-neutral-950 truncate">{product.titleEn}</p>
              <p className="text-[11px] text-neutral-500">{product.titleJp}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-[11px] font-mono-nums text-neutral-500">
                  <span>SIZE: {size}</span>
                  <label className="flex items-center gap-1">
                    QTY:
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="border border-neutral-200 px-1 py-0.5 text-neutral-900 bg-white"
                    >
                      {QUANTITY_OPTIONS.map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <span className="text-xs font-mono-nums font-semibold">{formatAmount(total)}</span>
              </div>
            </div>
          </div>

          {/* Express Checkout (buttons only, no provider wiring yet)
              TODO: replace with each provider's official button assets before launch */}
          <div className="space-y-2">
            <SectionTitle>Express checkout</SectionTitle>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                className="h-10 flex items-center justify-center rounded bg-black text-white text-sm font-semibold hover:opacity-85 transition-opacity"
                aria-label="Apple Pay"
              >
                Apple Pay
              </button>
              <button
                type="button"
                className="h-10 flex items-center justify-center rounded bg-white border border-neutral-300 text-neutral-800 text-sm font-semibold hover:bg-neutral-50 transition-colors"
                aria-label="Google Pay"
              >
                <span className="font-bold mr-1">
                  <span className="text-[#4285F4]">G</span>
                </span>
                Pay
              </button>
              <button
                type="button"
                className="h-10 flex items-center justify-center rounded bg-[#FF0033] text-white text-sm font-bold hover:opacity-85 transition-opacity"
                aria-label="PayPay"
              >
                PayPay
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-neutral-400 font-sans">
            <span className="flex-1 border-t border-neutral-200" />
            またはカードで支払う
            <span className="flex-1 border-t border-neutral-200" />
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <SectionTitle>Contact</SectionTitle>
            <div>
              <label className={labelClass} htmlFor="qb-email">メールアドレス</label>
              <input id="qb-email" type="email" required autoComplete="email" placeholder="you@example.com" className={inputClass} />
            </div>
            <div>
              <label className={labelClass} htmlFor="qb-tel">電話番号</label>
              <input id="qb-tel" type="tel" required autoComplete="tel" placeholder="090-1234-5678" className={inputClass} />
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-3">
            <SectionTitle>Shipping address</SectionTitle>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={labelClass} htmlFor="qb-family-name">姓</label>
                <input id="qb-family-name" required autoComplete="family-name" placeholder="山田" className={inputClass} />
              </div>
              <div>
                <label className={labelClass} htmlFor="qb-given-name">名</label>
                <input id="qb-given-name" required autoComplete="given-name" placeholder="太郎" className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={labelClass} htmlFor="qb-postal">郵便番号</label>
                <input id="qb-postal" required inputMode="numeric" autoComplete="postal-code" placeholder="150-0001" className={inputClass} />
              </div>
              <div>
                <label className={labelClass} htmlFor="qb-pref">都道府県</label>
                <select id="qb-pref" required autoComplete="address-level1" defaultValue="" className={inputClass}>
                  <option value="" disabled>選択してください</option>
                  {PREFECTURES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass} htmlFor="qb-city">市区町村</label>
              <input id="qb-city" required autoComplete="address-level2" placeholder="渋谷区神宮前" className={inputClass} />
            </div>
            <div>
              <label className={labelClass} htmlFor="qb-line1">番地</label>
              <input id="qb-line1" required autoComplete="address-line1" placeholder="1-2-3" className={inputClass} />
            </div>
            <div>
              <label className={labelClass} htmlFor="qb-line2">建物名・部屋番号（任意）</label>
              <input id="qb-line2" autoComplete="address-line2" placeholder="アーカイブビル 101" className={inputClass} />
            </div>
          </div>

          {/* Card Payment */}
          <div className="space-y-3">
            <SectionTitle>Card</SectionTitle>
            <div>
              <label className={labelClass} htmlFor="qb-cc-number">カード番号</label>
              <input id="qb-cc-number" required inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={labelClass} htmlFor="qb-cc-exp">有効期限</label>
                <input id="qb-cc-exp" required inputMode="numeric" autoComplete="cc-exp" placeholder="MM / YY" className={inputClass} />
              </div>
              <div>
                <label className={labelClass} htmlFor="qb-cc-csc">セキュリティコード</label>
                <input id="qb-cc-csc" required inputMode="numeric" autoComplete="cc-csc" placeholder="123" className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass} htmlFor="qb-cc-name">カード名義</label>
              <input id="qb-cc-name" required autoComplete="cc-name" placeholder="TARO YAMADA" className={inputClass} />
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-neutral-100 pt-4 space-y-1.5 text-xs font-mono-nums">
            <div className="flex justify-between text-neutral-500">
              <span>小計</span>
              <span>{formatAmount(total)}</span>
            </div>
            <div className="flex justify-between text-neutral-500">
              <span>送料</span>
              {/* TODO: shipping fee policy not decided yet */}
              <span>—</span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-neutral-950 pt-1">
              <span>合計{currency === 'JPY' ? '（税込）' : ''}</span>
              <span>{formatAmount(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 flex items-center justify-center gap-1.5 text-xs font-semibold tracking-wide bg-neutral-950 text-white hover:bg-neutral-800 transition-colors"
          >
            <Lock className="w-3 h-3" />
            {formatAmount(total)} を支払う
          </button>
        </form>
      </div>
    </div>
  );
};
