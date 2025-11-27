from typing import (
    Annotated,
    List,
)

from fastapi import ( 
    APIRouter,
    Depends,
    status,
    File,
    UploadFile,
    Form,
)

from security.user_depends import get_user_admin

from schemas.admin import ( 
    AdminCreateProductSchema,
    AdminDisableUserSchema,
    AdminUpdateProductSchema,
    AdminDeleteProductSchema,
    AdminResponseProductSchema,
)
from schemas.user import UserSchemas

from service.admin import AdminService
from service.user import UserService
from service.product import ProductService


admin = APIRouter(
    tags = ['Admin'],
    responses = {404: {'Description': 'Not found'}}
)


@admin.get('/users', response_model = List[UserSchemas.UserResponseSchema])
async def get_users(
    depends: Annotated[str, Depends(get_user_admin)]
    ):
    """...
    
    Retorna todos os usuários que estão ativos ou não ativos.
    
    O retorno consiste numa lista de multiplos dados de usuário.

    Args:
        depends role: Admin

    Returns:
    [
        {
            "id": 0,
            "name": "string",
            "gmail": "string",
            "status_email": true,
            "status": true,
            "admin": true
        }
    ]
    
...
    """
    users = await AdminService.get_users()
    
    users_response = AdminService.serialize_users_response(users)
    
    return users_response


@admin.patch('/disable-client-account')
async def disable_client_account(
    user: AdminDisableUserSchema,
    depends: Annotated[str, Depends(get_user_admin)]
    ):
    
    """...
    
    Desabilita permanentemente a conta do usuário.
    
    Necessita usar o gmail do usuário para desabilitar a conta permanentemente.

    Returns:
        {
            200 OK: "Status updated"
        }
...
    """
    
    if await UserService.user_exists_gmail(user.gmail):
        use = await UserService.get_user_gmail(user.gmail)
        await UserService.desactivate_user(use)
        
        return {status.HTTP_200_OK : 'Status updated'}


@admin.post('/add-product-image')
async def add_product_image(
    id: int = Form(...),
    image: UploadFile = File(...),
    depends =  Depends(get_user_admin)
    ):
    
    """...
    
    Adiciona a imagem ao produto cadastrado.
    
    Solicita:
        {
            "id": int,
            "image": File
        }
    
    Returns:
        {
            True
        }
...
    """
    
    product = await ProductService.get_product_id(id)
    
    await ProductService.add_image_product(product, image)
    
    return True


@admin.post('/create-product', response_model = AdminResponseProductSchema)
async def create_product(
    data: AdminCreateProductSchema,
    depends =  Depends(get_user_admin)
    ):
    
    product = await ProductService.create_product(data)
    
    return product


@admin.put('/edit-product', response_model=AdminUpdateProductSchema)
async def edit_product(
    data: AdminUpdateProductSchema,
    depends = Depends(get_user_admin)
    ):
    
    product_update = await ProductService.get_product_id(data.id)
    
    product_update = await ProductService.update_product(product_update, data)
    
    return product_update


@admin.patch('/delete-product-image')
async def delete_product_image(
    id: int = Form(...),
    del_image: str = Form(...),
    depends =  Depends(get_user_admin)
    ):
    
    product = await ProductService.get_product_id(id)
    
    return await ProductService.delete_image(product, del_image)


@admin.delete('/delete-product')
async def delete_product(
    product_id: AdminDeleteProductSchema,
    depends: Annotated[str, Depends(get_user_admin)]
    ):
    
    product_exists = await ProductService.get_product_id(product_id.id)
    
    ProductService.delete_product(product_exists)
    
    return status.HTTP_200_OK
