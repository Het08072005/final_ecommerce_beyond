from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.product import Product
from app.services.embedding_service import EmbeddingService
from app.utils.query_parser import parse
from app.utils.text_builder import build_product_text

class SearchService:

    @staticmethod
    def add_product(db: Session, product: Product):
        """
        Adds a product to DB with embedding.
        """
        text = build_product_text(product)
        product.embedding = EmbeddingService.embed_text(text)

        db.add(product)
        db.commit()
        db.refresh(product)
        return product

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 20, filters: dict = None):
        query = db.query(Product)
        
        if filters:
            if filters.get("gender") and filters["gender"] != 'all':
                query = query.filter(Product.gender.ilike(filters["gender"]))
            if filters.get("min_price"):
                query = query.filter(Product.price >= int(filters["min_price"]))
            if filters.get("max_price"):
                query = query.filter(Product.price <= int(filters["max_price"]))
            if filters.get("size"):
                size_val = str(filters["size"])
                query = query.filter(Product.sizes.any(size_val))
        
        return query.offset(skip).limit(limit).all()

    @staticmethod
    def hybrid_search(db: Session, query_text: str, skip: int = 0, limit: int = 20, alpha: 0.8 = 0.8):
        """
        Hybrid search combining vector similarity + filters.
        alpha: weight of semantic similarity (0-1)
        """

        parsed = parse(query_text)
        filters = parsed.get("filters", {})

        # --- Embed query ---
        query_embedding = EmbeddingService.embed_text(query_text)

        # --- Base query with cosine similarity ---
        similarity_expr = Product.embedding.cosine_distance(query_embedding)
        query = db.query(Product, similarity_expr.label("distance"))

        # --- Apply filters ---
        if filters.get("min_price") is not None:
            query = query.filter(Product.price >= filters["min_price"])
        if filters.get("max_price") is not None:
            query = query.filter(Product.price <= filters["max_price"])
        
        # In the new parser, brands/colors/genders are lists
        if filters.get("brands"):
            # If any brand matches
            query = query.filter(
                or_(*[Product.brand.ilike(f"%{b}%") for b in filters["brands"]])
            )
        if filters.get("colors"):
            # If any color matches (assuming Product.colors is ARRAY)
            query = query.filter(
                or_(*[Product.colors.any(c) for c in filters["colors"]])
            )
        if filters.get("sizes"):
            query = query.filter(
                or_(*[Product.sizes.any(s) for s in filters["sizes"]])
            )
        if filters.get("occasions"):
            query = query.filter(
                or_(*[Product.occasions.any(o) for o in filters["occasions"]])
            )
        if filters.get("genders"):
            query = query.filter(
                or_(*[Product.gender.ilike(f"%{g}%") for g in filters["genders"]])
            )

        # --- Order by vector similarity (lower distance = more similar) ---
        results = query.order_by(similarity_expr).offset(skip).limit(limit).all()

        return {
            "products": [p[0] for p in results],
            "parsed": parsed
        }

