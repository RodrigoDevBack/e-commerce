# e-commerce
Site e-commerce

Como rodar:
Iniciado o Docker(Se no windows, se contrário, continue com os próximos passos):
Entre na pasta e-commerce
abra o terminal no diretório e-commerce
digite:
`docker compose up --build`

Ele irá iniciar o backend na porta 5000

Acesse o Swagger da api pelo link:
http://localhost:5000/docs



Estrutura de pastas:
```shell
.
├── backend
│   └── app
│       ├── db
│       │   └── config_db.py
│       ├── dockerfile
│       ├── integrations
│       │   ├── code_validate_email
│       │   ├── email_client.py
│       │   ├── image_save.py
│       │   └── images_products
│       ├── main.py
│       ├── pydantic_models
│       │   ├── admin_dto.py
│       │   ├── cart_dto.py
│       │   ├── product_dto.py
│       │   └── user_dto.py
│       ├── requirements.txt
│       ├── routers
│       │   ├── admin_routes.py
│       │   ├── cart_routes.py
│       │   ├── client_app_routes.py
│       │   └── user_routes.py
│       ├── security
│       │   ├── encrypter_password.py
│       │   └── user_depends.py
│       └── tortoise_models
│           ├── model_cart_db.py
│           ├── model_history_order_db.py
│           ├── model_order_db.py
│           ├── model_product_db.py
│           └── model_user_db.py
├── docker-compose.yml
├── frontend
│   ├── controler
│   ├── dockerfile
│   ├── services
│   └── views
├── LICENSE
└── README.md
```