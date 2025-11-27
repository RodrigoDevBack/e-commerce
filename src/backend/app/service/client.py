from models.product import Product


class Client:
    
    @staticmethod
    async def get_products():
        products = await Product.all().order_by('id')
        return products
    
    @staticmethod
    async def get_featured_products():
        products = await Product.all().order_by('-qtd')
        featured_products = products[0:6]
        return featured_products

