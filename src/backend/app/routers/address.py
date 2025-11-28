from typing import Annotated

from fastapi import (
    APIRouter,
    Depends,
)

from schemas.address import (
    AddressResponseSchema,
    EditAddressSchema,
    CreateAddressSchema,
)

from security.user_depends import combine_verify

from service.user import UserService
from service.address import AddressService


address = APIRouter(
    tags = ['Address'],
    responses = {404: {'Description': 'Not found'}}
    )


@address.get('/get', response_model=AddressResponseSchema)
async def get_address(credential: Annotated[int, Depends(combine_verify)]):
    
    user = await UserService.get_by_id(credential)
    
    return await AddressService.get(user)


@address.post('/create')
async def create_address(
    data: CreateAddressSchema,
    credential: Annotated[int, Depends(combine_verify)]
    ):
    
    user = await UserService.get_by_id(credential)
    
    await AddressService.exists_address(user)
    
    return await AddressService.create_address(data, address, user)
    

@address.patch('/edit')
async def edit_address(data: EditAddressSchema, credential: Annotated[int, Depends(combine_verify)]):
    user = await UserService.get_by_id(credential)
    
    address = await AddressService.get(user)

    return await AddressService.edit(data, address, user)


@address.delete('/delete')
async def delete_address(credential: Annotated[int, Depends(combine_verify)]):
    user = await UserService.get_by_id(credential)
    
    address = await AddressService.get(user)
    
    return await AddressService.delete(address)
