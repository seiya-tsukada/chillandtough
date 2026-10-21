/**
 * Core TypeScript Type Definitions
 * Experiential E-Commerce & Operations Admin Engine
 */

export type MediaType = 'image' | 'video';

export interface Hotspot {
  id: string;
  xPercent: number; // 0 to 100%
  yPercent: number; // 0 to 100%
  productId: string;
  productName: string;
  price: number;
  note?: string;
}

export interface MediaSlide {
  id: string;
  type: MediaType;
  url: string;
  fallbackGradient?: string;
  caption?: string;
  hotspots: Hotspot[];
}

export interface AuthorProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  isVerified: boolean;
  followerCount: number;
  bio?: string;
}

export interface SponsorInfo {
  brandName: string;
  campaignId: string;
  ctaText: string;
  targetUrl: string;
  badgeLabel?: string;
}

export interface PostComment {
  id: string;
  username: string;
  userAvatar: string;
  text: string;
  createdAt: string;
  likes: number;
}

export interface ExperientialPost {
  id: string;
  author: AuthorProfile;
  caption: string;
  location?: string;
  experienceRating?: number; // e.g. 4.9
  category: string;
  slides: MediaSlide[];
  likesCount: number;
  commentsCount: number;
  savesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  isSponsored?: boolean;
  sponsorInfo?: SponsorInfo;
  tags: string[];
  createdAt: string;
  comments?: PostComment[];
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  currency: string;
  description: string;
  inventoryCount: number;
  sku: string;
  tags: string[];
  imageUrl: string;
  rating?: number;
  reviewCount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
  addedFromPostId?: string;
}

export interface StorySlide {
  id: string;
  url: string;
  caption?: string;
  durationSeconds?: number;
  productId?: string;
}

export interface ExperientialStory {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  title: string;
  coverImage: string;
  slides: StorySlide[];
  viewed?: boolean;
}

export interface AdCampaign {
  id: string;
  campaignName: string;
  advertiser: string;
  status: 'active' | 'paused' | 'draft' | 'completed';
  dailyBudgetJpy: number;
  totalSpentJpy: number;
  impressions: number;
  clicks: number;
  ctrPercent: number;
  roasMultiplier: number;
  cpcJpy: number;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  targetDemographics: {
    ages: string;
    interests: string[];
  };
  createdAt: string;
}

export interface AnalyticsKPIs {
  grossMerchandiseValueJpy: number;
  ordersCount: number;
  averageOrderValueJpy: number;
  totalImpressions: number;
  feedCtrPercent: number;
  roasOverall: number;
  activeAdCampaigns: number;
  conversionRatePercent: number;
  topPerformingCreators: {
    username: string;
    salesJpy: number;
    conversionRate: string;
  }[];
  salesByChannel: {
    channel: string;
    sharePercent: number;
  }[];
}

export interface OrderRecord {
  id: string;
  customerName: string;
  customerEmail: string;
  items: {
    productName: string;
    quantity: number;
    price: number;
  }[];
  totalAmountJpy: number;
  status: 'paid' | 'pending' | 'fulfilled' | 'cancelled';
  createdAt: string;
  utmAttribution?: string;
}
