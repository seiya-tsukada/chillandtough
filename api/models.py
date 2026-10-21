"""
API Data Models & Schemas (SQLAlchemy & Pydantic v2)
Instagram-style Experiential Commerce + Admin Marketing Engine
"""
from datetime import datetime
from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, HttpUrl

# ============================================================================
# Enums
# ============================================================================

class MediaType(str, Enum):
    IMAGE = "image"
    VIDEO = "video"

class CampaignStatus(str, Enum):
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    DRAFT = "draft"

class OrderStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    FULFILLED = "fulfilled"
    CANCELLED = "cancelled"

class PaymentProvider(str, Enum):
    STRIPE = "stripe"
    APPLE_PAY = "apple_pay"
    KOMOJU = "komoju"

# ============================================================================
# Product Schemas
# ============================================================================

class ProductBase(BaseModel):
    name: str = Field(..., example="Minimal Linen Trench Coat")
    brand: str = Field(..., example="AURA Atelier")
    price: int = Field(..., ge=0, example=24800)
    currency: str = Field(default="JPY")
    description: str
    inventory_count: int = Field(default=25, ge=0)
    sku: str = Field(..., example="AURA-LTC-01")
    tags: List[str] = Field(default_factory=list)
    image_url: str

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

# ============================================================================
# Shoppable Hotspot & Media Carousel Schemas
# ============================================================================

class Hotspot(BaseModel):
    """Interactive shoppable coordinate tag on photo/video"""
    id: str
    x_percent: float = Field(..., ge=0.0, le=100.0, description="X coordinate percentage on media (0-100)")
    y_percent: float = Field(..., ge=0.0, le=100.0, description="Y coordinate percentage on media (0-100)")
    product_id: str
    product_name: str
    price: int
    note: Optional[str] = None

class MediaSlide(BaseModel):
    id: str
    media_type: MediaType = MediaType.IMAGE
    url: str
    caption: Optional[str] = None
    hotspots: List[Hotspot] = Field(default_factory=list)

class AuthorProfile(BaseModel):
    id: str
    username: str
    display_name: str
    avatar_url: str
    is_verified: bool = False
    follower_count: int = 0
    bio: Optional[str] = None

# ============================================================================
# Experiential Feed Post Schemas
# ============================================================================

class SponsorMeta(BaseModel):
    brand_name: str
    campaign_id: str
    cta_text: str = "Shop Now"
    target_url: str

class PostBase(BaseModel):
    caption: str
    location: Optional[str] = None
    experience_rating: Optional[float] = Field(default=5.0, ge=1.0, le=5.0)
    category: str = "Lifestyle"
    is_sponsored: bool = False
    sponsor_info: Optional[SponsorMeta] = None
    tags: List[str] = Field(default_factory=list)

class PostCreate(PostBase):
    slides: List[MediaSlide]

class Post(PostBase):
    id: str
    author: AuthorProfile
    slides: List[MediaSlide]
    likes_count: int = 0
    comments_count: int = 0
    saves_count: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

# ============================================================================
# Marketing & Ads Schemas (Instagram Ads / ROAS / Attribution)
# ============================================================================

class AdCampaign(BaseModel):
    id: str
    campaign_name: str
    advertiser: str
    status: CampaignStatus = CampaignStatus.ACTIVE
    daily_budget_jpy: int
    total_spent_jpy: int = 0
    impressions: int = 0
    clicks: int = 0
    ctr_percent: float = 0.0
    roas_multiplier: float = 0.0
    cpc_jpy: float = 0.0
    utm_source: str = "instagram_ec"
    utm_medium: str = "carousel_feed"
    utm_campaign: str
    target_demographics: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)

# ============================================================================
# Order & Payment Schemas
# ============================================================================

class OrderItem(BaseModel):
    product_id: str
    product_name: str
    quantity: int = Field(..., gt=0)
    price: int

class CheckoutRequest(BaseModel):
    items: List[OrderItem]
    payment_provider: PaymentProvider = PaymentProvider.STRIPE
    customer_email: str
    customer_name: str
    shipping_address: str
    utm_attribution: Optional[Dict[str, str]] = None

class CheckoutResponse(BaseModel):
    order_id: str
    client_secret: Optional[str] = None
    total_amount: int
    currency: str = "JPY"
    status: OrderStatus = OrderStatus.PENDING
    payment_url: Optional[str] = None

# ============================================================================
# Analytics & Admin KPI Schemas
# ============================================================================

class DashboardMetrics(BaseModel):
    gross_merchandise_value_jpy: int
    orders_count: int
    average_order_value_jpy: int
    total_impressions: int
    feed_ctr_percent: float
    roas_overall: float
    active_ad_campaigns: int
    conversion_rate_percent: float
