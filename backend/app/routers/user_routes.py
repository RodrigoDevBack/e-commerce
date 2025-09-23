from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from pydantic_models import user_dto
from tortoise_models.model_user_db import User
from security.encrypter_password import to_hash_password, hash_token_user, hash_token_admin
from security.user_depends import combine_verify
from email_validator import EmailNotValidError, validate_email
from integrations.email_client import Email_Client

email = Email_Client()

router_user = APIRouter(
    tags = ['User'],
    responses = {404: {'Description': 'Not found'}}
)

@router_user.post('/register', response_model = user_dto.UserResponseDTO)
async def register_user(user: user_dto.RegisterUserDTO):
    try:
        validate_email(user.email, check_deliverability = False)
    except EmailNotValidError as e:
        raise HTTPException(status.HTTP_400_BAD_REQUEST)
    
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
                    "token_type" : "bearer"
                }
            else:
                return {
                    "access_token" : hash_token_user(user.id), 
                    "token_type" : "bearer"
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
        return HTTPException(status.HTTP_400_BAD_REQUEST, detail = 'User not exists')


@router_user.post('/recover_password')
async def recover_password(depends: Annotated[str, Depends(combine_verify)]):
    pass
