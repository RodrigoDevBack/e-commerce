# e-commerce
Site e-commerce

Como rodar:
Inicie o Docker desktop(Se no windows, se contrário, continue com os próximos passos):
Entre na pasta e-commerce
abra o terminal no diretório e-commerce
digite:
`docker compose up --build`

O site será iniciado na porta 8000

Link: http://localhost:8000

A api será iniciada na porta 5000

Acesse a interface da api pelo link:
http://localhost:5000/docs



Estrutura de pastas:
```shell
.
├── docker-compose.yml
├── docs
│   ├── diagrams
│   │   ├── caso_de_uso
│   │   │   ├── administrado_caso_de_uso.png
│   │   │   └── client_caso_de_uso.png
│   │   ├── class_and_object
│   │   │   └── classe_e_objetos.png
│   │   ├── flowchart
│   │   │   ├── administrador_flowchart.drawio.png
│   │   │   └── client_flowchart.png
│   │   └── notes.txt
│   └── documento_oficial.pdf
├── examples
│   ├── color_pallete.md
│   └── documents
│       ├── diagrama_classe_e_objeto(2).png
│       ├── diagrama_classe_e_objeto.gif
│       ├── flowchart(2).svg
│       └── flowchart.webp
├── LICENSE
├── README.md
└── src
    ├── backend
    │   └── app
    │       ├── db
    │       │   └── config_db.py
    │       ├── dockerfile
    │       ├── integrations
    │       │   ├── code_recover_password
    │       │   ├── code_validate_email
    │       │   ├── email_client.py
    │       │   ├── image_save.py
    │       │   ├── images_products
    │       │   └── recover_password_client.py
    │       ├── main.py
    │       ├── pydantic_models
    │       │   ├── address_dto.py
    │       │   ├── admin_dto.py
    │       │   ├── cart_dto.py
    │       │   ├── history_dto.py
    │       │   ├── product_dto.py
    │       │   └── user_dto.py
    │       ├── requirements.txt
    │       ├── routers
    │       │   ├── address_routes.py
    │       │   ├── admin_routes.py
    │       │   ├── cart_routes.py
    │       │   ├── client_app_routes.py
    │       │   └── user_routes.py
    │       ├── security
    │       │   ├── encrypter_password.py
    │       │   └── user_depends.py
    │       ├── service
    │       └── tortoise_models
    │           ├── model_address_db.py
    │           ├── model_cart_db.py
    │           ├── model_history_order_db.py
    │           ├── model_order_db.py
    │           ├── model_product_db.py
    │           ├── model_user_db.py
    └── frontend
        ├── api
        │   ├── admin
        │   │   ├── create_product.php
        │   │   ├── delete_product.php
        │   │   └── edit_product.php
        │   ├── cart
        │   │   ├── add_product_cart.php
        │   │   ├── get_products_cart.php
        │   │   ├── order_product_cart.php
        │   │   └── remove_product_cart.php
        │   ├── login
        │   │   ├── login.php
        │   │   ├── logout.php
        │   │   ├── recover_password.php
        │   │   ├── register.php
        │   │   ├── request_recover_password.php
        │   │   └── validate_email.php
        │   └── product
        │       ├── get_all_products.php
        │       └── get_featured_products.php
        ├── assets
        │   └── images
        │       └── background_loja.jpg
        ├── css
        │   ├── adminproducs.css
        │   ├── base.css
        │   ├── carousel.css
        │   ├── cart.css
        │   ├── checkout.css
        │   ├── footer.css
        │   ├── header.css
        │   ├── hero.css
        │   ├── login.css
        │   ├── main.css
        │   ├── products.css
        │   ├── register.css
        │   └── responsive.css
        ├── dockerfile
        ├── index.html
        └── js
            ├── adminProducts.js
            ├── appInit.js
            ├── carousel.js
            ├── checkout.js
            ├── home.js
            ├── login.js
            ├── main.js
            ├── produtos.js
            ├── register.js
            └── router.js
```