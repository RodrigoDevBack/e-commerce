## 🛒 **E-commerce Full Stack — Backend e Frontend Integrados**

## 📌 Sobre o Projeto

Este é um **e-commerce completo**, desenvolvido com:

- **Backend:** FastAPI + Tortoise ORM
- **Frontend:** HTML, CSS e JavaScript
- **Serviços adicionais:** Envio de e-mail, autenticação JWT, carrinho de compras, pedidos, CRUD de produtos, gerenciamento administrativo.

O objetivo é entregar uma solução limpa, escalável e pronta para evolução.

---

## 🚀 Como Rodar o Projeto

Certifique-se de ter **Docker + Docker Compose** instalados.

```
cd e-commerce
docker compose up --build
```

> ⚠️ Use `<span>--build</span>` apenas na primeira vez ou quando houver alterações nos Dockerfiles.

- **Frontend:**[http://localhost:8000]()
- **API Backend (Swagger):**[http://localhost:5000/docs]()

> As tabelas do banco de dados são criadas automaticamente na primeira execução.

---

## 📦 Estrutura do Projeto

```
e-commerce/
├── docs/
│   ├── installation.md
│   ├── architecture.md
│   ├── backend.md
│   ├── frontend.md
│   ├── api-reference.md
│   ├── team.md
│   └── changelog.md
├── examples/
├── src/
│   ├── backend/
│   └── frontend/
├── docker-compose.yml
├── LICENSE
└── README.md
```

> A estrutura completa detalhada está disponível dentro de cada pasta.

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
- PostgreSQL (ou SQLite para testes)
- JWT Auth
- SMTP Email

### Frontend

- HTML
- CSS
- JavaScript (Fetch API)

### DevOps / Infraestrutura

- Docker + Docker Compose

---

## 👥 Equipe

- [**@Rodrigo Moraes**]() — Backend, API, GitHub
- [**@Lucas Paiva**]() — Frontend, Documentação, Roadmap, GitHub

---

## 📚 Documentação Completa

Toda documentação do projeto está organizada dentro da pasta **/docs/**.

- 📄 [`docs/installation.md`]() – Instalação detalhada
- 📄 [`docs/architecture.md`](docs/architecture.md) – Arquitetura do sistema
- 📄 [`docs/api-reference.md`]() – Endpoints da API
- 📄 [`docs/team.md`]() – Equipe e contribuições
- 📄 [`docs/changelog.md`]() – Histórico de versões
