from tortoise.models import Model
from tortoise import fields
from .model_user_db import User

class Cart(Model):
    id = fields.IntField(primary_key = True)
    
    user: fields.ForeignKeyRelation[User] = fields.ForeignKeyField(
        'models.User', related_name = 'carts'
    )
    
    orders = fields.ReverseRelation['Order']
