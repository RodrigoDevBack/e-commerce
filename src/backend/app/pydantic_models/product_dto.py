from pydantic import BaseModel
from typing import List, Optional

class Product_Response(BaseModel):
    id: int
    name: str
    description: str
    qtd: int
    price: float
    images: Optional[List[str]]
    