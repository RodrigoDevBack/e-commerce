
# API Reference

Documentação técnica dos módulos, organizada por router, com comportamento fiel ao código fornecido.

---

# 1. Address Module

## 1.1. GET /address/get

Retorna o endereço associado ao usuário autenticado.

**Dependências:**

* `combine_verify`: obtém o ID do usuário autenticado.

**Fluxo interno:**

1. Verifica existência do usuário.
2. Retorna erro 404 caso não exista.
3. Busca o endereço associado.
4. Retorna erro 404 caso não exista.
5. Retorna `AddressResponse`.

---

## 1.2. POST /address/create

Cria o endereço do usuário autenticado.

**Comportamento específico do código:**

* Permite apenas um endereço por usuário.
* Caso já exista → 400.
* O campo `Complemento` é normalizado:
  * Se `None`, vazio ou `"string"` → convertido para `""`.

---

## 1.3. PATCH /address/edit

Atualiza parcialmente o endereço existente.

**Regra específica:**

São atualizados apenas campos:

* Não nulos
* Não vazios
* Diferentes da string `"string"`

**Erros:**

* Usuário inexistente → 404
* Endereço inexistente → 404

---

## 1.4. DELETE /address/delete

Remove o endereço do usuário autenticado.

**Erros:**

* Usuário inexistente → 404
* Endereço inexistente → 404

**Observação técnica:**

O código executa `address.delete()` seguido de `address.save()`, embora tal operação seja incoerente; documenta-se conforme implementado.

---

# 2. Admin Module

## 2.1. GET /admin/users

Retorna todos os usuários cadastrados.

**Dependência:**

* `get_user_admin`

**Resposta:**

* Lista de `UserResponseDTO`.

---

## 2.2. PATCH /admin/disable-client-account

Desativa uma conta de cliente com base no campo `gmail`.

**Erros:**

* Usuário não encontrado → 404

**Comportamento:**

* Define `status = False`
* Salva e retorna 200

---

## 2.3. POST /admin/add-product-image

Adiciona uma imagem ao produto.

**Inputs (multipart/form-data):**

* `id`: ID do produto
* `image`: arquivo de imagem

**Fluxo interno:**

* Busca o produto (404 se não existir).
* Executa `add_image()`.
* Atualiza a lista `product.images`.

---

## 2.4. POST /admin/create-product

Cria um produto.

**Campos:**

`name`, `description`, `qtd`, `price`

**Resposta:**

`AdminResponseProduct`

---

## 2.5. PUT /admin/edit-product

Edita informações do produto.

**Regras específicas:**

* Se o campo `name` for alterado, executa `move_images_a_new_path(old, new)`.
* Apenas campos não nulos são atualizados.

**Erros:**

* Produto não encontrado → 404
* Erro ao migrar imagens → 400

---

## 2.6. PATCH /admin/delete-product-image

Remove uma imagem específica de um produto.

**Inputs (Form):**

* `id`
* `del_image`

**Validações:**

* Produto inexistente → 404
* Produto sem imagens → 404
* Caso `delete_product_image()` retorne True, a imagem é removida da lista.

---

## 2.7. DELETE /admin/delete-product

Remove o produto do sistema.

**Validações:**

* Produto inexistente → 422

**Fluxo adicional:**

* Após exclusão, remove-se o diretório de imagens do produto.

---

# 3. Cart Module

## 3.1. GET /cart/get

Retorna o carrinho do usuário.

Se não existir, é criado automaticamente.

**Retorno inclui:**

* Usuário
* Orders
* Produtos (via `prefetch_related`)

---

## 3.2. GET /cart/history

Retorna o histórico de pedidos do usuário.

**Erros:**

* Histórico inexistente
* Lista `orders` vazia → 400

---

## 3.3. POST /cart/order

Finaliza o pedido.

**Processo conforme implementação:**

1. Verifica o usuário.
2. Verifica o carrinho.
3. Confirma existência de itens.
4. Gera *snapshot* com `created_at`, itens e total.
5. Insere no histórico.
6. Reduz o estoque dos produtos.
7. Remove os registros `Order` do carrinho.

**Retorno:**

Objeto contendo `id`, `user` e `orders`.

---

## 3.4. POST /cart/add

Adiciona produto ao carrinho.

**Comportamento:**

* Se o produto já existir no carrinho, incrementa quantidade.
* `unity_price` sempre atualizado com o preço atual.
* Se não existir, cria novo item.

---

## 3.5. DELETE /cart/delete

Remove um item específico do carrinho.

**Validações:**

* Usuário inexistente → 404
* Produto inexistente → 404
* Carrinho inexistente → 404
* Produto não presente no carrinho → 400

**Retorno:**

* ID do item removido

---

## 3.6. DELETE /cart/delete-all

Remove todos os itens do carrinho.

---

# 4. Client App Module

## 4.1. GET /get-products

Retorna todos os produtos existentes.

**Resposta:**

Lista de `ProductResponse`.

---

## 4.2. GET /get-featured-products

Retorna os seis produtos com maior quantidade em estoque.

**Ordenação:**

`order_by('-qtd')`

---

# 5. User Module

## 5.1. GET /user/me

Retorna informações do usuário autenticado.

**Modelo:**

`UserResponseDTO`

---

## 5.2. POST /user/register

Registra novo usuário.

**Regras específicas encontradas no código:**

* Caso não exista um usuário com ID = 1, o primeiro criado é marcado como  **admin** .
* Caso o email não exista, cria um usuário comum.
* Caso o email já exista → 400.

**Outros pontos:**

* Validação de email com regex.
* Envio de código via `email.create_code()` e `send_email()` / `send_email_admin()`.

---

## 5.3. POST /user/login

Autenticação via `OAuth2PasswordRequestForm`.

**Regras:**

* Validação de senha com `to_hash_password()`.
* Se usuário for admin → `hash_token_admin()`.
* Se usuário comum → `hash_token_user()`.

**Retorno:**

* `access_token`
* `token_type`
* `name`
* `role`
* `email_validate`

---

## 5.4. POST /user/validate_email

Valida o código enviado por email.

**Erros:**

* Email inválido → 400
* Usuário não encontrado → 404
* Código incorreto → 400

**Comportamento:**

* Se válido, define `status_email = True`.

---

## 5.5. POST /user/request_recover_password

Gera e envia código para recuperação de senha.

**Operações:**

* `recover_password_email.create_code()`
* `recover_password_email.send_email()`

---

## 5.6. POST /user/recover_password

Redefine a senha do usuário.

**Fluxo:**

1. Validação do email.
2. Verificação de existência do usuário.
3. Validação do código informado.
4. Atualização da senha (`password`).

---
