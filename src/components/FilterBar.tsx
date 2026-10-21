import React from 'react';
import { LayoutGrid, StretchHorizontal, Search } from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';

const CATEGORIES = [
  'すべて',
  'パンツ',
  'スウェット',
  'ポロシャツ',
  'Tシャツ'
];

export const FilterBar: React.FC = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery
  } = useCommerce();

  return (
    <div className="bg-white border-b border-neutral-200 py-3 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Category Segmented Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Layout View Mode Switch */}
        <div className="flex items-center gap-2">
          {/* Search Box */}
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="キーワードを検索"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 focus:bg-white"
            />
          </div>

          {/* Feed / Grid View Mode Switch */}
          <div className="flex items-center p-0.5 bg-neutral-100 rounded-lg shrink-0">
            <button
              onClick={() => setViewMode('feed')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'feed'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
              title="Feed View"
            >
              <StretchHorizontal className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
              title="Explore Grid"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
