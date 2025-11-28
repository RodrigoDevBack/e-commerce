from pydantic import BaseModel
from typing import List, Any


class HistoryItemProductSchema(BaseModel):
    id: int
    name: str
    description: str
    price: float
    images: Any


class HistoryItemSchema(BaseModel):
    product: HistoryItemProductSchema
    qtd: int
    unity_price: float


class OrderSnapshotSchema(BaseModel):
    created_at: str
    items: List[HistoryItemSchema]
    total: float


class ResponseHistorySchema(BaseModel):
    id: int
    user: int
    orders: List[OrderSnapshotSchema]

    class Config:
        from_attributes = True
