from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os, shutil, time

def configure_image(app: FastAPI) -> FastAPI:
    app.mount("/images_products", StaticFiles(directory="/app/integrations/images_products"), name="/images_products")
    return app
        
        
def generate_new_name_image(filename) -> str:
    name, extension = os.path.splitext(filename)
    alteration = int(time.time())
    return f"{name}_{alteration}{extension}"


def create_new_directory_product(name_product) -> None:
    os.makedirs(f"/app/integrations/images_products/{name_product}", exist_ok=True)


def delete_product_image(name_product, name_image) -> bool:
    path = f"/app/integrations/images_products/{name_product}/{name_image}"
    try:
        if os.path.exists(path):
            os.remove(path)
            return True
    except FileNotFoundError or PermissionError or Exception:
        return False


def delete_directory_product(name_product) -> bool:
    path = f"/app/integrations/images_products/{name_product}"
    if os.path.exists(path):
        shutil.rmtree(path)
        return True
    return False
    
def add_image(name_product, file) -> str:
    new_name_file = generate_new_name_image(file.filename)
    create_new_directory_product(name_product)
    file_loc = os.path.join(f"/app/integrations/images_products/{name_product}", new_name_file)
    with open(file_loc, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        return new_name_file
