import React from 'react';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';

export const Navbar: React.FC = () => {
  const {
    cartCount,
    setIsCartOpen,
    currentAppMode,
    setCurrentAppMode,
    setSelectedCategory
  } = useCommerce();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Wordmark (Single clean element) */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (window.location.pathname.includes('/admin') || window.location.hash.includes('admin')) {
                window.history.pushState({}, '', '/');
              }
              setCurrentAppMode('store');
              setSelectedCategory('すべて');
            }}
            className="text-left group cursor-pointer"
          >
            <span className="font-serif text-2xl font-bold tracking-tight text-neutral-900 group-hover:text-neutral-700 transition-colors">
              AURA
            </span>
            <span className="font-sans text-xs tracking-widest text-neutral-400 uppercase ml-2">
              CURATED
            </span>
          </button>
        </div>

        {/* Right Zone: Return to Store (when in admin) or Shopping Bag */}
        <div className="flex items-center gap-3 shrink-0">
          {currentAppMode === 'admin' && (
            <button
              onClick={() => {
                window.history.pushState({}, '', '/');
                setCurrentAppMode('store');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ストアへ戻る</span>
            </button>
          )}

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-neutral-800 hover:text-neutral-950 transition-colors rounded-full hover:bg-neutral-100 cursor-pointer"
            aria-label="View Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-neutral-900 text-white text-[10px] font-semibold flex items-center justify-center rounded-full tabular-nums">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
