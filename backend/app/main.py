from fastapi import FastAPI
from db.config_db import lifespan
from routers import user_routes, admin_routes, client_app_routes, cart_routes

def config_app():
    app = FastAPI(lifespan=lifespan)
    app.include_router(user_routes.router_user)
    app.include_router(admin_routes.router_admin)
    app.include_router(client_app_routes.router_client_app)
    app.include_router(cart_routes.router_cart)
    return app
    
app = config_app()

@app.get('/')    
async def inicio():
    return {'Bem vindo': 
"""
Vá para localhost:port/docs
Para vislumbrar as rotas disponíveis
"""}

