from typing import Union, Any
from datetime import datetime, timedelta, timezone
from jose import jws, jwt
from jose import JWSError
import os

SECRET_KEY = os.getenv("SECRET_KEY", "eumeremejomuito")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS512")
ACESS_TOKEN_EXPIRE_HOURS = 24

def hash_token_user(subject: Union[str, Any]):
    expire = datetime.now(timezone.utc) + timedelta(hours=ACESS_TOKEN_EXPIRE_HOURS)
    to_encode = {"exp" : expire, "sub" : str(subject)}
    encoded_jwt = jwt.encode(
        to_encode, 
        SECRET_KEY, 
        algorithm = JWT_ALGORITHM
        )
    
    return encoded_jwt
    


def to_hash_password(password):
    password_hash = jws.sign(
        {"key" : password}, 
        "security", 
        algorithm="HS256"
        )
    return password_hash

def verify_password(hash_password):
    try:
        if jws.verify(hash_password, "security", algorithms="HS256"):
            return True
    except JWSError:
        return False
