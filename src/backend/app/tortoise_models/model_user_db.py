from tortoise.models import Model
from tortoise import fields

class User(Model):
    id = fields.IntField(primary_key = True)
    name = fields.TextField()
    gmail = fields.TextField()
    password = fields.CharField(max_length = 500)
    status_email = fields.BooleanField(default = False) # (status == True) == Email validado or (status == False) == Email não validado
    status = fields.BooleanField(default = True) # (status == True) == Usuário ativo (status == False) == Usuário inativo
    admin = fields.BooleanField(default = False) # (admin == True) == Usuário é admin se False, então não é.
    
    orderHistory = fields.ReverseRelation['OrderHistory']
    address = fields.ReverseRelation['Address']
    carts = fields.ReverseRelation['Cart']
    
    def __str__(self):
        return self.gmail, self.password, self.name
    
    class Meta:
        table = "users"
