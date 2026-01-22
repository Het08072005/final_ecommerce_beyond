from app.database import SessionLocal
from app.models.product import Product

db = SessionLocal()

# Check all products
products = db.query(Product).all()
print(f"Total products in DB: {len(products)}")
print()

# Check male products
male_products = db.query(Product).filter(Product.gender == 'male').all()
print(f"Male products: {len(male_products)}")
for p in male_products:
    print(f"  - {p.name} (Brand: {p.brand}, Gender: {p.gender})")

print()

# Check female products
female_products = db.query(Product).filter(Product.gender == 'female').all()
print(f"Female products: {len(female_products)}")
for p in female_products:
    print(f"  - {p.name} (Brand: {p.brand}, Gender: {p.gender})")

print()

# Check Nike products
nike_products = db.query(Product).filter(Product.brand.ilike('%nike%')).all()
print(f"Nike products: {len(nike_products)}")
for p in nike_products:
    print(f"  - {p.name} (Gender: {p.gender})")

db.close()
