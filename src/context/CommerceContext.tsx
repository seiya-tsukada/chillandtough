import React, { createContext, useContext, useState } from 'react';
import {
  ExperientialPost,
  Product,
  CartItem,
  ExperientialStory,
  AdCampaign,
  AnalyticsKPIs,
  OrderRecord
} from '../types';
import {
  INITIAL_POSTS,
  INITIAL_PRODUCTS,
  INITIAL_STORIES,
  INITIAL_CAMPAIGNS,
  INITIAL_KPI,
  INITIAL_ORDERS
} from '../data/mockData';

interface CommerceContextType {
  // Storefront Feed & Discovery
  posts: ExperientialPost[];
  products: Product[];
  stories: ExperientialStory[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: 'feed' | 'grid';
  setViewMode: (mode: 'feed' | 'grid') => void;

  // Active Story & Modal States
  activeStory: ExperientialStory | null;
  setActiveStory: (story: ExperientialStory | null) => void;
  selectedProductModal: Product | null;
  setSelectedProductModal: (prod: Product | null) => void;

  // Post Interactions
  toggleLike: (postId: string) => void;
  toggleSave: (postId: string) => void;
  addComment: (postId: string, text: string) => void;

  // Cart & Commerce
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number, fromPostId?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;

  // Checkout Flow
  checkoutSuccessOrder: OrderRecord | null;
  setCheckoutSuccessOrder: (order: OrderRecord | null) => void;
  processCheckout: (customerInfo: { name: string; email: string; address: string; provider: string }) => Promise<OrderRecord>;

  // Admin & Marketing Operations
  campaigns: AdCampaign[];
  kpi: AnalyticsKPIs;
  orders: OrderRecord[];
  currentAppMode: 'store' | 'admin';
  setCurrentAppMode: (mode: 'store' | 'admin') => void;
  addPost: (newPost: Omit<ExperientialPost, 'id' | 'likesCount' | 'commentsCount' | 'savesCount' | 'createdAt'>) => void;
  addCampaign: (newCampaign: Omit<AdCampaign, 'id' | 'createdAt' | 'impressions' | 'clicks' | 'ctrPercent' | 'roasMultiplier' | 'cpcJpy' | 'totalSpentJpy'>) => void;
  toggleCampaignStatus: (campaignId: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  syncInstagramGraph: () => Promise<{ success: boolean; count: number }>;
}

const CommerceContext = createContext<CommerceContextType | undefined>(undefined);

export const CommerceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<ExperientialPost[]>(INITIAL_POSTS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [stories, setStories] = useState<ExperientialStory[]>(INITIAL_STORIES);
  const [campaigns, setCampaigns] = useState<AdCampaign[]>(INITIAL_CAMPAIGNS);
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);
  const [kpi, setKpi] = useState<AnalyticsKPIs>(INITIAL_KPI);

  // App routing & views (/admin path or hash detection)
  const isInitialAdmin = typeof window !== 'undefined' && (
    window.location.pathname === '/admin' ||
    window.location.pathname.startsWith('/admin') ||
    window.location.hash.includes('admin')
  );
  const [currentAppMode, setCurrentAppModeState] = useState<'store' | 'admin'>(
    isInitialAdmin ? 'admin' : 'store'
  );
  const [viewMode, setViewMode] = useState<'feed' | 'grid'>('feed');
  const [selectedCategory, setSelectedCategory] = useState<string>('すべて');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const setCurrentAppMode = (mode: 'store' | 'admin') => {
    setCurrentAppModeState(mode);
    if (typeof window !== 'undefined') {
      const targetPath = mode === 'admin' ? '/admin' : '/';
      if (window.location.pathname !== targetPath) {
        window.history.pushState({}, '', targetPath);
      }
    }
  };

  React.useEffect(() => {
    const handleUrlChange = () => {
      const isAdmin =
        window.location.pathname === '/admin' ||
        window.location.pathname.startsWith('/admin') ||
        window.location.hash.includes('admin');
      setCurrentAppModeState(isAdmin ? 'admin' : 'store');
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Overlays
  const [activeStory, setActiveStory] = useState<ExperientialStory | null>(null);
  const [selectedProductModal, setSelectedProductModal] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: INITIAL_PRODUCTS[0],
      quantity: 1,
      addedFromPostId: 'post_01'
    }
  ]);
  const [checkoutSuccessOrder, setCheckoutSuccessOrder] = useState<OrderRecord | null>(null);

  // Cart calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (product: Product, quantity = 1, fromPostId?: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { product, quantity, addedFromPostId: fromPostId }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setCart([]);

  // Post interactions
  const toggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likesCount: isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1)
          };
        }
        return p;
      })
    );
  };

  const toggleSave = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isSaved = !p.isSaved;
          return {
            ...p,
            isSaved,
            savesCount: isSaved ? p.savesCount + 1 : Math.max(0, p.savesCount - 1)
          };
        }
        return p;
      })
    );
  };

  const addComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newComment = {
            id: `c_${Date.now()}`,
            username: 'you.curator',
            userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
            text: text.trim(),
            createdAt: '今',
            likes: 0
          };
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...(p.comments || []), newComment]
          };
        }
        return p;
      })
    );
  };

  // Checkout process simulation
  const processCheckout = async (customerInfo: {
    name: string;
    email: string;
    address: string;
    provider: string;
  }): Promise<OrderRecord> => {
    const newOrder: OrderRecord = {
      id: `ord_${Date.now().toString().slice(-4)}`,
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      items: cart.map((item) => ({
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price
      })),
      totalAmountJpy: cartSubtotal,
      status: 'paid',
      createdAt: 'たった今',
      utmAttribution: 'utm_source=instagram_feed&utm_medium=carousel_direct'
    };

    // Update state
    setOrders((prev) => [newOrder, ...prev]);
    setKpi((prev) => ({
      ...prev,
      grossMerchandiseValueJpy: prev.grossMerchandiseValueJpy + cartSubtotal,
      ordersCount: prev.ordersCount + 1,
      averageOrderValueJpy: Math.round(
        (prev.grossMerchandiseValueJpy + cartSubtotal) / (prev.ordersCount + 1)
      )
    }));
    clearCart();
    setCheckoutSuccessOrder(newOrder);
    return newOrder;
  };

  // Admin CMS & Operations
  const addPost = (
    newPostData: Omit<ExperientialPost, 'id' | 'likesCount' | 'commentsCount' | 'savesCount' | 'createdAt'>
  ) => {
    const post: ExperientialPost = {
      ...newPostData,
      id: `post_${Date.now()}`,
      likesCount: 0,
      commentsCount: 0,
      savesCount: 0,
      isLiked: false,
      isSaved: false,
      createdAt: 'たった今'
    };
    setPosts((prev) => [post, ...prev]);
  };

  const addCampaign = (
    campaignData: Omit<AdCampaign, 'id' | 'createdAt' | 'impressions' | 'clicks' | 'ctrPercent' | 'roasMultiplier' | 'cpcJpy' | 'totalSpentJpy'>
  ) => {
    const campaign: AdCampaign = {
      ...campaignData,
      id: `cmp_${Date.now()}`,
      totalSpentJpy: 0,
      impressions: 0,
      clicks: 0,
      ctrPercent: 0,
      roasMultiplier: 0,
      cpcJpy: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCampaigns((prev) => [campaign, ...prev]);
  };

  const toggleCampaignStatus = (campaignId: string) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === campaignId) {
          const nextStatus = c.status === 'active' ? 'paused' : 'active';
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...productData,
      id: `prod_${Date.now()}`
    };
    setProducts((prev) => [...prev, newProd]);
  };

  const syncInstagramGraph = async () => {
    // Simulating Instagram Graph API Catalog & Post Sync
    await new Promise((res) => setTimeout(res, 800));
    return { success: true, count: 6 };
  };

  return (
    <CommerceContext.Provider
      value={{
        posts,
        products,
        stories,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        viewMode,
        setViewMode,
        activeStory,
        setActiveStory,
        selectedProductModal,
        setSelectedProductModal,
        toggleLike,
        toggleSave,
        addComment,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        cartCount,
        checkoutSuccessOrder,
        setCheckoutSuccessOrder,
        processCheckout,
        campaigns,
        kpi,
        orders,
        currentAppMode,
        setCurrentAppMode,
        addPost,
        addCampaign,
        toggleCampaignStatus,
        addProduct,
        syncInstagramGraph
      }}
    >
      {children}
    </CommerceContext.Provider>
  );
};

export const useCommerce = () => {
  const context = useContext(CommerceContext);
  if (!context) {
    throw new Error('useCommerce must be used within a CommerceProvider');
  }
  return context;
};
