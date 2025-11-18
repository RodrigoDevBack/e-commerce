from tortoise.models import Model
from tortoise import fields

from .model_user_db import User

class Address(Model):
    id = fields.IntField(pk=True)
    
    user: fields.ForeignKeyRelation[User] = fields.ForeignKeyField(
        'models.User', related_name='address'
    )
    
    CEP = fields.CharField(max_length=8)
    Logradouro = fields.CharField(max_length=150)
    Numero =  fields.IntField()
    Complemento = fields.TextField(default=None)
    Bairro = fields.CharField(max_length=150)
    Cidade = fields.CharField(max_length=75)
    Estado = fields.CharField(max_length=35)
    
    class Meta:
        table = "address"
