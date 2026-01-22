# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker
# from app.models.product import Product
# from app.database import Base

# OLD_POSTGRES_URL = "postgresql://postgres:Het7890@localhost:5432/ecommerce"
# NEON_DB_URL = "postgresql://neondb_owner:npg_3zMRH6ouithg@ep-royal-wind-a1itlenz-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# old_engine = create_engine(OLD_POSTGRES_URL)
# neon_engine = create_engine(NEON_DB_URL)

# OldSession = sessionmaker(bind=old_engine)
# NeonSession = sessionmaker(bind=neon_engine)

# Base.metadata.create_all(bind=neon_engine)

# old_db = OldSession()
# neon_db = NeonSession()

# products = old_db.query(Product).all()

# for p in products:
#     neon_db.add(Product(
#         name=p.name,
#         category=p.category,
#         brand=p.brand,
#         price=p.price,
#         gender=p.gender,
#         colors=p.colors,
#         sizes=p.sizes,
#         occasions=p.occasions,
#         tags=p.tags,
#         description=p.description,
#         image_url=p.image_url,
#     ))

# neon_db.commit()

# old_db.close()
# neon_db.close()

# print("✅ All PostgreSQL data migrated to Neon successfully")








import time
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.database import SessionLocal
from app.models.product import Product
from app.services.embedding_service import EmbeddingService
from app.utils.text_builder import build_product_text


BATCH_SIZE = 10
SLEEP_SECONDS = 1


def backfill_embeddings():
    db: Session = SessionLocal()

    try:
        total = db.query(Product).filter(Product.embedding.is_(None)).count()
        print(f"\n🔍 Products missing embeddings: {total}\n")

        processed = 0

        while True:
            products = (
                db.query(Product)
                .filter(Product.embedding.is_(None))
                .limit(BATCH_SIZE)
                .all()
            )

            if not products:
                break

            for product in products:
                try:
                    text = build_product_text(product)

                    if not text.strip():
                        print(f"⚠️ Skipping product {product.id} (empty text)")
                        continue

                    embedding = EmbeddingService.embed_text(text)
                    product.embedding = embedding

                    processed += 1
                    print(f"✅ Embedded product ID: {product.id}")

                    time.sleep(SLEEP_SECONDS)

                except Exception as e:
                    print(f"❌ Failed product {product.id}: {e}")
                    db.rollback()

            db.commit()

        print(f"\n🎉 Done. Embedded {processed} products.")

    except SQLAlchemyError as e:
        print(f"🔥 Database error: {e}")
        db.rollback()

    finally:
        db.close()


if __name__ == "__main__":
    backfill_embeddings()
