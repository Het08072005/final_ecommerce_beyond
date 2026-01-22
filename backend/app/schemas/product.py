from pydantic import BaseModel
from typing import List, Optional

class ProductCreate(BaseModel):
    name: str
    category: Optional[str] = None
    brand: Optional[str] = None
    price: Optional[int] = None
    gender: Optional[str] = None
    colors: Optional[List[str]] = []
    sizes: Optional[List[str]] = []
    occasions: Optional[List[str]] = []
    tags: Optional[List[str]] = []
    description: Optional[str] = None
    image_url: Optional[str] = None

class ProductResponse(BaseModel):
    id: int
    name: str
    category: Optional[str]
    brand: Optional[str]
    price: Optional[int]
    gender: Optional[str]
    colors: Optional[List[str]]
    sizes: Optional[List[str]]
    occasions: Optional[List[str]]
    tags: Optional[List[str]]
    description: Optional[str]
    image_url: Optional[str]

    class Config:
        from_attributes = True  # ✅ allows Pydantic to read SQLAlchemy models
