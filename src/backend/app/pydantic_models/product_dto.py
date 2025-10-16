from pydantic import BaseModel
from typing import List

class Product_Response(BaseModel):
    id: int
    name: str
    description: str
    qtd: int
    price: float
    images: List[str]
    