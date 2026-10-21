"""
FastAPI Serverless Backend for Vercel Monorepo
Experiential E-Commerce & Operations Admin Engine
"""
from datetime import datetime
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

try:
    from api.models import (
        Product, ProductCreate, Post, PostCreate,
        AdCampaign, CampaignStatus, CheckoutRequest, CheckoutResponse,
        DashboardMetrics, OrderStatus, PaymentProvider
    )
except ImportError:
    # Fallback for local path resolution
    from models import (
        Product, ProductCreate, Post, PostCreate,
        AdCampaign, CampaignStatus, CheckoutRequest, CheckoutResponse,
        DashboardMetrics, OrderStatus, PaymentProvider
    )

app = FastAPI(
    title="AURA Experiential Commerce & Marketing Engine API",
    description="Backend services for Instagram-style shoppable feeds, multi-carousel content, marketing attribution, and admin operations.",
    version="1.0.0",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json"
)

# Enable CORS for frontend Vite client & Vercel Preview
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# In-Memory Seed State (Production-ready mock DB)
# ============================================================================

INITIAL_PRODUCTS: List[Dict[str, Any]] = [
    {
        "id": "prod_pants_01",
        "name": "リラックス リネン ワイドトラウザー",
        "brand": "AURA Mobility & Wear",
        "price": 18700,
        "currency": "JPY",
        "description": "フレンチノルマンディ産リネン100%のナチュラルスラブ生地。長時間のドライブや移動でもストレスのないイージーウエスト仕様。",
        "inventory_count": 24,
        "sku": "AURA-PNT-01",
        "tags": ["パンツ", "アパレル", "リネン", "ボトムス"],
        "image_url": "/src/assets/images/card_pants_sideline_cheering_1792551140173.jpg"
    },
    {
        "id": "prod_sweat_02",
        "name": "ヘビーウェイト ループバックスウェット",
        "brand": "Kenji Workshop",
        "price": 15400,
        "currency": "JPY",
        "description": "和歌山の吊り編み機で限界まで度目を詰めた500GSMのオーガニックコットン裏毛スウェット。",
        "inventory_count": 19,
        "sku": "KNJ-SWT-02",
        "tags": ["スウェット", "アパレル", "コットン", "トップス"],
        "image_url": "/src/assets/images/card_sweat_matchday_morning_1792551139398.jpg"
    },
    {
        "id": "prod_polo_03",
        "name": "ファインニット メリノポロシャツ",
        "brand": "AURA Mobility & Wear",
        "price": 16800,
        "currency": "JPY",
        "description": "18.5ミクロンの極細オーストラリアンメリノウールを使用したハイゲージニットポロ。",
        "inventory_count": 16,
        "sku": "AURA-POL-03",
        "tags": ["ポロシャツ", "アパレル", "ニット", "トップス"],
        "image_url": "/src/assets/images/card_polo_sunlit_sideline_1792551140149.jpg"
    },
    {
        "id": "prod_tee_04",
        "name": "ボックスフィット ヘビーウェイトTシャツ",
        "brand": "AURA Mobility & Wear",
        "price": 8900,
        "currency": "JPY",
        "description": "9.0オンスの肉厚オープンエンド天竺コットン。一枚着で透けずタフなボックスシルエット。",
        "inventory_count": 38,
        "sku": "AURA-TEE-04",
        "tags": ["Tシャツ", "アパレル", "オーガニックコットン", "トップス"],
        "image_url": "/src/assets/images/card_tee_trunk_gear_load_1792551140515.jpg"
    }
]

INITIAL_CAMPAIGNS: List[Dict[str, Any]] = [
    {
        "id": "cmp_spring_01",
        "campaign_name": "Spring Linen Lookbook Drop 2026",
        "advertiser": "AURA Atelier",
        "status": "active",
        "daily_budget_jpy": 45000,
        "total_spent_jpy": 342000,
        "impressions": 184500,
        "clicks": 6820,
        "ctr_percent": 3.70,
        "roas_multiplier": 4.82,
        "cpc_jpy": 50.14,
        "utm_source": "instagram",
        "utm_medium": "carousel_ads",
        "utm_campaign": "spring_linen_2026",
        "target_demographics": {"ages": "24-40", "interests": ["Minimalism", "High Fashion", "Linen"]},
        "created_at": "2026-03-01T10:00:00Z"
    },
    {
        "id": "cmp_kyoto_02",
        "campaign_name": "Kyoto Artisan Stories & Tableware",
        "advertiser": "Morita Pottery",
        "status": "active",
        "daily_budget_jpy": 25000,
        "total_spent_jpy": 185000,
        "impressions": 92400,
        "clicks": 3960,
        "ctr_percent": 4.28,
        "roas_multiplier": 5.15,
        "cpc_jpy": 46.71,
        "utm_source": "tiktok",
        "utm_medium": "creator_reels",
        "utm_campaign": "kyoto_craft_expo",
        "target_demographics": {"ages": "26-55", "interests": ["Interior Design", "Ceramics", "Coffee"]},
        "created_at": "2026-03-10T12:00:00Z"
    }
]

# ============================================================================
# API Routes
# ============================================================================

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "framework": "FastAPI 0.110+",
        "runtime": "Python 3.12 Serverless on Vercel",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/api/products", response_model=List[Product])
def list_products(category: Optional[str] = None):
    results = INITIAL_PRODUCTS
    if category and category.lower() != "all":
        results = [p for p in results if any(category.lower() in t.lower() for t in p.get("tags", []))]
    return results

@app.post("/api/products", status_code=status.HTTP_201_CREATED)
def create_product(product: ProductCreate):
    new_product = product.model_dump()
    new_product["id"] = f"prod_{int(datetime.utcnow().timestamp())}"
    new_product["created_at"] = datetime.utcnow()
    INITIAL_PRODUCTS.append(new_product)
    return new_product

@app.get("/api/campaigns")
def list_campaigns():
    return INITIAL_CAMPAIGNS

@app.post("/api/campaigns", status_code=status.HTTP_201_CREATED)
def create_campaign(campaign_data: Dict[str, Any]):
    campaign_id = f"cmp_{int(datetime.utcnow().timestamp())}"
    campaign_data["id"] = campaign_id
    campaign_data["created_at"] = datetime.utcnow().isoformat()
    INITIAL_CAMPAIGNS.append(campaign_data)
    return campaign_data

@app.post("/api/checkout", response_model=CheckoutResponse)
def create_checkout_session(request: CheckoutRequest):
    """
    Simulates Stripe Payment Intent & Order Creation with UTM attribution tracking.
    """
    total = sum(item.price * item.quantity for item in request.items)
    order_id = f"ord_{int(datetime.utcnow().timestamp())}"

    # In production with STRIPE_SECRET_KEY, you would do:
    # stripe.PaymentIntent.create(amount=total, currency="jpy", metadata=request.utm_attribution)

    return CheckoutResponse(
        order_id=order_id,
        client_secret=f"pi_mock_{order_id}_secret_xyz89",
        total_amount=total,
        currency="JPY",
        status=OrderStatus.PAID,
        payment_url=f"/checkout/success?order_id={order_id}"
    )

@app.get("/api/analytics/kpis")
def get_analytics_kpis():
    """
    Returns marketing performance, ROAS, GMV, and experiential conversion funnel.
    """
    return {
        "gross_merchandise_value_jpy": 8452000,
        "orders_count": 348,
        "average_order_value_jpy": 24287,
        "total_impressions": 482000,
        "feed_ctr_percent": 3.94,
        "roas_overall": 4.65,
        "active_ad_campaigns": len([c for c in INITIAL_CAMPAIGNS if c.get("status") == "active"]),
        "conversion_rate_percent": 2.86,
        "top_performing_creators": [
            {"username": "@elena.style", "sales_jpy": 3140000, "conversion_rate": "3.8%"},
            {"username": "@kenji_raw", "sales_jpy": 2480000, "conversion_rate": "3.4%"},
            {"username": "@morita.ceramics", "sales_jpy": 1820000, "conversion_rate": "4.2%"}
        ],
        "sales_by_channel": [
            {"channel": "Instagram Carousel Feed", "share_percent": 54},
            {"channel": "Story Experience Links", "share_percent": 26},
            {"channel": "Promoted Ad Slots", "share_percent": 14},
            {"channel": "Direct & Organic", "share_percent": 6}
        ]
    }

@app.post("/api/admin/sync/instagram")
def sync_instagram_graph_api():
    """
    Simulates sync with Instagram Graph API & Product Catalog tagging.
    """
    return {
        "status": "success",
        "synced_posts_count": 8,
        "catalog_matched_tags": 14,
        "synced_at": datetime.utcnow().isoformat(),
        "graph_api_version": "v19.0"
    }
