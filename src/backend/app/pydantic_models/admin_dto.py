from pydantic import BaseModel, field_validator
from typing import Optional

class AdminDisableUser(BaseModel):
    gmail: str
    

class AdminCreateProduct(BaseModel):
    name: str
    description: str
    qtd: int
    price: float

class AdminResponseProduct(BaseModel):
    id: int
    name: str
    description: str
    qtd: int
    price: float

class AdminUpdateProduct(BaseModel):
    id: int
    name: Optional[str]
    description: Optional[str]
    qtd: Optional[int]
    price: Optional[float]

    @field_validator('name', 'qtd', 'description', 'price')
    @classmethod
    def empty_string_to_none(cls, v):
        if v == "":
            return None
        return v

class AdminDeleteProduct(BaseModel):
    id: int
