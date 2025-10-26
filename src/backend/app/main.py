from fastapi import FastAPI
from db.config_db import lifespan
from routers import user_routes, admin_routes, client_app_routes, cart_routes
from integrations.image_save import configure_image

def config_app():
    app = FastAPI(lifespan=lifespan)
    app.include_router(router = user_routes.router_user, prefix="/user")
    app.include_router(router = admin_routes.router_admin, prefix="/admin")
    app.include_router(router = client_app_routes.router_client_app, prefix="/app")
    app.include_router(router = cart_routes.router_cart, prefix="/cart")
    app = configure_image(app)
    return app
    
app = config_app()

@app.get('/')    
async def inicio():
    return {'Bem vindo': 
"""
Vá para localhost:port/docs
Para vislumbrar as rotas disponíveis
"""}

