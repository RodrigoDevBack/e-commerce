from tortoise.models import Model
from tortoise import fields

class Cart(Model):
    
    products: fields.ReverseRelation['Product']
    
    user: fields.ForeignKeyRelation = fields.ForeignKeyField(
        'models.User', related_name='cart'
    )
    