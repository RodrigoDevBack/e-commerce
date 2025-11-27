from typing import List
from schemas.user import UserSchemas

from models.user import User

class AdminService:
    
    @staticmethod
    async def get_users() -> list:
        users = await User.all()
        return users
    
    @staticmethod
    def serialize_users_response(users: List[User]) -> list:
        userList = []
        for user in users:
            serialize_user = UserSchemas.UserResponseSchema(
                id=user.id,
                name=user.name,
                gmail=user.gmail,
                status_email=user.status_email,
                status=user.status,
                admin=user.admin
            )
            userList.append(serialize_user)
        return userList
    
