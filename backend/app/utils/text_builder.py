def build_product_text(product):
    return f"""
    Name: {product.name}
    Category: {product.category}
    Brand: {product.brand}
    Gender: {product.gender}
    Colors: {' '.join(product.colors or [])}
    Sizes: {' '.join(product.sizes or [])}
    Occasions: {' '.join(product.occasions or [])}
    Tags: {' '.join(product.tags or [])}
    Description: {product.description}
    """
