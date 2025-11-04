from typing import Optional, Annotated

from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, status, HTTPException
from jose import jwt, JWTError
from pydantic import BaseModel, ValidationError

from tortoise_models.model_user_db import User
import os, dotenv

dotenv.load_dotenv()

class TokenPayload(BaseModel):
    sub: Optional[int] = None
    
reusable_oauth2 = OAuth2PasswordBearer(tokenUrl="/user/login")

async def get_user(hash_token: Annotated[str, Depends(reusable_oauth2)]):
    try:
        token_decode = jwt.decode(hash_token, os.getenv('SECRET_KEY'), algorithms=[os.getenv('JWT_ALGORITHM')])
        token_valid = TokenPayload(**token_decode)
        
    except (JWTError, ValidationError):
        raise HTTPException(
            status_code= status.HTTP_403_FORBIDDEN,
            detail=f"Could not validate credentials"
            )
        
    user = await User.get_or_none(id = token_valid.sub)    
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not exists")
    
    return int(user.id)

async def get_user_admin(hash_token: Annotated[str, Depends(reusable_oauth2)]):
    try:
        token_decode = jwt.decode(hash_token, os.getenv('SECRET_KEY_ADMIN'), algorithms=[os.getenv('JWT_ALGORITHM')])
        token_valid = TokenPayload(**token_decode)
        
    except (JWTError, ValidationError):
        raise HTTPException(
            status_code= status.HTTP_403_FORBIDDEN,
            detail=f"Could not validate credentials"
            )

    user = await User.get_or_none(id = token_valid.sub)
    if user.admin != True:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail = "User is not admin")    
    elif not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="User not exists")
    
    return int(user.id)

async def combine_verify(hash_token: Annotated[str, Depends(reusable_oauth2)]):
    try:
        return await get_user(hash_token)
    except:
        return await get_user_admin(hash_token)

