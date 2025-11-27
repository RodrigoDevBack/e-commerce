from pydantic import BaseModel, field_validator
from typing import Optional

class AdminDisableUserSchema(BaseModel):
    gmail: str
    

class AdminCreateProductSchema(BaseModel):
    name: str
    description: str
    qtd: int
    price: float

class AdminResponseProductSchema(BaseModel):
    id: int
    name: str
    description: str
    qtd: int
    price: float

class AdminUpdateProductSchema(BaseModel):
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

class AdminDeleteProductSchema(BaseModel):
    id: int
