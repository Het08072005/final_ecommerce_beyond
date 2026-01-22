from app.utils.query_parser import QueryParser

# Test parsing
queries = [
    'nike shoes for man',
    'man shoes',
    'nike man',
    'shoes for women',
    'women nike'
]

for q in queries:
    result = QueryParser.parse(q)
    print(f"Query: {q}")
    print(f"  Keywords: {result['keywords']}")
    print(f"  Genders: {result['filters']['genders']}")
    print()
