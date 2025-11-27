from typing import Annotated

from fastapi import (
    APIRouter,
    Depends,
    status,
)

from service.product import ProductService
from security.user_depends import combine_verify

from schemas.cart import (
    AddProductCartSchema,
    DeleteProductCartSchema,
    ResponseCart,
)
from schemas.history import ResponseHistorySchema

from service.cart import  CartService
from service.user import UserService

cart = APIRouter(
    tags=["Cart"],
    responses={404: {"Description": "Not found"}}
)


@cart.get("/get", response_model=ResponseCart)
async def get_product_cart(credential: Annotated[str, Depends(combine_verify)]):
    cart = await CartService.get_cart(credential)

    return cart


@cart.get("/history", response_model=ResponseHistorySchema)
async def get_history(credential: Annotated[str, Depends(combine_verify)]):
    history = await CartService.get_history(credential)
    
    # Retornar o histórico do pedido como um dicionário serializado
    return await CartService.serialize_get_history(history)


@cart.post("/order")
async def request_order(credential: Annotated[str, Depends(combine_verify)]):
    await UserService.user_exists_by_id(credential)
    user = await UserService.get_by_id(credential)

    cart = await CartService.get_cart(user)

    # Converter a tabela de carrinho em um dado serializável para o histórico
    snapshot = await CartService._serialize_cart_snapshot(cart)

    order_history = await CartService.get_order_history(user)
    
    order_history = await CartService.effective_order(
        order_history,
        user,
        snapshot,
        cart
    )
    
    return {"id": order_history.id, "user": order_history.user_id, "orders": order_history.orders}


@cart.post("/add")
async def add_product_cart(
    add: AddProductCartSchema, credential: Annotated[str, Depends(combine_verify)]
):
    item = await CartService.add_product_cart(credential, add)
    
    return item


@cart.delete("/delete")
async def remove_product_cart(
    delete: DeleteProductCartSchema, credential: Annotated[str, Depends(combine_verify)]
):
    await UserService.user_exists_by_id(credential)
    
    cart = await CartService.get_cart(credential)
    
    await ProductService.get_product_id(delete.product_id)
    
    return await CartService.remove_product_cart(cart, delete)

@cart.delete("/delete-all")
async def remove_all_products_cart(credential: Annotated[str, Depends(combine_verify)]):
    await UserService.user_exists_by_id(credential)
    
    cart = await CartService.get_cart(credential)
    
    await CartService.remove_all_product_cart(cart)
    
    return status.HTTP_200_OK