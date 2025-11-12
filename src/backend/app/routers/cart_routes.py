from typing import Annotated

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status

from security.user_depends import combine_verify
from pydantic_models.cart_dto import (
    AddProductCart,
    DeleteProductCart,
    ResponseCart,
)

from pydantic_models.history_dto import ResponseHistory

from tortoise_models.model_product_db import Product
from tortoise_models.model_order_db import Order
from tortoise_models.model_cart_db import Cart
from tortoise_models.model_user_db import User
from tortoise_models.model_history_order_db import OrderHistory


router_cart = APIRouter(tags=["Cart"], responses={404: {"Description": "Not found"}})


async def _serialize_cart_snapshot(cart: Cart) -> dict:
    """Transforma o carrinho em um dicionário serializável para o histórico de pedidos.

    Retorna uma dict: {created_at, items: [{product:{...}, qtd, unity_price}], total}
    """
    orders = await cart.orders.all().prefetch_related('product')
    items = []
    total = 0.0
    for o in orders:
        p = o.product
        item = {
            'product': {
                'id': p.id,
                'name': p.name,
                'description': p.description,
                'price': float(p.price),
                'images': p.images,
            },
            'qtd': int(o.qtd),
            'unity_price': float(o.unity_price),
        }
        total += item['qtd'] * item['unity_price']
        items.append(item)

    return {
        'created_at': datetime.now(timezone.utc).isoformat(),
        'items': items,
        'total': total,
    }

async def _diminuir_estoque_produtos(cart: Cart):
    orders = await cart.orders.all().prefetch_related('product')
    for o in orders:
        p = o.product
        p.qtd -= o.qtd
        if p.qtd < 0:
            p.qtd = 0
        await p.save()

@router_cart.get("/get", response_model=ResponseCart)
async def get_product_cart(credential: Annotated[str, Depends(combine_verify)]):
    user = await User.get(id=credential)
    cart = await Cart.filter(user=user).first()
    if not cart:
        await Cart.create(user=user)
    cart = await Cart.get(user=user).prefetch_related("user", "orders__product")

    return cart


@router_cart.get("/history", response_model=ResponseHistory)
async def get_history(credential: Annotated[str, Depends(combine_verify)]):
    user = await User.get(id=credential)
    history = await OrderHistory.get_or_none(user=user)

    if not history or not history.orders:
        raise HTTPException(status_code=status.HTTP_204_NO_CONTENT, detail="No content in History")

    # Retornar o histórico do pedido como um dicionário serializado
    return {"id": history.id, "user": history.user_id, "orders": history.orders}


@router_cart.post("/order")
async def request_order(credential: Annotated[str, Depends(combine_verify)]):
    user = await User.get_or_none(id=credential)

    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail='User not exists')

    cart = await Cart.get_or_none(user=user)

    if not cart:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail='Cart not exists')

    orders_list = await cart.orders.all().prefetch_related('product')
    
    if not orders_list:
        raise HTTPException(status.HTTP_204_NO_CONTENT, detail='Cart dont have products')

    # Converter a tabela de carrinho em um dado serializável para o histórico
    snapshot = await _serialize_cart_snapshot(cart)

    order_history = await OrderHistory.get_or_none(user=user)
    
    if not order_history:
        order_history = await OrderHistory.create(user=user, orders=[snapshot])
    else:
        history_list = order_history.orders or []
        history_list.append(snapshot)
        order_history.orders = history_list
        await order_history.save()

    # Diminuir o estoque dos produtos comprados    
    await _diminuir_estoque_produtos(cart)
    
    # Limpar o carrinho após a finalização do pedido
    await Order.filter(cart=cart).delete()
    
    return {"id": order_history.id, "user": order_history.user_id, "orders": order_history.orders}


@router_cart.post("/add")
async def add_product_cart(
    add: AddProductCart, credential: Annotated[str, Depends(combine_verify)]
):
    user = await User.get(id=credential)
    product = await Product.filter(id=add.product_id).first()

    cart = await Cart.filter(user=user).first()
    if not cart:
        cart = await Cart.create(user=user)

    item = await Order.filter(cart=cart, product=product).first()
    if item:
        item.qtd += add.qtd
        item.unity_price = product.price
        await item.save()
    else:
        item = await Order.create(
            cart=cart, product=product, qtd=add.qtd, unity_price=product.price
        )
    return item


@router_cart.delete("/delete")
async def remove_product_cart(
    delete: DeleteProductCart, credential: Annotated[str, Depends(combine_verify)]
):
    user = await User.get_or_none(id=credential)
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail='User not exists')

    product = await Product.filter(id=delete.product_id).first()
    if not product:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail='Product not exists')

    cart = await Cart.get_or_none(user=user)
    if not cart:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail='Cart not exists')

    order = await Order.filter(cart=cart, product=product).first()
    if order:
        deleted_id = order.id
        await order.delete()
        return {"deleted_order_id": deleted_id}
    else:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Product not exists in cart")
