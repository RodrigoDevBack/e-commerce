from typing import Annotated

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from schemas.address import (
    AddressResponseSchema,
    EditAddressSchema,
    CreateAddressSchema,
)

from models.address import Address
from models.user import User
from security.user_depends import combine_verify


address = APIRouter(
    tags = ['Address'],
    responses = {404: {'Description': 'Not found'}}
    )


@address.get('/get', response_model=AddressResponseSchema)
async def get_address(credential: Annotated[int, Depends(combine_verify)]):
    
    user = await User.get_or_none(id=credential)
    
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail='User not exists')
    
    address = await Address.get_or_none(user=user)
    
    if not address:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail='Address not found')
    
    return address

@address.post('/create')
async def create_address(
    data: CreateAddressSchema,
    credential: Annotated[int, Depends(combine_verify)]
    ):
    
    user = await User.get_or_none(id=credential)
    
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail='User not exists')
    
    address = await Address.get_or_none(user = user)
        
    if address:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail='Address already created')
    
    if data.Complemento == None or data.Complemento == '' or data.Complemento == 'string':
        address = await Address.create(
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
        address = await Address.create(
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


@address.patch('/edit')
async def edit_address(data: EditAddressSchema, credential: Annotated[int, Depends(combine_verify)]):
    user = await User.get_or_none(id=credential)
    
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail='User not exists')
    
    address = await Address.get_or_none(user = user)
        
    if not address:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail='Address not found')
    
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


@address.delete('/delete')
async def delete_address(credential: Annotated[int, Depends(combine_verify)]):
    user = await User.get_or_none(id=credential)
    
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail='User not exists')
    
    address = await Address.get_or_none(user = user)
        
    if not address:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail='Address not found')

    await address.delete()
    
    await address.save()
    
    return status.HTTP_200_OK
