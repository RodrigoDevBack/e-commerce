from fastapi import APIRouter, Depends, HTTPException, status
from security.user_depends import get_user_admin
from typing import Annotated
from tortoise_models.model_user_db import User

router_admin = APIRouter(
    tags = ['Admin'],
    responses = {404: {'Description': 'Not found'}}
)

@router_admin.get('/users')
async def get_users(depends: Annotated[str, Depends(get_user_admin)]):
    users = await User.all()
    return users

@router_admin.get('/disable-client-account')
async def disable_client_account(depends: Annotated[str, Depends(get_user_admin)]):
    pass

@router_admin.post('/create-product')
async def create_product(depends: Annotated[str, Depends(get_user_admin)]):
    pass

@router_admin.put('/edit-product')
async def edit_product(depends: Annotated[str, Depends(get_user_admin)]):
    pass

@router_admin.delete('/delete-product')
async def delete_product(depends: Annotated[str, Depends(get_user_admin)]):
    pass
