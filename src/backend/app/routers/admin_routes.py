from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from security.user_depends import get_user_admin
from typing import Annotated, List, Optional
from tortoise_models.model_user_db import User
from tortoise_models.model_product_db import Product
from pydantic_models.admin_dto import Admin_Create_Product, Admin_Disable_User, Admin_Update_Product, Admin_Delete_Product
from pydantic_models.user_dto import UserResponseDTO
from fastapi import HTTPException, status
from integrations.image_save import add_image


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


@router_admin.post('/create-product', response_model = Admin_Create_Product)
async def create_product(name: str = Form(...), description: str = Form(...), qtd: int = Form(...), price: float = Form(...), images: List[UploadFile] = File(...), depends =  Depends(get_user_admin)):
    names_files_images = list()
    for image in images:
        names_files_images.append(add_image(name, image))
        
    product = await Product.create(
        name = name,
        description = description,
        qtd = qtd,
        price = price,
        images = names_files_images
    )
    
    return product

@router_admin.put('/edit-product')
async def edit_product(id: int = Form(...), name: Optional[str] = Form(None), description: Optional[str] = Form(None), qtd: Optional[int] = Form(None), price: Optional[float] = Form(None), images: Optional[List[UploadFile]] = File(None), depends = Depends(get_user_admin)):
    product_update = await Product.get_or_none(id = id)
    
    current_images = product_update.images
    
    if not product_update:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail= 'Product not found'
        )
    
    if name != None:
        product_update.name = name
    if description != None:
        product_update.description = description
    if qtd != None:
        product_update.qtd = qtd
    if price != None:
        product_update.price = price
    if images != None and len(images) != 0:
        for image in images:
            current_images.append(add_image(product_update.name, image))
        
    images = current_images
    product_update.images = images
    await product_update.save()
    return product_update


@router_admin.delete('/delete-product')
async def delete_product(product_id: Admin_Delete_Product, depends: Annotated[str, Depends(get_user_admin)]):
    product_exists = await Product.get_or_none(id = product_id.id)
    if not product_exists:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Product not found"
        )
    await product_exists.delete()
    
    return status.HTTP_200_OK
