from fastapi import FastAPI

from .client import client
from .cart import cart
from .address import address
from .user import user
from .admin import admin

class Router():
    def include_router(app: FastAPI):
        app.include_router(router = user, prefix="/user")
        app.include_router(router = admin, prefix="/admin")
        app.include_router(router = client, prefix="/app")
        app.include_router(router = cart, prefix="/cart")
        app.include_router(router = address, prefix="/address")
        return app
