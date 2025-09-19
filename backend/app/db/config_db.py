import os
from dotenv import load_dotenv
from contextlib import asynccontextmanager
from tortoise import Tortoise
from fastapi import FastAPI

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await Tortoise.init(
        db_url= f"postgres://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}",
        modules= {'models': ['tortoise_models.model_user_db', 'tortoise_models.model_cart_db', 'tortoise_models.model_product_db']},
        #modules= {'models': ['tortoise_models.model_user_db', 'tortoise_models.model_cart_db', 'tortoise_models.model_product_db', 'tortoise_models.model_order_db']},
        #modules= {'models': ['tortoise_models.model_user_db']},
    )
    await Tortoise.generate_schemas()
    yield
    await Tortoise.close_connections()

