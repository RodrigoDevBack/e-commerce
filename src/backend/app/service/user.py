from models.user import User
from fastapi import HTTPException, status

class UserService:
    
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
    async def desactivate(user: User):
        user.status = False
        await user.save()
        return True
        
    @staticmethod
    async def get_by_id(id: int):
        user = await User.get(id=id)
        return user
    
    @staticmethod
    async def set_user():
        pass

