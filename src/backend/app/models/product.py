from tortoise.models import Model
from tortoise import fields


class Product(Model):
    id = fields.IntField(primary_key = True)
    name = fields.TextField()
    description = fields.TextField()
    qtd = fields.IntField()
    images = fields.JSONField(null = True)
    price = fields.FloatField()
    
    items_in_cart = fields.ReverseRelation['Order']
