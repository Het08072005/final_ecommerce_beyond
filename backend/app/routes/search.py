# from fastapi import APIRouter, Depends, Query
# from sqlalchemy.orm import Session
# from typing import List, Optional

# from fastapi.encoders import jsonable_encoder  # 🔹 new import
# from app.database import get_db
# from app.schemas.product import ProductCreate, ProductResponse
# from app.models.product import Product
# from app.services.search_service import SearchService
# from app.websocket.manager import manager  # 🔥 WebSocket manager

# router = APIRouter()


# # ----------------------------------------
# # Add product endpoint
# # ----------------------------------------
# @router.post("/add", response_model=ProductResponse)
# def add_product(product: ProductCreate, db: Session = Depends(get_db)):
#     db_product = Product(**product.dict())
#     return SearchService.add_product(db, db_product)


# # ----------------------------------------
# # Get all products
# # ----------------------------------------
# @router.get("/all", response_model=List[ProductResponse])
# def get_all_products(db: Session = Depends(get_db)):
#     return SearchService.get_all(db)


# # ----------------------------------------
# # Simple search endpoint
# # ----------------------------------------
# @router.get("/search", response_model=List[ProductResponse])
# async def search(q: str = Query(None), db: Session = Depends(get_db)):
#     """
#     Standard search endpoint:
#     - Accepts query q (text)
#     - Returns matching products
#     - Broadcasts results via WebSocket
#     """
#     if not q:
#         products = SearchService.get_all(db)
#     else:
#         products = SearchService.smart_search(db, q)

#     # 🔹 Convert products to JSON-serializable format
#     products_json = jsonable_encoder(products)

#     # 🔥 Broadcast to all connected WebSocket clients
#     await manager.broadcast({
#         "type": "SEARCH_RESULT",
#         "query": q or "",
#         "found": len(products) > 0,
#         "products": products_json
#     })

#     return products


# # ----------------------------------------
# # Smart search endpoint (natural language)
# # ----------------------------------------
# @router.get("/smart-search")
# async def smart_search(q: str = Query(None), db: Session = Depends(get_db)):
#     """
#     Parses natural language queries like:
#     'nike black sport shoes under 10k'
#     Returns products, applied filters, parsed query
#     Broadcasts results to WebSocket for frontend auto-fill
#     """
#     if not q:
#         products = SearchService.get_all(db)
#         parsed = {"keywords": [], "filters": {}}
#     else:
#         result = SearchService.advanced_search_with_filters(db, q)
#         products = result.get("products", [])
#         parsed = result.get("parsedQuery", {"keywords": [], "filters": {}})

#     # 🔹 Convert products to JSON-serializable format
#     products_json = jsonable_encoder(products)

#     # 🔥 Broadcast to frontend
#     await manager.broadcast({
#         "type": "SEARCH_RESULT",
#         "query": q or "",
#         "found": len(products) > 0,
#         "products": products_json,
#         "parsedQuery": parsed
#     })

#     return {
#         "products": products,
#         "parsedQuery": parsed
#     }


# # ----------------------------------------
# # Advanced search with multiple filters
# # ----------------------------------------
# @router.get("/advanced-search", response_model=List[ProductResponse])
# async def advanced_search(
#     q: Optional[str] = Query(None),
#     category: Optional[str] = Query(None),
#     gender: Optional[str] = Query(None),
#     min_price: Optional[int] = Query(None),
#     max_price: Optional[int] = Query(None),
#     color: Optional[str] = Query(None),
#     size: Optional[str] = Query(None),
#     occasion: Optional[str] = Query(None),
#     db: Session = Depends(get_db)
# ):
#     """
#     Advanced search endpoint with multiple filters:
#     - q: search query (text search)
#     - category, gender, min_price, max_price, color, size, occasion
#     Broadcasts results via WebSocket
#     """

#     filters = {
#         "query": q,
#         "category": category,
#         "gender": gender,
#         "min_price": min_price,
#         "max_price": max_price,
#         "color": color,
#         "size": size,
#         "occasion": occasion
#     }

#     products = SearchService.advanced_search(db, filters)

#     # 🔹 Convert products to JSON-serializable format
#     products_json = jsonable_encoder(products)

#     # 🔥 Broadcast to frontend
#     await manager.broadcast({
#         "type": "SEARCH_RESULT",
#         "query": q or "",
#         "found": len(products) > 0,
#         "products": products_json,
#         "filters": {k: v for k, v in filters.items() if v is not None}
#     })

#     return products








# from fastapi import APIRouter, Depends, Query
# from sqlalchemy.orm import Session
# from typing import List

# from app.database import get_db
# from app.schemas.product import ProductResponse
# from app.services.search_service import SearchService

# router = APIRouter()

# @router.get("/search", response_model=List[ProductResponse])
# def search_products(
#     q: str = Query(..., description="Natural language search"),
#     db: Session = Depends(get_db)
# ):
#     """
#     Examples:
#     nike puma red blue under 5k men trending
#     between 5k to 7k casual shoes
#     best running shoes for gym
#     """

#     result = SearchService.search(db, q)
#     return result["products"]





from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from fastapi.encoders import jsonable_encoder

from app.database import get_db
from app.schemas.product import ProductCreate, ProductResponse
from app.models.product import Product
from app.services.search_service import SearchService
from app.websocket.manager import manager

router = APIRouter()


# ----------------------------
# POST /api/add
# ----------------------------
@router.post("/add", response_model=ProductResponse)
async def add_product(
    product: ProductCreate,
    db: Session = Depends(get_db)
):
    db_product = Product(**product.dict())
    created = SearchService.add_product(db, db_product)

    await manager.broadcast({
        "type": "PRODUCT_ADDED",
        "product": jsonable_encoder(created)
    })

    return created


# ----------------------------
# GET /api/all
# ----------------------------
@router.get("/all", response_model=List[ProductResponse])
async def get_all_products(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    gender: str = Query(None),
    min_price: int = Query(None),
    max_price: int = Query(None),
    size: int = Query(None)
):
    filters = {
        "gender": gender,
        "min_price": min_price,
        "max_price": max_price,
        "size": size
    }
    products = SearchService.get_all(db, skip=skip, limit=limit, filters=filters)

    await manager.broadcast({
        "type": "ALL_PRODUCTS",
        "count": len(products),
        "skip": skip,
        "limit": limit
    })

    return products


# ----------------------------
# GET /api/search?q=...
# ----------------------------
@router.get("/search", response_model=List[ProductResponse])
async def search_products(
    q: str = Query(..., description="Natural language search query"),
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100)
):
    """
    Hybrid Search:
    - Gemini embeddings (semantic)
    - PostgreSQL filters (price, brand, size, color, occasion, gender)
    """

    # 🔥 HYBRID SEARCH CALL
    result = SearchService.hybrid_search(db, q, skip=skip, limit=limit)

    products = result["products"]
    parsed = result["parsed"]

    # 🔥 Validate with Pydantic to strip 'embedding' and other non-schema fields
    # Use model_validate for Pydantic V2
    products_pydantic = [ProductResponse.model_validate(p) for p in products]

    # 🔥 ONLY PLACE WHERE FRONTEND GETS DATA
    await manager.broadcast({
        "type": "SEARCH_RESULT",
        "query": q,
        "products": jsonable_encoder(products_pydantic),
        "count": len(products),
        "parsedQuery": parsed
    })

    return products