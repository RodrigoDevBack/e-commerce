# Changelog

Registro oficial de alterações e evolução do sistema.
Este documento acompanha todas as versões lançadas, incluindo correções, melhorias, novas funcionalidades e alterações que possam gerar impacto no uso ou na integração com o sistema.

---

## **1.0.0 — Release Inicial**

**Data:** 2025-11-27

**Link:**

### **Visão geral**

Primeiro release completo da aplicação, incluindo backend (FastAPI + Tortoise ORM), frontend SPA modular (HTML/JS), sistema administrativo e fluxo completo de compra.

### **Funcionalidades principais**

- **Autenticação de usuários**
  - Registro
  - Login
  - Recuperação de senha
  - Validação de e-mail
  - Atualização de perfil
- **Módulo de Endereços**
  - Criação, edição, remoção e listagem
- **Carrinho de compras**
  - Adição e remoção de produtos
  - Carrinho persistente para usuários autenticados
  - Carrinho temporário para visitantes
- **Catálogo de produtos**
  - Listagem geral
  - Produtos em destaque
  - Exibição no frontend
  - Integração com rotas do backend
- **Histórico de pedidos**
  - Consulta de pedidos anteriores pelo usuário autenticado
- **Fluxo de checkout**
  - Finalização de compra
  - Processamento do pedido
- **Módulo Administrativo**
  - Painel inicial
  - Cadastro de produtos
  - Edição de produtos
  - Exclusão de produtos
  - Atualização de status de e-mail do usuário
- **Integrações internas**
  - Serviço de envio de e-mail
  - Sistema de códigos para validação e recuperação de senha
  - Upload e armazenamento de imagens de produtos

### **Frontend (SPA)**

- Estrutura modular baseada em JavaScript ES Modules
- Router baseado em hash (`<span>#home</span>`, `<span>#produtos</span>`, `<span>#login</span>` etc.)
- Carrinho flutuante integrado ao roteamento
- Menu dinâmico + menu mobile
- Páginas:
  - Home
  - Produtos
  - Login
  - Cadastro
  - Checkout
  - Perfil do usuário
  - Admin de produtos
- Layout responsivo com Bootstrap e CSS próprio

### **Backend**

- Estruturado em módulos:
  - Routers (address, admin, cart, client_app, user)
  - DTOs (Pydantic)
  - Modelos (Tortoise ORM)
  - Serviços de e-mail e upload
- Endpoints documentados
- Autenticação baseada em token
- Migrations automáticas via Tortoise ORM
- Implementação de segurança básica (criptografia de senha)

### **Correções e melhorias internas**

- Tratamento padronizado de erros no backend
- Ajustes no roteamento do frontend
- Ajustes nos componentes do carrinho
- Uniformização dos DTOs
- Separação clara entre modelos de armazenamento e de entrada
