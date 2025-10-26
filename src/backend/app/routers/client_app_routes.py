from typing import List
from fastapi import APIRouter
from tortoise_models.model_product_db import Product
from pydantic_models.product_dto import Product_Response

router_client_app = APIRouter(
    tags = ['Client'],
    responses = {404: {'Description': 'Not found'}}
)

@router_client_app.get('/get-products', response_model= List[Product_Response])
async def get_products():
    products = await Product.all()
    return products
