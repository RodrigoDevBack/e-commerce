from typing import Union, Any
from datetime import datetime, timedelta, timezone
from jose import jws, jwt
from jose import JWSError
import os, dotenv

dotenv.load_dotenv()

def hash_token_user(subject: Union[str, Any]):
    expire = datetime.now(timezone.utc) + timedelta(hours = int(os.getenv('ACESS_TOKEN_EXPIRE_HOURS')))
    to_encode = {"exp" : expire, "sub" : str(subject)}
    encoded_jwt = jwt.encode(
        to_encode, 
        os.getenv('SECRET_KEY'), 
        algorithm = os.getenv('JWT_ALGORITHM')
        )
    
    return encoded_jwt

def hash_token_admin(subject: Union[str, Any]):
    expire = datetime.now(timezone.utc) + timedelta(hours = int(os.getenv('ACESS_TOKEN_EXPIRE_HOURS')))
    to_encode = {"exp" : expire, "sub" : str(subject)}
    encoded_jwt = jwt.encode(
        to_encode, 
        os.getenv('SECRET_KEY_ADMIN'), 
        algorithm = os.getenv('JWT_ALGORITHM')
        )
    
    return encoded_jwt
    


def to_hash_password(password):
    password_hash = jws.sign(
        {"key" : password}, 
        os.getenv("SECRET_KEY_PASSWORD"), 
        algorithm = os.getenv('JWT_ALGORITHM_PASSWORD')
        )
    return password_hash

def verify_password(hash_password):
    try:
        if jws.verify(hash_password, os.getenv("SECRET_KEY_PASSWORD"), algorithms = os.getenv('JWT_ALGORITHM_PASSWORD')):
            return True
    except JWSError:
        return False
