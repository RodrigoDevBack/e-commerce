from tortoise.models import Model
from tortoise import fields

from .cart import Cart
from .product import Product


class Order(Model):
    id = fields.IntField(primary_key = True)
    
    cart: fields.ForeignKeyRelation[Cart] = fields.ForeignKeyField(
        'models.Cart', related_name = 'orders'
    )
    
    product: fields.ForeignKeyRelation[Product] = fields.ForeignKeyField(
        'models.Product', related_name = 'items_in_cart' 
    )
    
    qtd = fields.IntField(default = 1)
    unity_price = fields.DecimalField(max_digits = 6, decimal_places = 2)
    
    class Meta:
        unique_together = (('cart', 'product')) # Aqui não deixo itens se repetirem :)
