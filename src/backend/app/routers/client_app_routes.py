from typing import List
from fastapi import APIRouter
from pydantic_models.product_dto import ProductResponse
from tortoise_models.model_product_db import Product

router_client_app = APIRouter(
    tags = ['Client'],
    responses = {404: {'Description': 'Not found'}}
)

@router_client_app.get('/get-products', response_model= List[ProductResponse])
async def get_products():
    products = await Product.all()
    return products

@router_client_app.get('/get-featured-products')
async def get_featured_products():
    products = await Product.all().order_by('-qtd')
    featured_products = products[0:6]
    
    return featured_products
    
