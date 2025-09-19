from fastapi import APIRouter, Depends, HTTPException, status


router_client_app = APIRouter(
    tags = ['Client'],
    responses = {404: {'Description': 'Not found'}}
)

@router_client_app.get('/get-products')
async def get_products():
    pass
