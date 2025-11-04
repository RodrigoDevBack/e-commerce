from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from pydantic_models import user_dto
from tortoise_models.model_user_db import User
from security.encrypter_password import to_hash_password, hash_token_user, hash_token_admin
from security.user_depends import combine_verify
import re
from integrations.email_client import Email_Client
from integrations.recover_password_client import Password_Recover_Email

email = Email_Client()
recover_password_email = Password_Recover_Email()

router_user = APIRouter(
    tags = ['User'],
    responses = {404: {'Description': 'Not found'}}
)
regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9._]+\.[A-Z|a-z]{2,7}\b'
def validate_email(email):
    if not email:
        return False
    elif re.fullmatch(regex, email):
        return True
    else:
        return False

@router_user.get('/me', response_model=user_dto.UserResponseDTO)
async def get_profile_user(bearer: Annotated[str, Depends(combine_verify)]):
    user = await User.get_or_none(id=bearer)
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail='User not exists')
    return user


@router_user.post('/register', response_model = user_dto.UserResponseDTO)
async def register_user(user: user_dto.RegisterUserDTO):
    if validate_email(user.email):
        pass
    else:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="O email é inválido.")
    
    if await User.get_or_none(id = 1) == None:
        email.create_code(user.email)
        email.send_email_admin(user.name, user.email, email.get_code(user.email))
        register = await User.create(
            name = user.name,
            gmail = user.email,
            password = user.password,
            admin = True
        )
        return register
    else:
        exists_user = await User.get_or_none(gmail = user.email)
        if exists_user == None:
            email.create_code(user.email)
            email.send_email(user.name, user.email, email.get_code(user.email))
            register = await User.create(
                name = user.name,
                gmail = user.email,
                password = user.password
            )
            return register
        else:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, detail = "Gmail is already registred")


@router_user.post('/login')
async def login_user(credentials: Annotated[OAuth2PasswordRequestForm, Depends()]):    
    user = await User.get_or_none(gmail = credentials.username)
    
    if (user != None and user.status == True):
        if (user.password == to_hash_password(credentials.password)):
            if user.admin == True:
                return {
                    "access_token" : hash_token_admin(user.id), 
                    "token_type" : "bearer",
                    "name" : user.name,
                    "role" : 'admin'
                }
            else:
                return {
                    "access_token" : hash_token_user(user.id), 
                    "token_type" : "bearer",
                    "name" : user.name,
                    "role" : 'user'
                }
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Invalid user or password"
                )
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Incorret user or password"
            )


@router_user.post('/validate_email')
async def validate_emai(user: user_dto.UserValidateEmail, depends: Annotated[str, Depends(combine_verify)]):
    if validate_email(user.email):
        pass
    else:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="O email é inválido.")
    
    use = await User.get_or_none(gmail = user.email)
    code = email.get_code(user.email)
    if use.status != False:
        if int(user.secret_code) == code:
            update = await User.get(gmail = user.email)
            update.status_email = True
            await update.save()
            return status.HTTP_200_OK
        else:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, detail= 'Invalid code')
    else:
        return HTTPException(status.HTTP_404_NOT_FOUND, detail = 'User not exists')


@router_user.post('/request_recover_password')
async def request_recover_password(user: user_dto.UserRequestRecoverPassword):
    if validate_email(user.email):
        pass
    else:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="O email é inválido.")
    
    use = await User.get_or_none(gmail=user.email)
    
    if not use:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail='User not exists')
    
    recover_password_email.create_code(user.email)
    recover_password_email.send_email(use.name, user.email, recover_password_email.get_code(user.email))


@router_user.post('/recover_password')
async def recover_password(user: user_dto.UserRecoverPassword):
    if validate_email(user.email):
        pass
    else:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="O email é inválido.")
    
    use = await User.get_or_none(gmail=user.email)
    
    if not use:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail='User not exists')
    
    if user.code == recover_password_email.get_code(user.email):
        use.password = user.password
        await use.save()
        return True
    return False
