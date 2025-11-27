# Arquitetura do Sistema

Loja Virtual Minimalista para Pequenos Negócios

## 1. Visão Geral da Arquitetura

O sistema é composto por duas camadas principais:

* **Frontend SPA Modular** desenvolvido em HTML, CSS e JavaScript puro, estruturado em módulos independentes para cada funcionalidade da aplicação.
* **Backend REST** desenvolvido com FastAPI, dividido em módulos bem definidos (routers, models, DTOs, services e integrações).
* **Banco de dados** utilizando SQLite em desenvolvimento e PostgreSQL como opção final.
* **Infraestrutura com Docker** , permitindo execução isolada entre frontend, backend e banco.

A arquitetura prioriza simplicidade, modularidade e fácil manutenção, garantindo evolução futura sem mudanças drásticas na estrutura do projeto.

---

## 2. Arquitetura do Backend (FastAPI)

### 2.1 Visão Geral

A API segue uma arquitetura modular, organizada por contexto de domínio. As principais camadas são:

* **Routers:** definem os endpoints.
* **Models (Tortoise ORM):** gerenciam estruturas de dados no banco.
* **DTOs (Pydantic):** validam entrada e saída de dados.
* **Services / integrações:** serviços externos (e-mail, recuperação de senha, manipulação de imagens).
* **Camada de segurança:** criptografia e dependências para autenticação/autorização.
* **Configuração do banco:** inicialização, migrações e conexão.

### 2.2 Estrutura das Camadas

#### 2.2.1 Routers (`/routers`)

Responsáveis pelas rotas da API. Cada arquivo representa um contexto funcional:

* `user_routes.py`: cadastro, login, validação de email, perfil.
* `cart_routes.py`: adicionar, remover, visualizar carrinho.
* `product_routes.py` (via admin e client): produtos disponíveis, CRUD.
* `address_routes.py`: cadastro e gerenciamento de endereços.
* `admin_routes.py`: ações exclusivas do administrador.
* `client_app_routes.py`: funções específicas do cliente.

#### 2.2.2 Models (`/tortoise_models`)

Mapeamento ORM utilizando Tortoise ORM:

* `model_user_db.py`: usuários, permissões e status de email.
* `model_product_db.py`: produtos, imagens e estoque.
* `model_cart_db.py`: carrinho vinculado ao usuário.
* `model_order_db.py`: pedidos realizados.
* `model_history_order_db.py`: histórico de pedidos.
* `model_address_db.py`: endereços do usuário.

#### 2.2.3 DTOs (`/pydantic_models`)

DTOs garantem validação de entrada e saída:

* `user_dto.py`
* `product_dto.py`
* `cart_dto.py`
* `admin_dto.py`
* `address_dto.py`
* `history_dto.py`

#### 2.2.4 Serviços e integrações (`/integrations`)

Implementam funcionalidades externas:

* `email_client.py`: envio de e-mails (confirmação, recuperação de senha).
* `recover_password_client.py`: fluxo completo de recuperação.
* `image_save.py`: tratamento e armazenamento de imagens.
* `code_recover_password/`: códigos de verificação temporários.
* `code_validate_email/`: validação de email.

#### 2.2.5 Segurança (`/security`)

* `encrypter_password.py`: hash de senhas.
* `user_depends.py`: middleware de autenticação JWT.

#### 2.2.6 Configuração e inicialização

* `config_db.py`: configuração do banco e inicialização do Tortoise ORM.
* `main.py`: ponto de entrada da aplicação FastAPI.

---

## 3. Arquitetura do Frontend (SPA Modular)

### 3.1 Visão Geral

O frontend utiliza uma Single Page Application desenvolvida sem frameworks, estruturada em módulos JavaScript. O carregamento inicial ocorre no `index.html`, e a navegação entre telas é feita dinamicamente via JavaScript, sem recarregar páginas.

### 3.2 Organização dos Módulos

#### 3.2.1 JavaScript (`/js`)

Cada arquivo representa um módulo funcional:

* `main.js`: inicialização principal da SPA.
* `router.js`: roteamento interno entre telas.
* `login.js`: autenticação do usuário.
* `register.js`: criação de conta.
* `produtos.js`: listagem e detalhes dos produtos.
* `cart.js`: gerenciamento do carrinho.
* `checkout.js`: finalização do pedido.
* `adminProducts.js`: gerenciamento de produtos pelo admin.
* `perfil-usuario.js`: edição de dados pessoais.

#### 3.2.2 CSS (`/css`)

Arquitetura modular semelhante ao JavaScript:

* `main.css`: arquivo principal que importa os demais.
* `responsive.css`: regras de responsividade.
* `products.css`: listagem e página de produto.
* `cart.css`: carrinho.
* `checkout.css`: etapa de pagamento.
* `adminproducts.css`: área administrativa.
* `themes.css`: paleta de cores e variáveis.

#### 3.2.3 API (PHP auxiliar)

Embora o backend oficial seja FastAPI, há scripts PHP legados para consumo de dados em algumas funcionalidades, divididos por contexto:

* `api/address/`
* `api/admin/`
* `api/cart/`
* `api/history/`
* `api/login/`
* `api/product/`

Esses módulos podem ser mantidos como fallback ou substituídos integralmente pela API FastAPI.

---

## 4. Comunicação Frontend ↔ Backend

A comunicação é feita via chamadas REST, utilizando JSON.

Exemplo de fluxo:

1. O usuário navega pela SPA.
2. Um módulo JS chama o backend (ex.: `/api/products`).
3. O backend retorna DTOs validados.
4. O módulo da SPA renderiza dinamicamente o conteúdo sem recarregar a página.

Autenticação utiliza **JWT** no header Authorization.

---

## 5. Banco de Dados

O banco utiliza Tortoise ORM e suporta:

* SQLite (desenvolvimento)
* PostgreSQL (produção)

### Principais tabelas:

* users
* products
* cart_items
* orders
* history_orders
* addresses

Relações:

* Um usuário possui um carrinho.
* Um carrinho contém vários produtos.
* Um pedido contém múltiplos itens.
* Um usuário possui múltiplos endereços.

---

## 6. Fluxos Principais

### 6.1 Fluxo de Compra (Cliente)

1. Usuário navega pelos produtos.
2. Adiciona itens ao carrinho.
3. Acessa o carrinho.
4. Faz login ou cria conta (obrigatório nesta etapa).
5. Confirma endereço.
6. Finaliza pedido.

### 6.2 Fluxo Administrativo

1. Admin faz login.
2. Acessa módulo de produtos.
3. Cria, edita ou remove produtos.
4. Pode consultar histórico e atividades futuras da plataforma.

---

## 7. Docker e Infraestrutura

O sistema utiliza Docker para isolar cada camada:

```
docker-compose.yml
 ├── backend: expõe a API FastAPI
 ├── frontend: serve arquivos estáticos
 └── database: ambiente do banco (opcional)
```

Cada container possui seu próprio Dockerfile, garantindo portabilidade e repetibilidade do ambiente.

---

## 8. Decisões Arquiteturais

* Uso de SPA pura para reduzir dependência de frameworks.
* Utilização de FastAPI pela performance e facilidade de documentação.
* Modularidade rígida nos dois lados (backend e frontend).
* Separação completa entre responsabilidades.
* Estrutura escalável para futura migração para frameworks como React ou Vue, se necessário.
* Uso de Tortoise ORM para simplicidade e produtividade.
* Docker como ferramenta de orquestração.

---

## 9. Conclusão

A arquitetura foi projetada com foco em simplicidade, facilidade de manutenção e clara separação entre camadas. O modelo modular permite evolução contínua e incremental, garantindo capacidade de expansão para demandas futuras, tanto para clientes quanto para administradores.

Ela atende aos requisitos do projeto, mantendo qualidade, organização e fundamentação técnica adequada para uso acadêmico e profissional.
