/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { IndexTable } from './components/IndexTable';
import { LookbookView } from './components/LookbookView';
import { InfoView } from './components/InfoView';
import { AdminDashboard } from './admin/AdminDashboard';
import { catalogApi } from './api/client';
import { PRODUCTS as INITIAL_PRODUCTS } from './data/products';
import { Category, Product } from './types/catalog';
import { Search, Grid2X2, Grid3X3, LayoutGrid, X, Lock } from 'lucide-react';

export default function App() {
  // Route state: check if initial path is /admin
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    return window.location.pathname.startsWith('/admin');
  });

  const [currentTab, setCurrentTab] = useState<'CATALOG' | 'INDEX' | 'LOOKBOOK' | 'INFO'>('CATALOG');
  const [currency, setCurrency] = useState<'JPY' | 'USD'>('JPY');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filters & layout state
  const [selectedCategory, setSelectedCategory] = useState<Category>('ALL');
  const [selectedSeason, setSelectedSeason] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'CODE' | 'PRICE_ASC' | 'PRICE_DESC'>('NEWEST');
  const [columns, setColumns] = useState<2 | 3 | 4>(3);

  // Load products from API / local sync
  const refreshProducts = async () => {
    try {
      const items = await catalogApi.getProducts();
      setProducts(items);
    } catch {
      // Fallback already handled
    }
  };

  useEffect(() => {
    refreshProducts();
  }, [isAdminRoute]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setIsAdminRoute(window.location.pathname.startsWith('/admin'));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigation helpers for /admin
  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setIsAdminRoute(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToPublic = () => {
    window.history.pushState({}, '', '/');
    setIsAdminRoute(false);
    refreshProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered & sorted products for public catalog
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }
      if (selectedSeason !== 'ALL' && item.season !== selectedSeason) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.titleEn.toLowerCase().includes(q) || item.titleJp.includes(q);
        const matchesCode = item.code.toLowerCase().includes(q);
        const matchesMaterial = item.material.toLowerCase().includes(q);
        const matchesColor = item.colors.some((c) => c.name.toLowerCase().includes(q));
        const matchesOrigin = item.origin.toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesMaterial && !matchesColor && !matchesOrigin) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'NEWEST') return b.releaseDate.localeCompare(a.releaseDate);
      if (sortBy === 'CODE') return a.code.localeCompare(b.code);
      if (sortBy === 'PRICE_ASC') return a.priceJpy - b.priceJpy;
      if (sortBy === 'PRICE_DESC') return b.priceJpy - a.priceJpy;
      return 0;
    });
  }, [products, selectedCategory, selectedSeason, searchQuery, sortBy]);

  // Modal navigation helpers
  const handlePrevProduct = () => {
    if (!selectedProduct) return;
    const currentIndex = filteredProducts.findIndex((p) => p.id === selectedProduct.id);
    if (currentIndex > 0) {
      setSelectedProduct(filteredProducts[currentIndex - 1]);
    } else {
      setSelectedProduct(filteredProducts[filteredProducts.length - 1]);
    }
  };

  const handleNextProduct = () => {
    if (!selectedProduct) return;
    const currentIndex = filteredProducts.findIndex((p) => p.id === selectedProduct.id);
    if (currentIndex < filteredProducts.length - 1) {
      setSelectedProduct(filteredProducts[currentIndex + 1]);
    } else {
      setSelectedProduct(filteredProducts[0]);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('ALL');
    setSelectedSeason('ALL');
    setSearchQuery('');
    setSortBy('NEWEST');
  };

  // If on /admin route, render the TypeScript Admin Dashboard
  if (isAdminRoute) {
    return <AdminDashboard onNavigatePublic={navigateToPublic} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-[#111111]">
      {/* 3-Zone Top Navigation Contract */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currency={currency}
        setCurrency={setCurrency}
        itemCount={products.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6 md:py-10">
        {currentTab === 'CATALOG' && (
          <div className="space-y-8">
            {/* Catalog Subheader / Context Bar */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200 pb-5">
              <div>
                <div className="text-xs font-mono-nums text-neutral-400 uppercase tracking-wider mb-1">
                  TOKYO GARMENT CATALOG · PERMANENT ARCHIVE
                </div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-950 font-sans">
                  Current Collection & Archive
                </h1>
              </div>

              {/* Status and count in unboxed metadata */}
              <div className="flex items-center gap-3 text-xs font-mono-nums text-neutral-500">
                <span>{filteredProducts.length} ITEMS DISPLAYED</span>
                <span aria-hidden="true">·</span>
                <span>TOKYO INDEPENDENT</span>
                <span aria-hidden="true">·</span>
                <span>SPEC ARCHIVE ONLY</span>
              </div>
            </div>

            {/* Interactive Filter and Control Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-3 md:p-4 border border-neutral-200">
              {/* Category Filter Buttons (Functional Interactive Filter) */}
              <div className="flex flex-wrap items-center gap-1">
                {(['ALL', 'OUTERWEAR', 'TOPS', 'BOTTOMS', 'GOODS'] as Category[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-mono-nums transition-colors whitespace-nowrap shrink-0 ${
                      selectedCategory === cat
                        ? 'bg-neutral-950 text-white font-medium'
                        : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Right Side Controls: Search, Season, Sort, Columns */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Search Bar */}
                <div className="relative flex items-center">
                  <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search catalog or code..."
                    className="pl-8 pr-7 py-1.5 text-xs font-mono-nums bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-neutral-950 w-44 md:w-56 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 text-neutral-400 hover:text-neutral-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Season Dropdown */}
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="px-2.5 py-1.5 text-xs font-mono-nums bg-white border border-neutral-200 text-neutral-700 focus:outline-none focus:border-neutral-950 cursor-pointer"
                >
                  <option value="ALL">All Seasons</option>
                  <option value="2026 S/S">2026 S/S</option>
                  <option value="2025 F/W">2025 F/W</option>
                </select>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-2.5 py-1.5 text-xs font-mono-nums bg-white border border-neutral-200 text-neutral-700 focus:outline-none focus:border-neutral-950 cursor-pointer"
                >
                  <option value="NEWEST">Release (Newest)</option>
                  <option value="CODE">SKU / Code</option>
                  <option value="PRICE_ASC">Price (Low → High)</option>
                  <option value="PRICE_DESC">Price (High → Low)</option>
                </select>

                {/* Grid Density Switcher (Desktop) */}
                <div className="hidden sm:flex items-center border border-neutral-200 bg-white">
                  <button
                    onClick={() => setColumns(2)}
                    className={`p-1.5 transition-colors ${
                      columns === 2 ? 'bg-neutral-950 text-white' : 'text-neutral-500 hover:text-neutral-950'
                    }`}
                    title="2 Columns (Editorial)"
                  >
                    <Grid2X2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setColumns(3)}
                    className={`p-1.5 transition-colors border-l border-neutral-200 ${
                      columns === 3 ? 'bg-neutral-950 text-white' : 'text-neutral-500 hover:text-neutral-950'
                    }`}
                    title="3 Columns (Standard)"
                  >
                    <Grid3X3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setColumns(4)}
                    className={`p-1.5 transition-colors border-l border-neutral-200 ${
                      columns === 4 ? 'bg-neutral-950 text-white' : 'text-neutral-500 hover:text-neutral-950'
                    }`}
                    title="4 Columns (Dense)"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div
                className={`grid gap-x-6 gap-y-10 md:gap-x-8 md:gap-y-12 ${
                  columns === 2
                    ? 'grid-cols-1 md:grid-cols-2'
                    : columns === 3
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                }`}
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    currency={currency}
                    onSelect={(p) => setSelectedProduct(p)}
                    columns={columns}
                  />
                ))}
              </div>
            ) : (
              /* Clean Empty State */
              <div className="border border-neutral-200 bg-white p-12 text-center space-y-4">
                <p className="font-mono-nums text-sm text-neutral-500">
                  No catalog items match your filter criteria.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 text-xs font-mono-nums bg-neutral-950 text-white hover:bg-neutral-800 transition-colors"
                >
                  RESET ALL FILTERS
                </button>
              </div>
            )}
          </div>
        )}

        {currentTab === 'INDEX' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200 pb-4">
              <div>
                <span className="text-xs font-mono-nums text-neutral-400 uppercase tracking-wider">
                  REGISTRY & INDEX
                </span>
                <h1 className="text-2xl font-bold tracking-tight text-neutral-950 font-sans">
                  Tabular Catalog Archive
                </h1>
              </div>
              <div className="text-xs font-mono-nums text-neutral-500">
                Click any row to inspect complete garment measurements and fabric specifications
              </div>
            </div>

            <IndexTable
              products={products}
              currency={currency}
              onSelect={(p) => setSelectedProduct(p)}
            />
          </div>
        )}

        {currentTab === 'LOOKBOOK' && (
          <LookbookView
            products={products}
            onSelect={(p) => setSelectedProduct(p)}
            currency={currency}
          />
        )}

        {currentTab === 'INFO' && <InfoView />}
      </main>

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        currency={currency}
        onPrevProduct={handlePrevProduct}
        onNextProduct={handleNextProduct}
      />

      {/* Quiet Minimalist Tokyo Footer with Admin Portal Link */}
      <footer className="border-t border-neutral-200 bg-white/70 mt-16 px-4 md:px-8 py-8 text-neutral-500 text-xs font-mono-nums">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-neutral-900 font-sans">ARCHIVE TOKYO</span>
            <span aria-hidden="true">·</span>
            <span>INDEPENDENT PRODUCT CATALOG</span>
            <span aria-hidden="true">·</span>
            <span>JAPAN</span>
          </div>

          <div className="flex items-center gap-6">
            <span>© 2026 ARCHIVE TOKYO</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={navigateToAdmin}
              className="text-neutral-500 hover:text-neutral-950 underline underline-offset-4 flex items-center gap-1 transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Console (/admin)</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
