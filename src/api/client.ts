import { Product } from '../types/catalog';
import { PRODUCTS } from '../data/products';
import { ALL_FILTER } from '../constants/catalog';
import { STORAGE_KEYS } from '../constants/storage';
import {
  API_ENDPOINTS,
  API_STATUS_MESSAGES,
  DEFAULT_API_RUNTIME,
  FALLBACK_RUNTIME,
  PRODUCT_ID_PREFIX,
} from '../constants/api';

const STORAGE_KEY = STORAGE_KEYS.PRODUCTS;

// Seed local storage with the default dataset on first access
function getStoredProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(PRODUCTS));
      return PRODUCTS;
    }
    return JSON.parse(raw);
  } catch {
    return PRODUCTS;
  }
}

function saveStoredProducts(products: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (e) {
    console.error('Failed to persist products to storage', e);
  }
}

export interface ApiStatus {
  connected: boolean;
  runtime: string;
  source: 'python_api' | 'local_fallback';
  message: string;
}

export const catalogApi = {
  /**
   * Health check to detect whether the Python API is live (Vercel deployment or local backend)
   */
  async checkStatus(): Promise<ApiStatus> {
    try {
      const res = await fetch(API_ENDPOINTS.HEALTH, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        return {
          connected: true,
          runtime: data.runtime || DEFAULT_API_RUNTIME,
          source: 'python_api',
          message: API_STATUS_MESSAGES.CONNECTED,
        };
      }
    } catch {
      // API unreachable: use local fallback
    }

    return {
      connected: false,
      runtime: FALLBACK_RUNTIME,
      source: 'local_fallback',
      message: API_STATUS_MESSAGES.FALLBACK,
    };
  },

  /**
   * Retrieve all products with optional filters
   */
  async getProducts(params?: { category?: string; season?: string; q?: string }): Promise<Product[]> {
    try {
      const query = new URLSearchParams();
      if (params?.category && params.category !== ALL_FILTER) query.set('category', params.category);
      if (params?.season && params.season !== ALL_FILTER) query.set('season', params.season);
      if (params?.q) query.set('q', params.q);

      const res = await fetch(`${API_ENDPOINTS.PRODUCTS}?${query.toString()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    // Client-side fallback filter
    let items = getStoredProducts();
    if (params?.category && params.category !== ALL_FILTER) {
      items = items.filter((p) => p.category === params.category);
    }
    if (params?.season && params.season !== ALL_FILTER) {
      items = items.filter((p) => p.season === params.season);
    }
    if (params?.q) {
      const queryStr = params.q.toLowerCase().trim();
      items = items.filter(
        (p) =>
          p.titleEn.toLowerCase().includes(queryStr) ||
          p.titleJp.includes(queryStr) ||
          p.code.toLowerCase().includes(queryStr)
      );
    }
    return items;
  },

  /**
   * Create a new product (Admin action)
   */
  async createProduct(newProduct: Omit<Product, 'id'>): Promise<Product> {
    const productWithId: Product = {
      ...newProduct,
      id: `${PRODUCT_ID_PREFIX}-${Date.now()}-${newProduct.code.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    };

    try {
      const res = await fetch(API_ENDPOINTS.PRODUCTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productWithId),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    // Local fallback update
    const current = getStoredProducts();
    const updated = [productWithId, ...current];
    saveStoredProducts(updated);
    return productWithId;
  },

  /**
   * Update an existing product (Admin action)
   */
  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    try {
      const res = await fetch(API_ENDPOINTS.product(id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const current = getStoredProducts();
    const index = current.findIndex((p) => p.id === id || p.code === id);
    if (index === -1) {
      throw new Error(`Product with ID ${id} not found.`);
    }

    const updatedProduct = { ...current[index], ...updates };
    current[index] = updatedProduct;
    saveStoredProducts(current);
    return updatedProduct;
  },

  /**
   * Delete a product (Admin action)
   */
  async deleteProduct(id: string): Promise<boolean> {
    try {
      const res = await fetch(API_ENDPOINTS.product(id), {
        method: 'DELETE',
      });
      if (res.ok) {
        return true;
      }
    } catch {
      // Fallback
    }

    const current = getStoredProducts();
    const filtered = current.filter((p) => p.id !== id && p.code !== id);
    saveStoredProducts(filtered);
    return true;
  },

  /**
   * Reset catalog to initial defaults
   */
  async resetCatalog(): Promise<Product[]> {
    try {
      const res = await fetch(API_ENDPOINTS.ADMIN_RESET, { method: 'POST' });
      if (res.ok) {
        return await catalogApi.getProducts();
      }
    } catch {
      // Fallback
    }

    saveStoredProducts(PRODUCTS);
    return PRODUCTS;
  },

  /**
   * Export all catalog data as JSON
   */
  exportJson(): string {
    return JSON.stringify(getStoredProducts(), null, 2);
  },

  /**
   * Import catalog data from JSON
   */
  importJson(jsonString: string): Product[] {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed) && parsed.length > 0) {
      saveStoredProducts(parsed);
      return parsed;
    }
    throw new Error('Invalid catalog format. Must be an array of products.');
  },
};
