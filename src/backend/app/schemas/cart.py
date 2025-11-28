from pydantic import BaseModel
from typing import List, Optional


class GmailUserSchema(BaseModel):
    gmail: str


class AddProductCartSchema(BaseModel):
    product_id: int
    qtd: int


class DeleteProductCartSchema(BaseModel):
    product_id: int


class UserBase(BaseModel):
    id: int
    name: str
    gmail: str
    admin: bool


class ProductBaseSchema(BaseModel):
    id: int
    name: str
    description: str
    price: float
    images: Optional[List[str]] = None


class OrderBaseSchema(BaseModel):
    id: int
    qtd: int
    unity_price: float
    product: ProductBaseSchema


class ResponseCart(BaseModel):
    id: int
    user: UserBase
    orders: List[OrderBaseSchema]
