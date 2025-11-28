from fastapi import FastAPI
from routers.router import Router
from db.config_db import lifespan
from integrations.image_save import configure_image

def config_app():
    app = FastAPI(lifespan=lifespan)
    app = Router.include_router(app)
    app = configure_image(app)
    return app
    
app = config_app()

@app.get('/')    
async def inicio():
    return {'Bem vindo': """ Vá para /docs, para vislumbrar as rotas disponíveis """}
