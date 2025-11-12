from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from security.user_depends import get_user_admin
from typing import Annotated, List, Optional
from tortoise_models.model_user_db import User
from tortoise_models.model_product_db import Product
from pydantic_models.admin_dto import Admin_Create_Product, Admin_Disable_User, Admin_Update_Product, Admin_Delete_Product, Admin_Response_Product
from pydantic_models.user_dto import UserResponseDTO
from fastapi import HTTPException, status
from integrations.image_save import add_image, delete_directory_product, delete_product_image


router_admin = APIRouter(
    tags = ['Admin'],
    responses = {404: {'Description': 'Not found'}}
)


@router_admin.get('/users', response_model = List[UserResponseDTO])
async def get_users(depends: Annotated[str, Depends(get_user_admin)]):
    users = await User.all()
    return users


@router_admin.patch('/disable-client-account')
async def disable_client_account(user: Admin_Disable_User, depends: Annotated[str, Depends(get_user_admin)]):
    use = await User.get_or_none(gmail = user.gmail)
    if user == None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail = 'User not exists')
    else: 
        use.status = False
        await use.save()
        return {status.HTTP_200_OK : 'Status updated'}


@router_admin.post('/add-product-image')
async def add_product_image(id: int = Form(...), image: UploadFile = File(...), depends =  Depends(get_user_admin)):
    product = await Product.get_or_none(id=id)
    
    if not product:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail='Product not found'
        )
    
    if not product.images:
        images = []
    else:
        images = list(product.images)

    images.append(add_image(product.name, image))
    
    product.images = images
    await product.save()
    return True

@router_admin.post('/create-product', response_model = Admin_Response_Product)
async def create_product(data: Admin_Create_Product, depends =  Depends(get_user_admin)):
    product = await Product.create(
        name = data.name,
        description = data.description,
        qtd = data.qtd,
        price = data.price,
    )
    
    return product

@router_admin.put('/edit-product', response_model=Admin_Update_Product)
async def edit_product(data: Admin_Update_Product, depends = Depends(get_user_admin)):
    product_update = await Product.get_or_none(id = data.id)
    
    if not product_update:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail= 'Product not found'
        )
    
    if data.name != None:
        product_update.name = data.name
    if data.description != None:
        product_update.description = data.description
    if data.qtd != None:
        product_update.qtd = data.qtd
    if data.price != None:
        product_update.price = data.price
        
    await product_update.save()
    return product_update

@router_admin.patch('/delete-product-image')
async def edit_product_image(id: int = Form(...), del_image: str = Form(...), depends =  Depends(get_user_admin)):
    product = await Product.get_or_none(id=id)
    
    if not product:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail= 'Product not found'
        )
    
    if not product.images:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail= 'Product don´t have images'
        )
    else:
        images = list(product.images)
    
    if delete_product_image(product.name, del_image):
        images.remove(del_image)
        product.images = images
        await product.save()
        return True
    else:
        return False


@router_admin.delete('/delete-product')
async def delete_product(product_id: Admin_Delete_Product, depends: Annotated[str, Depends(get_user_admin)]):
    product_exists = await Product.get_or_none(id = product_id.id)
    if not product_exists:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Product not found"
        )
    await product_exists.delete()
    delete_directory_product(product_exists.name)
    return status.HTTP_200_OK
