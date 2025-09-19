from pydantic import BaseModel, field_validator
from security.encrypter_password import to_hash_password

class RegisterUserDTO(BaseModel):
    name: str
    email: str
    password: str
    
    @field_validator('password', mode='before')
    def password_hash(cls, v):
        return to_hash_password(v)


class LoginUserDTO(BaseModel):
    email: str
    password: str
    admin: bool


class UserRecoverPassword(BaseModel):
    email: str
    password: str
    

class UserUpdateEmail(BaseModel):
    email: str
    new_email: str


class UserValidateEmail(BaseModel):
    email: str
    secret_code: str


class UserResponseDTO(BaseModel):
    id: int
    name: str
    status_email: bool
    status: bool
    admin: bool

    class Config:
        from_attributes = True
