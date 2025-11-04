from pydantic import BaseModel, field_validator
from typing import Optional, List
from fastapi import UploadFile, File, Form

class Admin_Disable_User(BaseModel):
    gmail: str
    

class Admin_Create_Product(BaseModel):
    name: str
    description: str
    qtd: int
    price: float

class Admin_Response_Product(BaseModel):
    id: int
    name: str
    description: str
    qtd: int
    price: float

class Admin_Update_Product(BaseModel):
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

class Admin_Delete_Product(BaseModel):
    id: int
