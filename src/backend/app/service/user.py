import re

from fastapi import HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from security.encrypter_password import ( 
    to_hash_password,
    hash_token_user,
    hash_token_admin,
)

from models.user import User

from integrations.recover_password import PasswordRecoverEmail

from integrations.email_client import Email_Client

from schemas.user import UserSchemas


class UserService:
    
    @staticmethod
    async def validate_gmail_with_code(user: UserSchemas.UserValidateEmailSchema, use: User):
        code = Email_Client.get_code(user.email)
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
    
    
    @staticmethod
    async def request_recover_code(user: UserSchemas.UserRequestRecoverPasswordSchema, use: User):
        PasswordRecoverEmail.create_code(user.email)
        PasswordRecoverEmail.send_email(use.name, user.email, PasswordRecoverEmail.get_code(user.email))
        return True
    
    
    @staticmethod
    async def effectivate_recover_password(user: UserSchemas.UserRecoverPasswordSchema, use: User):
        if user.code == PasswordRecoverEmail.get_code(user.email):
            use.password = user.password
            await use.save()
            return True
        return False
    
    
    @staticmethod
    async def validate_gmail(gmail):
        regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9._]+\.[A-Z|a-z]{2,7}\b'
        def validate_email(email):
            if not email:
                return False
            elif re.fullmatch(regex, email):
                return True
            else:
                return False
        if validate_email(gmail):
            return True
        else:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="O email é inválido.")
    
    
    @staticmethod
    async def user_exists_by_gmail(gmail: str):
        user = await User.get_or_none(gmail=gmail)
        if user == None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail = 'User not exists')
        return True


    @staticmethod
    async def user_exists_by_id(id: int):
        user = await User.get_or_none(id=id)
        if user == None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail = 'User not exists')
        return True
    
    
    @staticmethod    
    async def get_by_gmail(gmail: str) -> User:
        user = await User.get(gmail=gmail)
        return user
    
    
    @staticmethod
    async def _desactivate(user: User):
        user.status = False
        await user.save()
        return True
    
     
    @staticmethod
    async def get_by_id(id: int):
        user = await User.get(id=id)
        return user
    
    
    @staticmethod
    async def get_or_none(gmail, credentials: OAuth2PasswordRequestForm):
        user = await User.get_or_none(gmail = credentials.username)
    
    @staticmethod
    async def login(user: User, credentials: OAuth2PasswordRequestForm):
        if (user != None and user.status == True):
            if (user.password == to_hash_password(credentials.password)):
                if user.admin == True:
                    return {
                        "access_token" : hash_token_admin(user.id), 
                        "token_type" : "bearer",
                        "name" : user.name,
                        "role" : 'admin',
                        "email_validate": user.status_email
                    }
                else:
                    return {
                        "access_token" : hash_token_user(user.id), 
                        "token_type" : "bearer",
                        "name" : user.name,
                        "role" : 'user',
                        "email_validate": user.status_email
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
            
    @staticmethod
    async def register(user: UserSchemas.RegisterUserSchema):
        if await User.get_or_none(id = 1) == None:
            Email_Client.create_code(user.email)
            Email_Client.send_email_admin(user.name, user.email, Email_Client.get_code(user.email))
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
                Email_Client.create_code(user.email)
                Email_Client.send_email(user.name, user.email, Email_Client.get_code(user.email))
                register = await User.create(
                    name = user.name,
                    gmail = user.email,
                    password = user.password
                )
                return register
            else:
                raise HTTPException(status.HTTP_400_BAD_REQUEST, detail = "Gmail is already registred")
