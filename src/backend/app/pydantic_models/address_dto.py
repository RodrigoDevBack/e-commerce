from pydantic import BaseModel
from typing import Optional

class AddressResponse(BaseModel):
    CEP: str
    Logradouro: str
    Numero: int
    Complemento: str
    Bairro: str
    Cidade: str
    Estado: str
    Pais: str


class CreateAddress(BaseModel):
    CEP: str
    Logradouro: str
    Numero: int
    Complemento: str
    Bairro: str
    Cidade: str
    Estado: str
    Pais: str


class EditAddress(BaseModel):
    CEP: Optional[str]
    Logradouro: Optional[str]
    Numero: Optional[int]
    Complemento: Optional[str]
    Bairro: Optional[str]
    Cidade: Optional[str]
    Estado: Optional[str]
    Pais: Optional[str]
