import os
from dotenv import load_dotenv
from contextlib import asynccontextmanager
from tortoise import Tortoise
from fastapi import FastAPI

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await Tortoise.init(
        db_url= os.getenv('DATABASE_URL'),
        modules= {'models': ["models.tortoise"]},
    )
    await Tortoise.generate_schemas()
    yield
    await Tortoise.close_connections()
