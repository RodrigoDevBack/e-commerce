from pydantic import BaseModel
from typing import List


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
    
    class Config:
        from_attributes = True


class ProductBase(BaseModel):
    id: int
    name: str
    description: str
    price: float
    
    class Config:
        from_attributes = True


class OrderBase(BaseModel):
    id: int
    qtd: int
    unity_price: float
    product: ProductBase
    
    class Config:
        from_attributes = True


class ResponseCart(BaseModel):
    id: int
    user: UserBase
    orders: List[OrderBase]
    
    class Config:
        from_attributes = True 
