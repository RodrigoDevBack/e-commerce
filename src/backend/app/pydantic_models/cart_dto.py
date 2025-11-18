from pydantic import BaseModel
from typing import List, Optional


class GmailUser(BaseModel):
    gmail: str


class AddProductCart(BaseModel):
    product_id: int
    qtd: int


class DeleteProductCart(BaseModel):
    product_id: int


class UserBase(BaseModel):
    id: int
    name: str
    gmail: str
    admin: bool


class ProductBase(BaseModel):
    id: int
    name: str
    description: str
    price: float
    images: Optional[List[str]] = None


class OrderBase(BaseModel):
    id: int
    qtd: int
    unity_price: float
    product: ProductBase


class ResponseCart(BaseModel):
    id: int
    user: UserBase
    orders: List[OrderBase]
