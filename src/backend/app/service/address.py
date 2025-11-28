from fastapi import (
    HTTPException,
    status,
)

from schemas.address import CreateAddressSchema, EditAddressSchema
from models.address import Address
from models.user import User


class AddressService:
    
    @staticmethod
    async def create_address(data: CreateAddressSchema, address: Address, user: User):
        if data.Complemento == None or data.Complemento == '' or data.Complemento == 'string':
            await Address.create(
                user=user,
                CEP= data.CEP, 
                Logradouro=data.Logradouro, 
                Numero = data.Numero, 
                Complemento = '',
                Bairro = data.Bairro,
                Cidade = data.Cidade,
                Estado = data.Estado,
            )
        else:
            await Address.create(
                user=user,
                CEP= data.CEP, 
                Logradouro=data.Logradouro, 
                Numero = data.Numero, 
                Complemento = data.Complemento,
                Bairro = data.Bairro,
                Cidade = data.Cidade,
                Estado = data.Estado,
            )
        
        return {
                status.HTTP_201_CREATED,
            }
    
    @staticmethod
    async def get(user: User):
        address = await Address.get_or_none(user=user)
    
        if not address:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail='Address not found')
        
        return address
    

    @staticmethod
    async def exists_address(user):
        address = await Address.get_or_none(user=user)
        if address:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, detail='Address already created')
        
    
    @staticmethod
    async def edit(data: EditAddressSchema, address: Address):
        if data.CEP != None and data.CEP != '' and data.CEP != 'string':
            address.CEP = data.CEP
            
        if data.Logradouro != None and data.Logradouro != '' and data.Logradouro != 'string':
            address.Logradouro = data.Logradouro
            
            
        if data.Numero != None and data.Numero != 0:
            address.Numero = data.Numero
            
            
        if data.Complemento != None and data.Complemento != '' and data.Complemento != 'string':
            address.Complemento = data.Complemento
            
            
        if data.Bairro != None and data.Bairro != '' and data.Bairro != 'string':
            address.Bairro = data.Bairro
            
            
        if data.Cidade != None and data.Cidade != '' and data.Cidade != 'string':
            address.Cidade = data.Cidade
            
            
        if data.Estado != None and data.Estado != '' and data.Estado != 'string':
            address.Estado = data.Estado
        
        
        await address.save()
        
        return status.HTTP_200_OK
    

    @staticmethod
    async def delete(address: Address):
        await address.delete()
        
        await address.save()
        
        return status.HTTP_200_OK