from datetime import datetime, timezone

from fastapi import HTTPException, status

from models.history_order import OrderHistory

from models.cart import Cart
from models.user import User
from models.order import Order
from models.product import Product

class CartService:
    
    @staticmethod
    async def add_product_cart(credential, add):
        user = await User.get(id=credential)
        product = await Product.filter(id=add.product_id).first()
        if not product:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail='Product not exists')
        
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
    
    @staticmethod
    async def remove_all_product_cart(cart):
        await Order.filter(cart=cart).delete()
    
    @staticmethod
    async def remove_product_cart(cart, delete):
        product = await Product.filter(id=delete.product_id).first()
        if not product:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail='Product not exists')

        order = await Order.filter(cart=cart, product=product).first()
        if order:
            deleted_id = order.id
            await order.delete()
            return {"deleted_order_id": deleted_id}
        else:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Product not exists in cart")
        
    @staticmethod
    async def effective_order(order_history, user, snapshot, cart):
        if not order_history:
            order_history = await OrderHistory.create(user=user, orders=[snapshot])
        else:
            history_list = order_history.orders or []
            history_list.append(snapshot)
            order_history.orders = history_list
            await order_history.save()
        
        # Diminuir o estoque dos produtos comprados    
        await CartService._diminuir_estoque_produtos(cart)
        # Limpar o carrinho após a finalização do pedido
        await Order.filter(cart=cart).delete()
        return order_history
    
    @staticmethod
    async def get_order_history(user):
        order_history = await OrderHistory.get_or_none(user=user)
        return order_history
    
    @staticmethod
    async def get_cart_with_product(user):
        cart = await Cart.get_or_none(user=user)

        if not cart:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail='Cart not exists')

        orders_list = await cart.orders.all().prefetch_related('product')
    
        if not orders_list:
            raise HTTPException(status.HTTP_204_NO_CONTENT, detail='Cart dont have products')
        
        return orders_list
    
    @staticmethod
    async def serialize_get_history(history):
        return {"id": history.id, "user": history.user_id, "orders": history.orders}
    
    @staticmethod
    async def get_history(credential):
        user = await User.get(id=credential)
        history = await OrderHistory.get_or_none(user=user)

        if not history or not history.orders:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No content in History")
        return history
    
    @staticmethod
    async def get_cart(credential):
        user = await User.get(id=credential)
        cart = await Cart.filter(user=user).first()
        if not cart:
            await Cart.create(user=user)
        cart = await Cart.get(user=user).prefetch_related("user", "orders__product")
        return cart
    
    @staticmethod
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

    
    @staticmethod
    async def _diminuir_estoque_produtos(cart: Cart):
        orders = await cart.orders.all().prefetch_related('product')
        for o in orders:
            p = o.product
            p.qtd -= o.qtd
            if p.qtd < 0:
                p.qtd = 0
            await p.save()
    
    
