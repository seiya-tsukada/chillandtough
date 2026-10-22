export const API_ENDPOINTS = {
  HEALTH: '/api/health',
  PRODUCTS: '/api/products',
  product: (id: string) => `/api/products/${encodeURIComponent(id)}`,
  ADMIN_RESET: '/api/admin/reset',
} as const;

export const DEFAULT_API_RUNTIME = 'python-fastapi';
export const FALLBACK_RUNTIME = 'local-state-cache';

export const API_STATUS_MESSAGES = {
  CONNECTED: 'Connected to Python FastAPI backend (Vercel ready)',
  FALLBACK:
    'Running client-side mock/storage (Deploy to Vercel to activate Python Serverless Functions)',
} as const;

/** Prefix for IDs generated client-side when creating a product. */
export const PRODUCT_ID_PREFIX = 'at';
