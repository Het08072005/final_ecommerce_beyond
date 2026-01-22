from app.database import SessionLocal
from app.services.search_service import SearchService

db = SessionLocal()

# Test searches
test_queries = [
    'nike shoes for man',
    'man shoes',
    'women shoes',
    'nike women',
]

for query in test_queries:
    result = SearchService.advanced_search_with_filters(db, query)
    products = result['products']
    filters = result['appliedFilters']
    
    print(f"Query: '{query}'")
    print(f"  Detected Filters: {filters}")
    print(f"  Results: {len(products)} products")
    for p in products[:3]:  # Show first 3
        print(f"    - {p.name} ({p.brand}, {p.gender})")
    print()

db.close()
