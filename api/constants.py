# -*- coding: utf-8 -*-
"""Constants shared by the chillandtough catalog API."""

APP_TITLE = "chillandtough Catalog API"
APP_DESCRIPTION = "Python API for chillandtough minimalist catalog and admin management."
APP_VERSION = "1.0.0"

# Reported by /api/health and /api/admin/stats
RUNTIME_NAME = "python-fastapi"
PLATFORM_NAME = "vercel"
HEALTH_TIMESTAMP = "2026-10-21T04:15:00Z"
STATS_RUNTIME_LABEL = "Python 3 / FastAPI"
ACTIVE_SEASON = "2026 S/S"
ARCHIVE_STATUS = "Synchronized"

# Filter value meaning "no filter"
ALL_FILTER = "ALL"
UNKNOWN_CATEGORY = "OTHER"

# Product defaults
PRODUCT_ID_PREFIX = "at"
DEFAULT_COLOR_HEX = "#111111"
DEFAULT_ORIGIN = "MADE IN JAPAN (TOKYO)"
DEFAULT_PRIMARY_IMAGE = "/images/catalog_nylon_jacket_1792555601489.jpg"
DEFAULT_STATUS = "ARCHIVE"

# Error messages
MSG_PRODUCT_NOT_FOUND_IN_ARCHIVE = "Product not found in catalog archive."
MSG_PRODUCT_NOT_FOUND = "Product not found."
MSG_DUPLICATE_CODE = "Product code '{code}' already exists."
