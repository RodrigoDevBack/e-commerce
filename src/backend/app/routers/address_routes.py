from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from pydantic_models import address_dto
from tortoise_models.model_address_db import Address
from tortoise_models.model_user_db import User
from security.user_depends import combine_verify


router_address = APIRouter(
    tags = ['Adress'],
    responses = {404: {'Description': 'Not found'}}
    )


@router_address.get('/get', response_model=address_dto.AddressResponse)
async def get_address(credential: Annotated[int, Depends(combine_verify)]):
    user = await User.get_or_none(id=credential)
    
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail='User not exists')
    
    address = await Address.get_or_none(user=user)
    
    if not address:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail='Address not found')
    
    return address

@router_address.post('/create')
async def create_address(data: address_dto.CreateAddress, credential: Annotated[int, Depends(combine_verify)]):
    user = await User.get_or_none(id=credential)
    
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail='User not exists')
    
    address = await Address.get_or_none(user = user)
        
    if address:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail='Address already created')

    address = await Address.create(
                                    user=user,
                                    CEP= data.CEP, 
                                    Logradouro=data.Logradouro, 
                                    Numero = data.Numero, 
                                    Complemento = data.Complemento,
                                    Bairro = data.Bairro,
                                    Cidade = data.Cidade,
                                    Estado = data.Estado,
                                    Pais = data.Pais
                                    )
    
    return status.HTTP_201_CREATED


@router_address.patch('/edit')
async def edit_address(data: address_dto.EditAddress, credential: Annotated[int, Depends(combine_verify)]):
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
    if data.Pais != None and data.Pais != '' and data.Pais != 'string':
        address.Pais = data.Pais
    
    await address.save()
    
    return status.HTTP_200_OK


@router_address.delete('/delete')
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
