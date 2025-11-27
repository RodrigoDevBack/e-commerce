from fastapi import HTTPException, status
from schemas.admin import AdminCreateProductSchema, AdminUpdateProductSchema
from models.product import Product
from integrations.image_save import (
    add_image,
    delete_directory_product,
    delete_product_image,
    move_images_a_new_path,
)

class ProductService:
    @staticmethod    
    async def get_product_id(id: int) -> Product:
        product = await Product.get_or_none(id=id)
        if not product:
            raise HTTPException(
                status.HTTP_404_NOT_FOUND,
                detail='Product not found'
            )
        return product
    
    @staticmethod
    async def add_image_product(product: Product, image):
        if not product.images:
            images = []
        else:
            images = list(product.images)

        images.append(add_image(product.name, image))
        
        product.images = images
        await product.save()
        return True
    
    @staticmethod
    async def create_product(data: AdminCreateProductSchema):
        product = await Product.create(
            name = data.name,
            description = data.description,
            qtd = data.qtd,
            price = data.price,
        )
        return product
    
    @staticmethod
    async def update_product(product_update: Product, data: AdminUpdateProductSchema):
        if data.name != None:
            falha = move_images_a_new_path(product_update.name, data.name)
            if falha != True:
                raise HTTPException(status.HTTP_400_BAD_REQUEST, detail= f"Ao mover as imagens ocorreu uma falha misteriosa.")
            product_update.name = data.name
            
        if data.description != None:
            product_update.description = data.description
            
        if data.qtd != None:
            product_update.qtd = data.qtd
            
        if data.price != None:
            product_update.price = data.price
            
        await product_update.save()
        return product_update

    @staticmethod
    async def delete_image(product: Product, del_image):
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
        
    @staticmethod
    async def delete_product(product_exists: Product):
        await product_exists.delete()
        delete_directory_product(product_exists.name)
        return True
    
    