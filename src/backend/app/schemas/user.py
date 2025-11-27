from pydantic import BaseModel, field_validator
from security.encrypter_password import to_hash_password

class UserSchemas:
    class RegisterUserSchema(BaseModel):
        name: str
        email: str
        password: str
        
        @field_validator('password', mode='before')
        def password_hash(cls, v):
            return to_hash_password(v)


    class LoginUserSchema(BaseModel):
        email: str
        password: str
        admin: bool


    class UserRequestRecoverPasswordSchema(BaseModel):
        email: str


    class UserRecoverPasswordSchema(BaseModel):
        email: str
        code: int
        password: str
        
        @field_validator('password', mode='before')
        def password_hash(cls, v):
            return to_hash_password(v)
        

    class UserUpdateEmailSchema(BaseModel):
        email: str
        new_email: str


    class UserValidateEmailSchema(BaseModel):
        email: str
        secret_code: str

    class UserResponseSchema(BaseModel):
        id: int
        name: str
        gmail: str
        status_email: bool
        status: bool
        admin: bool

        class Config:
            from_attributes = True
