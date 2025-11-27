from typing import Annotated

from fastapi import ( 
    APIRouter,
    Depends,
)
from fastapi.security import OAuth2PasswordRequestForm

from schemas.user import UserSchemas

from security.user_depends import combine_verify

from service.user import UserService


user = APIRouter(
    tags = ['User'],
    responses = {404: {'Description': 'Not found'}}
)


@user.get('/me', response_model=UserSchemas.UserResponseSchema)
async def get_profile_user(bearer: Annotated[str, Depends(combine_verify)]):
    return await UserService.get_by_id(bearer)


@user.post('/register', response_model = UserSchemas.UserResponseSchema)
async def register_user(user: UserSchemas.RegisterUserSchema):
    await UserService.validate_gmail(user.email)
    
    return await UserService.register(user)


@user.post('/login')
async def login_user(credentials: Annotated[OAuth2PasswordRequestForm, Depends()]):    
    user = await UserService.get_or_none(credentials)
    
    return await UserService.login(user, credentials)


@user.post('/validate_email')
async def validate_emai(user: UserSchemas.UserValidateEmailSchema):
    await UserService.validate_gmail(user.email)
    
    use = await UserService.get_by_gmail(user.email)
    
    return await UserService.validate_gmail_with_code(user, use)


@user.post('/request_recover_password')
async def request_recover_password(user: UserSchemas.UserRequestRecoverPasswordSchema):
    await UserService.validate_gmail(user.email)
    
    use = await UserService.get_by_gmail(user.email)
    
    return await UserService.request_recover_code(user, use)


@user.post('/recover_password')
async def recover_password(user: UserSchemas.UserRecoverPasswordSchema):
    await UserService.validate_gmail(user.email)
    
    use = await UserService.get_by_gmail(user.email)
    
    return await UserService.effectivate_recover_password(user, use)
