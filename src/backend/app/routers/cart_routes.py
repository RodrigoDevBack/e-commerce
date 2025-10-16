from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from security.user_depends import combine_verify

from pydantic_models.cart_dto import Gmail_User, Add_Product_Cart, Delete_Product_Cart, Response_Cart

from tortoise_models.model_product_db import Product
from tortoise_models.model_order_db import Order
from tortoise_models.model_cart_db import Cart
from tortoise_models.model_user_db import User


router_cart = APIRouter(
    tags = ['Cart'],
    responses = {404: {'Description': 'Not found'}}
)

@router_cart.post('/get', response_model=Response_Cart)
async def get_product_cart(gmail: Gmail_User, depends: Annotated[str, Depends(combine_verify)]):
    user = await User.get_or_none(gmail = gmail.gmail)
    cart = await Cart.get(user = user).prefetch_related('user', 'orders__product')
    
    return cart
    

@router_cart.post('/order')
async def request_order(depends: Annotated[str, Depends(combine_verify)]):
    pass


@router_cart.post('/add')
async def add_product_cart(add: Add_Product_Cart, depends: Annotated[str, Depends(combine_verify)]):
    user = await User.filter(gmail = add.gmail).first()
    product = await Product.filter(id = add.product_id).first()
    
    cart = await Cart.filter(user = user).first()
    if not cart:
        cart = await Cart.create(user = user)
    
    item = await Order.filter(cart = cart, product = product).first()
    if item:
        item.qtd += add.qtd
        item.unity_price = product.price
        await item.save()
    else:
        item = await Order.create(cart = cart, product = product, qtd = add.qtd, unity_price = product.price)
    return item


@router_cart.delete('/delete')
async def remove_product_cart(delete: Delete_Product_Cart, depends: Annotated[str, Depends(combine_verify)]):
    user = await User.filter(gmail = delete.gmail)
    product = await Product.filter(id = delete.product_id).first()
    cart = await Cart.filter(user = user).first()
    order = await Order.filter(cart = cart, product = product).first()
    if order:
        order.delete()
        return order
    else:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail = 'Product not exists')
    
