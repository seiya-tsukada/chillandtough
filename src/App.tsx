/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { QuickBuyModal } from './components/QuickBuyModal';
import { IndexTable } from './components/IndexTable';
import { LookbookView } from './components/LookbookView';
import { InfoView } from './components/InfoView';
import { AdminDashboard } from './admin/AdminDashboard';
import { catalogApi } from './api/client';
import { PRODUCTS as INITIAL_PRODUCTS } from './data/products';
import { CartItem, Category, Product } from './types/catalog';
import { Grid2X2, Grid3X3, LayoutGrid, Lock } from 'lucide-react';

const CART_STORAGE_KEY = 'chillandtough_cart_v1';
// Key used before the brand rename; read once so saved carts carry over
const LEGACY_CART_STORAGE_KEY = 'archive_tokyo_cart_v1';

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
  const [columns, setColumns] = useState<2 | 3 | 4>(3);

  // Cart state (persisted per browser)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem(CART_STORAGE_KEY) ?? localStorage.getItem(LEGACY_CART_STORAGE_KEY) ?? '[]'
      );
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Storage unavailable (private mode etc.)
    }
  }, [cartItems]);

  const addToCart = (product: Product, size: string) => {
    setCartItems((items) => {
      const existing = items.find((i) => i.productId === product.id && i.size === size);
      if (existing) {
        return items.map((i) => (i === existing ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...items, { productId: product.id, size, quantity: 1 }];
    });
  };

  const updateCartQuantity = (productId: string, size: string, quantity: number) => {
    setCartItems((items) =>
      quantity <= 0
        ? items.filter((i) => !(i.productId === productId && i.size === size))
        : items.map((i) => (i.productId === productId && i.size === size ? { ...i, quantity } : i))
    );
  };

  const [quickBuyItem, setQuickBuyItem] = useState<{ product: Product; size: string } | null>(null);

  const quickBuy = (product: Product, size: string) => {
    setSelectedProduct(null);
    setQuickBuyItem({ product, size });
  };

  const cartCount = cartItems.reduce((n, i) => n + i.quantity, 0);

  // Load products from API / local sync
  const refreshProducts = async () => {
    try {
      const items = await catalogApi.getProducts();
      setProducts(items);
    } catch {
      // Fallback handled inside client
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

  // Filtered products for public catalog
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'ALL') return products;
    return products.filter((item) => item.category === selectedCategory);
  }, [products, selectedCategory]);

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
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-4 sm:py-6 md:py-8">
        {currentTab === 'CATALOG' && (
          <div className="space-y-6">
            {/* Minimalist Tokyo Filter Bar: Category & Grid Density Switcher */}
            <div className="flex items-center justify-between border-b border-neutral-200/80 pb-3">
              {/* Category Filter: Pure quiet text buttons */}
              <div className="flex items-center gap-1 sm:gap-2">
                {(['ALL', 'OUTERWEAR', 'TOPS', 'BOTTOMS', 'GOODS'] as Category[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2 sm:px-3 py-1 text-xs font-mono-nums transition-colors whitespace-nowrap shrink-0 ${
                      selectedCategory === cat
                        ? 'bg-neutral-950 text-white font-medium'
                        : 'text-neutral-500 hover:text-neutral-950'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Grid Density Switcher */}
              <div className="flex items-center border border-neutral-200 bg-white">
                <button
                  onClick={() => setColumns(2)}
                  className={`p-1.5 transition-colors ${
                    columns === 2 ? 'bg-neutral-950 text-white' : 'text-neutral-500 hover:text-neutral-950'
                  }`}
                  title="2 Columns (Large)"
                  aria-label="2 columns view"
                >
                  <Grid2X2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setColumns(3)}
                  className={`p-1.5 transition-colors border-l border-neutral-200 ${
                    columns === 3 ? 'bg-neutral-950 text-white' : 'text-neutral-500 hover:text-neutral-950'
                  }`}
                  title="3 Columns (Standard)"
                  aria-label="3 columns view"
                >
                  <Grid3X3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setColumns(4)}
                  className={`p-1.5 transition-colors border-l border-neutral-200 ${
                    columns === 4 ? 'bg-neutral-950 text-white' : 'text-neutral-500 hover:text-neutral-950'
                  }`}
                  title="4 Columns (Dense)"
                  aria-label="4 columns view"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Product Cards: Image Only Grid */}
            <div
              className={`grid gap-3 sm:gap-5 md:gap-6 ${
                columns === 2
                  ? 'grid-cols-1 sm:grid-cols-2'
                  : columns === 3
                  ? 'grid-cols-2 md:grid-cols-3'
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

      {/* Product Detail Modal: Natural Popup with Title, Description, and Image */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        currency={currency}
        onPrevProduct={handlePrevProduct}
        onNextProduct={handleNextProduct}
        onAddToCart={addToCart}
        onQuickBuy={quickBuy}
      />

      <QuickBuyModal
        item={quickBuyItem}
        onClose={() => setQuickBuyItem(null)}
        currency={currency}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        products={products}
        currency={currency}
        onUpdateQuantity={updateCartQuantity}
      />

      {/* Quiet Minimalist Tokyo Footer */}
      <footer className="border-t border-neutral-200 bg-white/70 mt-16 px-4 md:px-8 py-8 text-neutral-500 text-xs font-mono-nums">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-neutral-900 font-sans">chillandtough</span>
            <span aria-hidden="true">·</span>
            <span>INDEPENDENT PRODUCT CATALOG</span>
            <span aria-hidden="true">·</span>
            <span>JAPAN</span>
          </div>

          <div className="flex items-center gap-6">
            <span>© 2026 chillandtough</span>
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
