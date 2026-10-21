import React, { useState } from 'react';
import { X, CheckCircle, CreditCard, Shield, Truck, Sparkles } from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import { OrderRecord } from '../types';

interface CheckoutModalProps {
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onClose }) => {
  const { cart, cartSubtotal, processCheckout, setIsCartOpen } = useCommerce();
  const [name, setName] = useState('山下 葵 (Aoi Yamashita)');
  const [email, setEmail] = useState('aoi.yamashita@example.jp');
  const [address, setAddress] = useState('東京都渋谷区神宮前4-12-10 表参道ヒルズレジデンス');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'apple_pay' | 'cod'>('stripe');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderRecord | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const order = await processCheckout({
        name,
        email,
        address,
        provider: paymentMethod
      });
      setCompletedOrder(order);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    onClose();
    setIsCartOpen(false);
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <h3 className="text-base font-bold text-neutral-900">
            {completedOrder ? 'ご注文完了' : 'エクスプレス決済手続き'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-800 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {completedOrder ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-neutral-900 mb-1">
                ご注文ありがとうございます！
              </h4>
              <p className="text-xs text-neutral-500 mb-6">
                注文番号: <span className="font-mono font-semibold text-neutral-800">{completedOrder.id}</span>
              </p>

              {/* Order Receipt Box */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-left mb-6 text-xs space-y-2">
                <div className="flex justify-between font-semibold text-neutral-900 pb-2 border-b border-neutral-200">
                  <span>お届け先</span>
                  <span>{completedOrder.customerName} 様</span>
                </div>
                <div className="text-neutral-600">
                  <p>{completedOrder.customerEmail}</p>
                  <p className="truncate mt-0.5">{address}</p>
                </div>
                <div className="pt-2 border-t border-neutral-200">
                  <div className="text-neutral-500 mb-1">購入明細:</div>
                  {completedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-neutral-700 py-0.5">
                      <span>{item.productName} × {item.quantity}</span>
                      <span className="tabular-nums font-medium">¥{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold text-neutral-900 pt-2 border-t border-neutral-200 text-sm">
                    <span>決済合計金額</span>
                    <span className="tabular-nums">¥{completedOrder.totalAmountJpy.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-left flex items-start gap-2.5 mb-6">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-blue-900 leading-relaxed">
                  FastAPI バックエンド (/api/checkout) にトランザクションログとUTMアトリビューションが同期記録されました。管理画面「戦略・データ分析」タブで最新GMVに即時反映されます。
                </p>
              </div>

              <button
                onClick={handleFinish}
                className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                ショッピングを続ける
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Items Summary preview */}
              <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                <p className="text-xs font-semibold text-neutral-700 mb-2">
                  注文予定アイテム ({cart.length}件)
                </p>
                <div className="space-y-1 text-xs">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-neutral-600">
                      <span className="truncate pr-2">{item.product.name} × {item.quantity}</span>
                      <span className="tabular-nums font-medium shrink-0">
                        ¥{(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                    <span>合計</span>
                    <span className="tabular-nums">¥{cartSubtotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Customer Inputs */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  お名前
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  メールアドレス（注文確認メール送付先）
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  配送先住所
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                />
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  お支払い方法
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('stripe')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      paymentMethod === 'stripe'
                        ? 'border-neutral-900 bg-neutral-900 text-white'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 mb-1" />
                    <p className="text-xs font-semibold">クレジットカード</p>
                    <p className="text-[10px] opacity-75">Stripe 決済</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      paymentMethod === 'apple_pay'
                        ? 'border-neutral-900 bg-neutral-900 text-white'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    <Shield className="w-4 h-4 mb-1" />
                    <p className="text-xs font-semibold">Apple Pay</p>
                    <p className="text-[10px] opacity-75">ワンタッチ認証</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'border-neutral-900 bg-neutral-900 text-white'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    <Truck className="w-4 h-4 mb-1" />
                    <p className="text-xs font-semibold">代金引換</p>
                    <p className="text-[10px] opacity-75">お届け時払い</p>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer mt-4"
              >
                {isSubmitting ? '決済通信中...' : `¥${cartSubtotal.toLocaleString()} の支払いを完了する`}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
