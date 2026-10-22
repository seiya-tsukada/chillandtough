# -*- coding: utf-8 -*-
"""
FastAPI Serverless Application for Vercel.
Entry point: /api/index.py
Provides catalog management, product CRUD, and telemetry for chillandtough.
"""

from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import copy

from .data import DEFAULT_PRODUCTS
from .constants import (
    ACTIVE_SEASON,
    ALL_FILTER,
    APP_DESCRIPTION,
    APP_TITLE,
    APP_VERSION,
    ARCHIVE_STATUS,
    DEFAULT_COLOR_HEX,
    DEFAULT_ORIGIN,
    DEFAULT_PRIMARY_IMAGE,
    DEFAULT_STATUS,
    HEALTH_TIMESTAMP,
    MSG_DUPLICATE_CODE,
    MSG_PRODUCT_NOT_FOUND,
    MSG_PRODUCT_NOT_FOUND_IN_ARCHIVE,
    PLATFORM_NAME,
    PRODUCT_ID_PREFIX,
    RUNTIME_NAME,
    STATS_RUNTIME_LABEL,
    UNKNOWN_CATEGORY,
)

app = FastAPI(
    title=APP_TITLE,
    description=APP_DESCRIPTION,
    version=APP_VERSION
)

# Enable CORS for local dev and Vercel domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for serverless runtime (can be backed by DB/kv in production)
products_db: List[Dict[str, Any]] = copy.deepcopy(DEFAULT_PRODUCTS)


# --- Pydantic Data Models ---
class ColorItem(BaseModel):
    name: str
    hex: str = DEFAULT_COLOR_HEX


class SizeMeasurementItem(BaseModel):
    size: str
    length: float = 0
    chest: float = 0
    shoulder: float = 0
    sleeve: float = 0
    waist: Optional[float] = None
    inseam: Optional[float] = None


class ProductCreate(BaseModel):
    id: Optional[str] = None
    code: str = Field(..., example="AT-JK09")
    titleEn: str = Field(..., example="STAND COLLAR ANORAK")
    titleJp: str = Field(..., example="スタンドカラー アノラック")
    category: str = Field(..., example="OUTERWEAR")
    season: str = Field(..., example="2026 S/S")
    releaseDate: str = Field(..., example="2026.05.01")
    priceJpy: int = Field(..., example=42000)
    priceUsd: int = Field(..., example=280)
    colors: List[ColorItem] = []
    material: str = Field(..., example="100% High-Density Ripstop Nylon")
    origin: str = Field(default=DEFAULT_ORIGIN)
    descriptionEn: str = Field(default="")
    descriptionJp: str = Field(default="")
    primaryImage: str = Field(default=DEFAULT_PRIMARY_IMAGE)
    status: str = Field(default=DEFAULT_STATUS)
    measurements: List[SizeMeasurementItem] = []
    details: List[str] = []


class ProductUpdate(BaseModel):
    code: Optional[str] = None
    titleEn: Optional[str] = None
    titleJp: Optional[str] = None
    category: Optional[str] = None
    season: Optional[str] = None
    releaseDate: Optional[str] = None
    priceJpy: Optional[int] = None
    priceUsd: Optional[int] = None
    colors: Optional[List[ColorItem]] = None
    material: Optional[str] = None
    origin: Optional[str] = None
    descriptionEn: Optional[str] = None
    descriptionJp: Optional[str] = None
    primaryImage: Optional[str] = None
    status: Optional[str] = None
    measurements: Optional[List[SizeMeasurementItem]] = None
    details: Optional[List[str]] = None


# --- Endpoints ---

@app.get("/api/health")
def health_check():
    """Health check endpoint to verify Python API runtime on Vercel."""
    return {
        "status": "ok",
        "runtime": RUNTIME_NAME,
        "platform": PLATFORM_NAME,
        "catalogItems": len(products_db),
        "timestamp": HEALTH_TIMESTAMP
    }


@app.get("/api/products")
def list_products(
    category: Optional[str] = Query(None, description="Filter by category: OUTERWEAR, TOPS, BOTTOMS, GOODS"),
    season: Optional[str] = Query(None, description="Filter by season"),
    q: Optional[str] = Query(None, description="Search keyword in title, code, material")
):
    """Retrieve catalog items with optional filtering and query search."""
    results = products_db

    if category and category.upper() != ALL_FILTER:
        results = [p for p in results if p.get("category", "").upper() == category.upper()]

    if season and season.upper() != ALL_FILTER:
        results = [p for p in results if p.get("season", "").upper() == season.upper()]

    if q:
        query = q.lower().strip()
        results = [
            p for p in results
            if query in p.get("titleEn", "").lower()
            or query in p.get("titleJp", "").lower()
            or query in p.get("code", "").lower()
            or query in p.get("material", "").lower()
        ]

    return results


@app.get("/api/products/{product_id}")
def get_product(product_id: str):
    """Retrieve a single product by its ID or SKU code."""
    for p in products_db:
        if p.get("id") == product_id or p.get("code") == product_id:
            return p
    raise HTTPException(status_code=404, detail=MSG_PRODUCT_NOT_FOUND_IN_ARCHIVE)


@app.post("/api/products", status_code=status.HTTP_201_CREATED)
def create_product(product: ProductCreate):
    """Create a new catalog item (Admin action)."""
    # Check duplicate SKU
    for existing in products_db:
        if existing.get("code") == product.code:
            raise HTTPException(status_code=400, detail=MSG_DUPLICATE_CODE.format(code=product.code))

    new_dict = product.model_dump()
    if not new_dict.get("id"):
        new_dict["id"] = f"{PRODUCT_ID_PREFIX}-{len(products_db) + 1:02d}-{product.code.lower().replace('/', '-')}"

    products_db.insert(0, new_dict)
    return new_dict


@app.put("/api/products/{product_id}")
def update_product(product_id: str, updates: ProductUpdate):
    """Update an existing catalog item (Admin action)."""
    for index, existing in enumerate(products_db):
        if existing.get("id") == product_id or existing.get("code") == product_id:
            update_data = updates.model_dump(exclude_unset=True)
            existing.update(update_data)
            products_db[index] = existing
            return existing

    raise HTTPException(status_code=404, detail=MSG_PRODUCT_NOT_FOUND)


@app.delete("/api/products/{product_id}")
def delete_product(product_id: str):
    """Delete a catalog item (Admin action)."""
    global products_db
    initial_len = len(products_db)
    products_db = [p for p in products_db if p.get("id") != product_id and p.get("code") != product_id]

    if len(products_db) == initial_len:
        raise HTTPException(status_code=404, detail=MSG_PRODUCT_NOT_FOUND)

    return {"deleted": True, "productId": product_id, "remainingCount": len(products_db)}


@app.get("/api/admin/stats")
def get_admin_stats():
    """Summary statistics for the admin dashboard."""
    total = len(products_db)
    categories_count: Dict[str, int] = {}
    total_val_jpy = 0

    for p in products_db:
        cat = p.get("category", UNKNOWN_CATEGORY)
        categories_count[cat] = categories_count.get(cat, 0) + 1
        total_val_jpy += p.get("priceJpy", 0)

    return {
        "totalProducts": total,
        "categories": categories_count,
        "totalValuationJpy": total_val_jpy,
        "activeSeason": ACTIVE_SEASON,
        "archiveStatus": ARCHIVE_STATUS,
        "runtime": STATS_RUNTIME_LABEL
    }


@app.post("/api/admin/reset")
def reset_catalog():
    """Reset catalog to factory default products."""
    global products_db
    products_db = copy.deepcopy(DEFAULT_PRODUCTS)
    return {"reset": True, "count": len(products_db)}
