import React from 'react';

interface HeaderProps {
  currentTab: 'CATALOG' | 'INDEX' | 'LOOKBOOK' | 'INFO';
  setCurrentTab: (tab: 'CATALOG' | 'INDEX' | 'LOOKBOOK' | 'INFO') => void;
  currency: 'JPY' | 'USD';
  setCurrency: (c: 'JPY' | 'USD') => void;
  itemCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  currency,
  setCurrency,
  itemCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#fafafa]/95 backdrop-blur-md border-b border-neutral-200/80 px-4 md:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setCurrentTab('CATALOG')}
          className="text-lg md:text-xl font-bold tracking-tight text-neutral-950 whitespace-nowrap shrink-0 text-left hover:opacity-70 transition-opacity"
        >
          ARCHIVE TOKYO
        </button>

        {/* Zone 2: 4 clean single-line text navigation links */}
        <nav className="flex items-center gap-6 md:gap-8 text-xs md:text-sm font-medium text-neutral-600">
          <button
            onClick={() => setCurrentTab('CATALOG')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b ${
              currentTab === 'CATALOG'
                ? 'text-neutral-950 border-neutral-950 font-semibold'
                : 'text-neutral-500 border-transparent hover:text-neutral-950'
            }`}
          >
            Catalog
          </button>
          <button
            onClick={() => setCurrentTab('INDEX')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b ${
              currentTab === 'INDEX'
                ? 'text-neutral-950 border-neutral-950 font-semibold'
                : 'text-neutral-500 border-transparent hover:text-neutral-950'
            }`}
          >
            Index ({itemCount})
          </button>
          <button
            onClick={() => setCurrentTab('LOOKBOOK')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b ${
              currentTab === 'LOOKBOOK'
                ? 'text-neutral-950 border-neutral-950 font-semibold'
                : 'text-neutral-500 border-transparent hover:text-neutral-950'
            }`}
          >
            Lookbook
          </button>
          <button
            onClick={() => setCurrentTab('INFO')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b ${
              currentTab === 'INFO'
                ? 'text-neutral-950 border-neutral-950 font-semibold'
                : 'text-neutral-500 border-transparent hover:text-neutral-950'
            }`}
          >
            About
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setCurrency(currency === 'JPY' ? 'USD' : 'JPY')}
            className="text-xs font-mono-nums px-2.5 py-1 text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded border border-neutral-300 transition-colors whitespace-nowrap shrink-0"
            title="Toggle currency display"
          >
            {currency === 'JPY' ? '¥ JPY' : '$ USD'}
          </button>
        </div>
      </div>
    </header>
  );
};
