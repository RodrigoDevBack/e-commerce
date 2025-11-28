from typing import List

from fastapi import APIRouter

from schemas.product import ProductResponseSchema

from service.client import Client


client = APIRouter(
    tags = ['Client'],
    responses = {404: {'Description': 'Not found'}}
)


@client.get('/get-products', response_model= List[ProductResponseSchema])
async def get_products():
    """...
    
    Busca todos os produtos cadastrados.
    
    Retorna [] se não houver item cadastrado.
    
    Returns:
    [
        {
            "id": 0,
            "name": "string",
            "description": "string",
            "qtd": 0,
            "price": 0,
            "images": [
                "string"
            ]
        }
    ]
...
"""
    products = await Client.get_products()
    
    return products


@client.get('/get-featured-products', response_model= List[ProductResponseSchema])
async def get_featured_products():
    """...
    
    Busca os itens cadastrados com maior estoque, retorna os 6 maiores na ordem Decrescente.
    
    Retorna [] se não houver itens cadastrados.

    Returns:
    [
        {
            "id": 0,
            "name": "string",
            "description": "string",
            "qtd": 0,
            "price": 0,
            "images": [
                "string"
            ]
        }
    ]
...
    """
    featured_products = await Client.get_featured_products()
    
    return featured_products
    
