from tortoise.models import Model
from tortoise import fields

class Product(Model):
    id = fields.IntField(primary_key = True)
    name = fields.TextField()
    qtd = fields.IntField()
    images = fields.TextField()
    price = fields.FloatField()
    
    cart: fields.ForeignKeyRelation = fields.ForeignKeyField(
        'models.Cart', related_name = 'cart'
    )
