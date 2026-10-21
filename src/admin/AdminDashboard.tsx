import React, { useState, useEffect } from 'react';
import { Product, Category } from '../types/catalog';
import { catalogApi, ApiStatus } from '../api/client';
import { ProductEditorModal } from './ProductEditorModal';
import {
  ArrowLeft,
  Plus,
  RefreshCw,
  Edit2,
  Trash2,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  Search,
  ExternalLink,
  Layers,
  Terminal,
  FileCode,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigatePublic: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigatePublic }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'PRODUCTS' | 'VERCEL_SPEC' | 'DATA'>('PRODUCTS');
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [importText, setImportText] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [items, status] = await Promise.all([
        catalogApi.getProducts(),
        catalogApi.checkStatus(),
      ]);
      setProducts(items);
      setApiStatus(status);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleCreateOrUpdate = async (productData: Omit<Product, 'id'>, id?: string) => {
    try {
      if (id) {
        await catalogApi.updateProduct(id, productData);
        showNotice(`Updated: ${productData.code}`);
      } else {
        await catalogApi.createProduct(productData);
        showNotice(`Created new product: ${productData.code}`);
      }
      await loadData();
    } catch (err: any) {
      alert(`Error saving product: ${err.message}`);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (window.confirm(`Delete item ${code} from catalog archive?`)) {
      try {
        await catalogApi.deleteProduct(id);
        showNotice(`Deleted: ${code}`);
        await loadData();
      } catch (err: any) {
        alert(`Error deleting product: ${err.message}`);
      }
    }
  };

  const handleToggleStatus = async (product: Product) => {
    const nextStatus: 'ARCHIVE' | 'RELEASED' | 'LOTTERY CLOSED' =
      product.status === 'ARCHIVE'
        ? 'RELEASED'
        : product.status === 'RELEASED'
        ? 'LOTTERY CLOSED'
        : 'ARCHIVE';

    try {
      await catalogApi.updateProduct(product.id, { status: nextStatus });
      showNotice(`${product.code} status changed to ${nextStatus}`);
      await loadData();
    } catch (err: any) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Reset catalog to the factory initial 8 Tokyo streetwear items?')) {
      await catalogApi.resetCatalog();
      showNotice('Catalog reset to initial 8 items');
      await loadData();
    }
  };

  const handleExport = () => {
    const json = catalogApi.exportJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chillandtough_catalog_${Date.now()}.json`;
    a.click();
    showNotice('Exported catalog JSON file');
  };

  const handleImport = () => {
    try {
      if (!importText.trim()) return;
      catalogApi.importJson(importText.trim());
      showNotice('Imported catalog successfully');
      setImportText('');
      loadData();
    } catch (err: any) {
      alert(`Import failed: ${err.message}`);
    }
  };

  // Filter products for admin view
  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        p.titleEn.toLowerCase().includes(q) ||
        p.titleJp.includes(q) ||
        p.code.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate summary metrics
  const totalValuationJpy = products.reduce((sum, p) => sum + (p.priceJpy || 0), 0);
  const categoryCounts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#111111] flex flex-col font-sans">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-30 bg-[#111111] text-white px-4 md:px-8 py-3.5 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigatePublic}
              className="flex items-center gap-1.5 text-xs font-mono-nums text-neutral-400 hover:text-white transition-colors border border-neutral-700 px-2.5 py-1 rounded"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Catalog</span>
            </button>
            <span className="text-neutral-600">/</span>
            <span className="font-bold tracking-tight font-sans text-sm md:text-base">
              ADMIN CONTROL PANEL
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono-nums">
            {/* Python / Vercel API Status Pill */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] ${
                apiStatus?.connected
                  ? 'border-emerald-800 bg-emerald-950/60 text-emerald-300'
                  : 'border-neutral-700 bg-neutral-900 text-neutral-300'
              }`}
            >
              {apiStatus?.connected ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              ) : (
                <Terminal className="w-3 h-3 text-neutral-400" />
              )}
              <span>API: Python FastAPI (Vercel Ready)</span>
            </div>
          </div>
        </div>
      </header>

      {/* Subnav Tabs */}
      <div className="bg-white border-b border-neutral-200 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <nav className="flex items-center gap-6 text-xs font-mono-nums">
            <button
              onClick={() => setActiveTab('PRODUCTS')}
              className={`py-3 border-b-2 transition-colors ${
                activeTab === 'PRODUCTS'
                  ? 'border-neutral-950 text-neutral-950 font-semibold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-950'
              }`}
            >
              CATALOG ITEMS ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('VERCEL_SPEC')}
              className={`py-3 border-b-2 transition-colors ${
                activeTab === 'VERCEL_SPEC'
                  ? 'border-neutral-950 text-neutral-950 font-semibold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-950'
              }`}
            >
              VERCEL & PYTHON SPEC
            </button>
            <button
              onClick={() => setActiveTab('DATA')}
              className={`py-3 border-b-2 transition-colors ${
                activeTab === 'DATA'
                  ? 'border-neutral-950 text-neutral-950 font-semibold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-950'
              }`}
            >
              BACKUP & IMPORT
            </button>
          </nav>

          {notice && (
            <div className="text-xs font-mono-nums text-emerald-700 bg-emerald-50 px-3 py-1 border border-emerald-200 animate-in fade-in">
              {notice}
            </div>
          )}
        </div>
      </div>

      {/* Admin Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
        {activeTab === 'PRODUCTS' && (
          <div className="space-y-6">
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-neutral-200 p-4">
                <span className="text-[11px] font-mono-nums uppercase text-neutral-400 block mb-1">
                  TOTAL CATALOG ITEMS
                </span>
                <span className="text-2xl font-bold font-mono-nums text-neutral-950">
                  {products.length}
                </span>
                <span className="text-[11px] text-neutral-500 block mt-1">
                  Active in database
                </span>
              </div>

              <div className="bg-white border border-neutral-200 p-4">
                <span className="text-[11px] font-mono-nums uppercase text-neutral-400 block mb-1">
                  COLLECTION CATEGORIES
                </span>
                <span className="text-2xl font-bold font-mono-nums text-neutral-950">
                  {Object.keys(categoryCounts).length}
                </span>
                <span className="text-[11px] text-neutral-500 block mt-1">
                  Outerwear, Tops, Bottoms, Goods
                </span>
              </div>

              <div className="bg-white border border-neutral-200 p-4">
                <span className="text-[11px] font-mono-nums uppercase text-neutral-400 block mb-1">
                  TOTAL CATALOG VALUE (JPY)
                </span>
                <span className="text-2xl font-bold font-mono-nums text-neutral-950">
                  ¥{totalValuationJpy.toLocaleString('ja-JP')}
                </span>
                <span className="text-[11px] text-neutral-500 block mt-1">
                  Combined retail list
                </span>
              </div>

              <div className="bg-white border border-neutral-200 p-4">
                <span className="text-[11px] font-mono-nums uppercase text-neutral-400 block mb-1">
                  DEPLOYMENT TARGET
                </span>
                <span className="text-2xl font-bold font-mono-nums text-neutral-950">
                  VERCEL
                </span>
                <span className="text-[11px] text-neutral-500 block mt-1">
                  SPA + Python Serverless /api
                </span>
              </div>
            </div>

            {/* Filter and Action Strip */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 border border-neutral-200">
              {/* Category tabs */}
              <div className="flex flex-wrap items-center gap-1">
                {['ALL', 'OUTERWEAR', 'TOPS', 'BOTTOMS', 'GOODS'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-mono-nums transition-colors ${
                      selectedCategory === cat
                        ? 'bg-neutral-950 text-white font-medium'
                        : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search & Add Item */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter by SKU or title..."
                    className="pl-8 pr-3 py-1.5 text-xs font-mono-nums bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-neutral-950 w-48"
                  />
                </div>

                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsEditorOpen(true);
                  }}
                  className="px-3 py-1.5 text-xs font-mono-nums bg-neutral-950 text-white hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ADD PRODUCT</span>
                </button>
              </div>
            </div>

            {/* Product Table */}
            <div className="border border-neutral-200 bg-white overflow-x-auto">
              <table className="w-full text-left text-xs font-mono-nums">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase">
                  <tr>
                    <th className="py-3 px-4">PREVIEW</th>
                    <th className="py-3 px-4">SKU CODE</th>
                    <th className="py-3 px-4">TITLE & DESCRIPTION</th>
                    <th className="py-3 px-4">CATEGORY</th>
                    <th className="py-3 px-4">PRICE</th>
                    <th className="py-3 px-4">STATUS (CLICK TO TOGGLE)</th>
                    <th className="py-3 px-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-50 transition-colors">
                      {/* Image Thumbnail */}
                      <td className="py-2.5 px-4 w-16">
                        <div className="w-12 h-9 bg-neutral-100 border border-neutral-200 overflow-hidden flex items-center justify-center">
                          <img
                            src={p.primaryImage}
                            alt={p.titleEn}
                            className="w-full h-full object-contain"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </td>

                      {/* Code */}
                      <td className="py-3 px-4 font-bold text-neutral-950">
                        {p.code}
                      </td>

                      {/* Titles */}
                      <td className="py-3 px-4">
                        <div className="font-sans font-medium text-neutral-900">
                          {p.titleEn}
                        </div>
                        <div className="text-[11px] text-neutral-400 font-sans">
                          {p.titleJp}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-neutral-600">
                        {p.category}
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-semibold text-neutral-950">
                        ¥{p.priceJpy.toLocaleString('ja-JP')}
                      </td>

                      {/* Status toggle button */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleStatus(p)}
                          className={`px-2 py-0.5 text-[11px] font-mono-nums border transition-colors ${
                            p.status === 'ARCHIVE'
                              ? 'border-neutral-300 bg-neutral-100 text-neutral-700 hover:border-neutral-500'
                              : p.status === 'RELEASED'
                              ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:border-emerald-600'
                              : 'border-amber-300 bg-amber-50 text-amber-800 hover:border-amber-600'
                          }`}
                          title="Click to toggle status (ARCHIVE → RELEASED → LOTTERY CLOSED)"
                        >
                          {p.status}
                        </button>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setIsEditorOpen(true);
                            }}
                            className="p-1.5 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded transition-colors"
                            title="Edit Garment Specifications"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.code)}
                            className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Vercel & Python Architecture Spec Tab */}
        {activeTab === 'VERCEL_SPEC' && (
          <div className="space-y-6">
            <div className="bg-white border border-neutral-200 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-neutral-950" />
                <h2 className="text-base font-bold font-sans text-neutral-950">
                  Vercel Serverless Architecture & Python API Directory Structure
                </h2>
              </div>
              <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-sans">
                This project has been structured specifically for seamless, zero-configuration deployment to **Vercel** with a **TypeScript Vite SPA frontend** and a **Python FastAPI Serverless Functions backend**.
              </p>

              <div className="border border-neutral-200 bg-neutral-50 p-4 font-mono-nums text-xs space-y-1">
                <div className="text-neutral-400">// Project Root Directory Structure:</div>
                <div className="text-neutral-800 font-bold">/</div>
                <div className="text-neutral-700 pl-4">├── api/</div>
                <div className="text-neutral-700 pl-8">├── index.py <span className="text-neutral-400">(FastAPI serverless entrypoint for /api/*)</span></div>
                <div className="text-neutral-700 pl-8">└── data.py <span className="text-neutral-400">(Initial default Tokyo product catalog)</span></div>
                <div className="text-neutral-700 pl-4">├── requirements.txt <span className="text-neutral-400">(fastapi, pydantic for Vercel Python runtime)</span></div>
                <div className="text-neutral-700 pl-4">├── vercel.json <span className="text-neutral-400">(Rewrites /api/(.*) to api/index.py & SPA fallback)</span></div>
                <div className="text-neutral-700 pl-4">├── src/</div>
                <div className="text-neutral-700 pl-8">├── admin/ <span className="text-neutral-400">(TypeScript Admin dashboard & product editor)</span></div>
                <div className="text-neutral-700 pl-8">├── api/client.ts <span className="text-neutral-400">(Resilient API client connecting to /api)</span></div>
                <div className="text-neutral-700 pl-8">├── components/ <span className="text-neutral-400">(Catalog, Lookbook, Index, Modal)</span></div>
                <div className="text-neutral-700 pl-8">└── App.tsx <span className="text-neutral-400">(Client-side routing between / and /admin)</span></div>
                <div className="text-neutral-700 pl-4">└── package.json <span className="text-neutral-400">(Vite build scripts & dependencies)</span></div>
              </div>
            </div>

            {/* API Endpoints Reference */}
            <div className="bg-white border border-neutral-200 p-6 space-y-4">
              <h3 className="text-sm font-bold font-mono-nums uppercase text-neutral-950">
                Implemented Python API Endpoints (`api/index.py`)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono-nums border border-neutral-200">
                  <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
                    <tr>
                      <th className="py-2 px-3 text-left">METHOD</th>
                      <th className="py-2 px-3 text-left">ENDPOINT</th>
                      <th className="py-2 px-3 text-left">DESCRIPTION</th>
                      <th className="py-2 px-3 text-left">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    <tr>
                      <td className="py-2 px-3 font-bold text-emerald-700">GET</td>
                      <td className="py-2 px-3">/api/health</td>
                      <td className="py-2 px-3 text-neutral-600">Runtime health check & platform diagnostics</td>
                      <td className="py-2 px-3 text-emerald-600">Active</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-emerald-700">GET</td>
                      <td className="py-2 px-3">/api/products</td>
                      <td className="py-2 px-3 text-neutral-600">List catalog items with category/season/query filters</td>
                      <td className="py-2 px-3 text-emerald-600">Active</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-emerald-700">GET</td>
                      <td className="py-2 px-3">/api/products/{`{id}`}</td>
                      <td className="py-2 px-3 text-neutral-600">Retrieve single garment by ID or SKU code</td>
                      <td className="py-2 px-3 text-emerald-600">Active</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-blue-700">POST</td>
                      <td className="py-2 px-3">/api/products</td>
                      <td className="py-2 px-3 text-neutral-600">Create new catalog item with full sizing schema</td>
                      <td className="py-2 px-3 text-emerald-600">Active</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-amber-700">PUT</td>
                      <td className="py-2 px-3">/api/products/{`{id}`}</td>
                      <td className="py-2 px-3 text-neutral-600">Update existing garment specifications</td>
                      <td className="py-2 px-3 text-emerald-600">Active</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-rose-700">DELETE</td>
                      <td className="py-2 px-3">/api/products/{`{id}`}</td>
                      <td className="py-2 px-3 text-neutral-600">Delete product from catalog archive</td>
                      <td className="py-2 px-3 text-emerald-600">Active</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-emerald-700">GET</td>
                      <td className="py-2 px-3">/api/admin/stats</td>
                      <td className="py-2 px-3 text-neutral-600">Catalog valuation and category distribution</td>
                      <td className="py-2 px-3 text-emerald-600">Active</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* How to Deploy to Vercel */}
            <div className="bg-white border border-neutral-200 p-6 space-y-3">
              <h3 className="text-sm font-bold font-mono-nums uppercase text-neutral-950">
                Deploying to Vercel (CLI or GitHub)
              </h3>
              <ol className="list-decimal pl-5 text-xs text-neutral-600 space-y-1.5 font-sans">
                <li>Push the repository to GitHub or run <code className="bg-neutral-100 px-1 py-0.5 font-mono-nums">vercel</code> from terminal.</li>
                <li>Vercel automatically detects <code className="bg-neutral-100 px-1 py-0.5 font-mono-nums">vercel.json</code>, installs Python dependencies from <code className="bg-neutral-100 px-1 py-0.5 font-mono-nums">requirements.txt</code>, and runs <code className="bg-neutral-100 px-1 py-0.5 font-mono-nums">npm run build</code> for the Vite client.</li>
                <li>Both the public catalog at <code className="bg-neutral-100 px-1 py-0.5 font-mono-nums">/</code> and the admin dashboard at <code className="bg-neutral-100 px-1 py-0.5 font-mono-nums">/admin</code> render seamlessly with Python serverless execution at <code className="bg-neutral-100 px-1 py-0.5 font-mono-nums">/api/*</code>.</li>
              </ol>
            </div>
          </div>
        )}

        {/* Backup & Import Tab */}
        {activeTab === 'DATA' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Export */}
            <div className="bg-white border border-neutral-200 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-neutral-900" />
                <h3 className="font-bold font-mono-nums uppercase text-xs text-neutral-950">
                  Export Catalog Archive
                </h3>
              </div>
              <p className="text-xs text-neutral-600">
                Download a complete JSON snapshot of all products, color variations, dimensions, and release statuses.
              </p>
              <button
                onClick={handleExport}
                className="w-full py-2 px-4 bg-neutral-950 text-white text-xs font-mono-nums hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>DOWNLOAD JSON SNAPSHOT</span>
              </button>
            </div>

            {/* Reset */}
            <div className="bg-white border border-neutral-200 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold font-mono-nums uppercase text-xs text-neutral-950">
                  Reset Factory Catalog
                </h3>
              </div>
              <p className="text-xs text-neutral-600">
                Revert all additions and edits back to the factory set of 8 authentic Tokyo streetwear pieces.
              </p>
              <button
                onClick={handleReset}
                className="w-full py-2 px-4 border border-amber-300 bg-amber-50 text-amber-900 text-xs font-mono-nums hover:bg-amber-100 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>RESTORE FACTORY ARCHIVE</span>
              </button>
            </div>

            {/* Import JSON */}
            <div className="md:col-span-2 bg-white border border-neutral-200 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-neutral-900" />
                <h3 className="font-bold font-mono-nums uppercase text-xs text-neutral-950">
                  Import Catalog JSON
                </h3>
              </div>
              <textarea
                rows={6}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Paste valid Product[] JSON array here..."
                className="w-full text-xs font-mono-nums p-3 bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-neutral-950"
              />
              <button
                onClick={handleImport}
                disabled={!importText.trim()}
                className="py-2 px-4 bg-neutral-950 text-white text-xs font-mono-nums hover:bg-neutral-800 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>IMPORT AND OVERWRITE CATALOG</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Product Editor Modal */}
      <ProductEditorModal
        product={editingProduct}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleCreateOrUpdate}
      />
    </div>
  );
};
