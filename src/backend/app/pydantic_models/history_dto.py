from pydantic import BaseModel
from typing import List, Any


class HistoryItemProduct(BaseModel):
    id: int
    name: str
    description: str
    price: float
    images: Any


class HistoryItem(BaseModel):
    product: HistoryItemProduct
    qtd: int
    unity_price: float


class OrderSnapshot(BaseModel):
    created_at: str
    items: List[HistoryItem]
    total: float


class ResponseHistory(BaseModel):
    id: int
    user: int
    orders: List[OrderSnapshot]

    class Config:
        from_attributes = True
