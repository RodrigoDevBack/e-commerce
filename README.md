# 🛒 E-commerce — Plataforma Completa

![MIT](https://img.shields.io/badge/License-MIT-green.svg)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)

## 📌 Sobre o Projeto

Este é um **e-commerce completo**, desenvolvido com:

- **Backend:** FastAPI + Tortoise ORM
- **Frontend:** HTML, CSS e JavaScript
- **Serviços adicionais:** Envio de e-mail, autenticação JWT, carrinho de compras, pedidos, CRUD de produtos, gerenciamento administrativo.

O objetivo é entregar uma solução limpa, escalável e pronta para evolução.

---

## 🚀 Como Rodar o Projeto

Certifique-se de ter **Docker + Docker Compose** instalados.

<pre class="overflow-visible!" data-start="1027" data-end="1064"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-bash"><span><span>docker compose up --build
</span></span></code></div></div></pre>

Após subir os containers:

**📄 Swagger da API:**

[http://localhost:5000/docs](http://localhost:5000/docs)

---

## 📦 Estrutura do Projeto

```
├── docs/
│   ├── diagrams/
│   │   └── (arquivos de diagramas)
│   ├── documento_oficial.pdf
│   └── README_DOCS.md
│
├── examples/
│   └── documents/
│       └── color_pallete.md
│
├── src/
│   └── backend/
│       └── app/
│           ├── db/
│           │   └── config_db.py
│           │
│           ├── integrations/
│           │   ├── code_recover_password/
│           │   │   └── .gitkeep
│           │   ├── code_validate_email/
│           │   │   └── .gitkeep
│           │   ├── images_products/
│           │   │   └── .gitkeep
│           │   ├── email_client.py
│           │   ├── image_save.py
│           │   └── recover_password_client.py
│           │
│           ├── pydantic_models/
│           │   ├── admin_dto.py
│           │   ├── cart_dto.py
│           │   ├── product_dto.py
│           │   └── user_dto.py
│           │
│           ├── routers/
│           │   ├── admin_routes.py
│           │   ├── cart_routes.py
│           │   ├── client_app_routes.py
│           │   └── user_routes.py
│           │
│           ├── security/
│           │   ├── encrypter_password.py
│           │   └── user_depends.py
│           │
│           ├── tortoise_models/
│           │   ├── model_cart_db.py
│           │   ├── model_history_order_db.py
│           │   ├── model_order_db.py
│           │   ├── model_product_db.py
│           │   └── model_user_db.py
│           │
│           ├── .dockerignore
│           ├── .env
│           ├── dockerfile
│           ├── main.py
│           └── requirements.txt
│
├── frontend/
│   ├── api/
│   │   ├── admin/
│   │   │   ├── create_product.php
│   │   │   ├── delete_product.php
│   │   │   └── edit_product.php
│   │   │
│   │   ├── cart/
│   │   │   ├── add_product_cart.php
│   │   │   ├── get_products_cart.php
│   │   │   ├── order_product_cart.php
│   │   │   └── remove_product_cart.php
│   │   │
│   │   ├── login/
│   │   │   ├── login.php
│   │   │   ├── recover_password.php
│   │   │   ├── register.php
│   │   │   ├── request_recover_password.php
│   │   │   └── validate_email.php
│   │   │
│   │   └── product/
│       │   ├── get_all_products.php
│       │   └── get_featured_products.php
│   │
│   ├── assets/
│   │   └── images/
│   │       └── background_loja.jpg
│   │
│   ├── css/
│   │   ├── adminproducs.css
│   │   ├── base.css
│   │   ├── carousel.css
│   │   ├── cart.css
│   │   ├── checkout.css
│   │   ├── footer.css
│   │   ├── header.css
│   │   ├── hero.css
│   │   ├── login.css
│   │   ├── main.css
│   │   ├── products.css
│   │   ├── register.css
│   │   └── responsive.css
│   │
│   ├── js/
│   │   ├── adminProducts.js
│   │   ├── appInit.js
│   │   ├── carousel.js
│   │   │── checkout.js
│   │   ├── home.js
│   │   ├── login.js
│   │   ├── main.js
│   │   ├── produtos.js
│   │   ├── register.js
│   │   └── router.js
│   │
│   ├── dockerfile
│   └── index.html
│
├── .gitignore
├── LICENSE
├── README.md
└── docker-compose.yml
```

---

## 📚 Documentação Completa

Toda documentação do projeto está organizada dentro da pasta **/docs/**.

- 📄 [`docs/installation.md`]() – Instalação detalhada
- 📄 [`docs/architecture.md`](docs/architecture.md) – Arquitetura do sistema
- 📄 [`docs/backend.md`]() – Guia completo do backend
- 📄 [`docs/frontend.md`]() – Guia do frontend
- 📄 [`docs/api-reference.md`]() – Endpoints da API
- 📄 [`docs/team.md`]() – Equipe e contribuições
- 📄 [`docs/changelog.md`]() – Histórico de versões

---

## 🧩 Funcionalidades Principais

- Cadastro/login com JWT
- Carrinho de compras
- Sistema de pedidos
- CRUD completo de produtos
- Envio de e-mails
- Upload e exibição de imagens
- Área administrativa
- Layout responsivo

---

## 👨‍💻 Tecnologias Utilizadas

### Backend

- FastAPI
- Tortoise ORM
- SQLite / PostgreSQL
- JWT Auth
- SMTP Email

### Frontend

- HTML
- CSS
- JavaScript (Fetch API)

---

## 👥 Equipe

- **[@Rodrigo Moraes](https://github.com/RodrigoDevBack)** — Backend, API, Github
- **[@Lucas Paiva](https://github.com/lucaspaiva-lp)** — Frontend, Documentação, Github
- **[@Raian](https://github.com/lucaspaiva-lp)** — Design

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