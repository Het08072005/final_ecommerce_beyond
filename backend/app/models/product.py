from sqlalchemy import Column, Integer, String, Text, ARRAY
from pgvector.sqlalchemy import Vector
from app.database import Base

# models/product.py
class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String)
    brand = Column(String)
    price = Column(Integer)
    gender = Column(String)
    colors = Column(ARRAY(String))
    sizes = Column(ARRAY(String))
    occasions = Column(ARRAY(String))
    tags = Column(ARRAY(String))
    description = Column(Text)
    image_url = Column(Text)

    embedding = Column(Vector(3072))  # Gemini embedding size