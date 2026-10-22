import React from 'react';
import { BRAND_NAME } from '../constants/brand';
import { DEFAULT_VIEW_TAB, VIEW_TABS } from '../constants/catalog';
import { CURRENCY_CONFIG } from '../constants/currency';
import { Currency, ViewTab } from '../types/catalog';

interface HeaderProps {
  currentTab: ViewTab;
  setCurrentTab: (tab: ViewTab) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  itemCount: number;
  cartCount: number;
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  currency,
  setCurrency,
  itemCount,
  cartCount,
  onOpenCart,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#fafafa]/95 backdrop-blur-md border-b border-neutral-200/80 px-4 md:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Wordmark */}
        <button
          onClick={() => setCurrentTab(DEFAULT_VIEW_TAB)}
          className="text-lg md:text-xl font-bold tracking-tight text-neutral-950 whitespace-nowrap shrink-0 text-left hover:opacity-70 transition-opacity"
        >
          {BRAND_NAME}
        </button>

        <nav className="flex items-center gap-6 md:gap-8 text-xs md:text-sm font-medium text-neutral-600">
          {VIEW_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b ${
                currentTab === tab.id
                  ? 'text-neutral-950 border-neutral-950 font-semibold'
                  : 'text-neutral-500 border-transparent hover:text-neutral-950'
              }`}
            >
              {tab.showCount ? `${tab.label} (${itemCount})` : tab.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setCurrency(currency === 'JPY' ? 'USD' : 'JPY')}
            className="text-xs font-mono-nums px-2.5 py-1 text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded border border-neutral-300 transition-colors whitespace-nowrap shrink-0"
            title="Toggle currency display"
          >
            {CURRENCY_CONFIG[currency].label}
          </button>
          <button
            onClick={onOpenCart}
            className="text-xs font-mono-nums px-2.5 py-1 text-white bg-neutral-950 hover:bg-neutral-800 rounded border border-neutral-950 transition-colors whitespace-nowrap shrink-0"
            title="Open cart"
          >
            Cart ({cartCount})
          </button>
        </div>
      </div>
    </header>
  );
};
