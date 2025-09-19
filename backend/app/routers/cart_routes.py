from fastapi import APIRouter, Depends, HTTPException, status
from security.user_depends import get_user_logon
from typing import Annotated
from tortoise_models.model_user_db import User


router_cart = APIRouter(
    tags = ['Cart'],
    responses = {404: {'Description': 'Not found'}}
)

@router_cart.get('/get')
async def get_product_cart(depends: Annotated[str, Depends(get_user_logon)]):
    pass

@router_cart.post('/order')
async def request_order(depends: Annotated[str, Depends(get_user_logon)]):
    pass

@router_cart.post('/add')
async def add_product_cart(depends: Annotated[str, Depends(get_user_logon)]):
    pass

@router_cart.put('/edit')
async def edit_product_cart(depends: Annotated[str, Depends(get_user_logon)]):
    pass

@router_cart.delete('/delete')
async def remove_product_cart(depends: Annotated[str, Depends(get_user_logon)]):
    pass
