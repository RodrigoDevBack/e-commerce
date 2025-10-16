from fastapi import APIRouter, Depends, HTTPException, status
from tortoise_models.model_product_db import Product
from pydantic_models.product_dto import Product_Response
from typing import List
router_client_app = APIRouter(
    tags = ['Client'],
    responses = {404: {'Description': 'Not found'}}
)

@router_client_app.get('/get-products')
async def get_products():
    products = await Product.all()
    return products
