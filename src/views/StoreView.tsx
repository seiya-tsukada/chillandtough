import React from 'react';
import { StoreHero } from '../components/StoreHero';
import { StoriesBar } from '../components/StoriesBar';
import { FilterBar } from '../components/FilterBar';
import { ExperientialCard } from '../components/ExperientialCard';
import { ExploreGrid } from '../components/ExploreGrid';
import { useCommerce } from '../context/CommerceContext';
import { Sparkles, ArrowRight, ShieldCheck, Instagram } from 'lucide-react';

export const StoreView: React.FC = () => {
  const { posts, selectedCategory, searchQuery, viewMode, setCurrentAppMode } = useCommerce();

  // Filter posts based on category and search query
  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      selectedCategory === 'すべて' ||
      selectedCategory === 'All' ||
      post.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(selectedCategory.toLowerCase()));

    const matchesSearch =
      !searchQuery.trim() ||
      post.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-neutral-50 flex flex-col">
      {/* 1. Storefront Hero */}
      <StoreHero />

      {/* 2. Instagram Stories Bar */}
      <StoriesBar />

      {/* 3. Category Filter & View Mode Controls */}
      <div id="feed-section">
        <FilterBar />
      </div>

      {/* 4. Feed (2 Columns) or Grid Display */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
        {filteredPosts.length === 0 ? (
          <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center my-8 max-w-xl mx-auto">
            <Sparkles className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-neutral-800">
              該当するアイテムが見つかりませんでした
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              検索ワードやカテゴリー条件を変更してお試しください。
            </p>
          </div>
        ) : viewMode === 'feed' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {filteredPosts.map((post) => (
              <ExperientialCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <ExploreGrid posts={filteredPosts} />
        )}
      </div>

      {/* Quiet Brand Footer (No public admin link) */}
      <footer className="border-t border-neutral-200 bg-white py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <span className="font-serif text-lg font-bold tracking-tight text-neutral-900">
              AURA CURATED
            </span>
            <span className="hidden sm:inline text-neutral-300">|</span>
            <p className="text-xs text-neutral-500">
              ファミリー＆アクティブモビリティ アパレルコレクション
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs text-neutral-500">
            <a href="#feed-section" className="hover:text-neutral-900 transition-colors">
              サイズガイド
            </a>
            <a href="#feed-section" className="hover:text-neutral-900 transition-colors">
              利用規約
            </a>
            <a href="#feed-section" className="hover:text-neutral-900 transition-colors">
              プライバシーポリシー
            </a>
            <span className="text-neutral-400">© 2026 AURA Inc. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </main>
  );
};
