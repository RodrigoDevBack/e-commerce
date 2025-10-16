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
    images: List[str]
    


class Admin_Update_Product(BaseModel):
    id: int = Form(...)
    name: Optional[str] = Form(...)
    description: Optional[str] = Form(...)
    qtd: Optional[int] = Form(...)
    price: Optional[float] = Form(...)
    images: List[Optional[UploadFile]] = File(...)

    @field_validator('name', 'qtd', 'description', 'price', 'images')
    @classmethod
    def empty_string_to_none(cls, v):
        if v == "":
            return None
        return v

class Admin_Delete_Product(BaseModel):
    id: int
