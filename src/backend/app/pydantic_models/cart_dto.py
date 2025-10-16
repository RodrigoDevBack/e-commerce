from pydantic import BaseModel, field_validator
from typing import Optional, List


class Gmail_User(BaseModel):
    gmail: str


class Add_Product_Cart(BaseModel):
    gmail: str
    product_id: int
    qtd: int


class Delete_Product_Cart(BaseModel):
    gmail: str
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


class Response_Cart(BaseModel):
    id: int
    user: UserBase
    orders: List[OrderBase]
    
    class Config:
        from_attributes = True 
